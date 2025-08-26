// src/components/RegisterSaleForm.tsx
'use client';

import React, { useState } from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useProductContext } from '@/contexts/products/ProductContext';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  Tag,
} from 'lucide-react';

import Button from '@/components/ui/Button';

import {
  CartItem,
  DEFAULT_PAYMENT_FEES,
  PAYMENT_METHODS,
  PaymentConfig,
  PaymentOption,
  DiscountType,
  Sale,
  SaleItem,
} from '@/types/sale';

import { calculateSellingResume } from '@/utils/calcSale';

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: PAYMENT_METHODS.CASH, label: 'Dinheiro', icon: Banknote, fee: 0 },
  { id: PAYMENT_METHODS.DEBIT, label: 'Débito', icon: CreditCard, fee: 2.5 },
  { id: PAYMENT_METHODS.CREDIT, label: 'Crédito', icon: CreditCard, fee: 3.5 },
  { id: PAYMENT_METHODS.IFOOD, label: 'iFood', icon: Smartphone, fee: 15 },
];

export default function RegisterSaleForm() {
  const { state: finalProducts } = useProductContext();
  const { dispatch: salesDispatch } = useSalesContext();
  const { state: estoque, dispatch: estoqueDispatch } = useIngredientContext();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<PaymentConfig>({
    method: PAYMENT_METHODS.CASH,
    discount: { type: 'percentage', value: 0 },
    fees: DEFAULT_PAYMENT_FEES,
  });

  // ---------- Carrinho ----------
  const addToCart = (uid: string) =>
    setCart(prev => {
      const existing = prev.find(i => i.uid === uid);
      if (existing) return prev.map(i => (i.uid === uid ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { uid, quantity: 1 }];
    });

  const removeFromCart = (uid: string) => setCart(prev => prev.filter(i => i.uid !== uid));

  const updateQuantity = (uid: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(uid);
    setCart(prev => prev.map(i => (i.uid === uid ? { ...i, quantity } : i)));
  };

  // ---------- Estoque / Validação ----------
  const validateStock = (productUid: string, requestedQuantity: number) => {
    const product = finalProducts.products.find(p => p.uid === productUid);
    if (!product) return { isValid: false, missingIngredients: [] as string[] };

    const missingIngredients: string[] = [];

    const isValid = product.ingredients.every(ingredient => {
      const estoqueItem = estoque.ingredients.find(i => i.id === ingredient.id);
      const totalNeeded = ingredient.quantity * requestedQuantity;
      const hasEnough = !!estoqueItem && (estoqueItem.quantity ?? 0) >= totalNeeded;
      if (!hasEnough) missingIngredients.push(ingredient.name);
      return hasEnough;
    });

    return { isValid, missingIngredients };
  };

  const canMakeProduct = (productUid: string, requestedQuantity: number) =>
    validateStock(productUid, requestedQuantity).isValid;

  // ---------- Finalizar venda ----------
  const handleConfirmSale = () => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione itens ao carrinho.',
        variant: 'destructive',
      });
      return;
    }

    // valida todo o carrinho antes de mexer no estoque
    for (const item of cart) {
      const validation = validateStock(item.uid, item.quantity);
      if (!validation.isValid) {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        toast({
          title: 'Estoque insuficiente',
          description: `Não há ingredientes suficientes para "${product?.name}". Faltam: ${validation.missingIngredients.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }
    }

    // cria saleItems e atualiza estoque
    const saleItems: SaleItem[] = cart.map(item => {
      const product = finalProducts.products.find(p => p.uid === item.uid)!;

      product.ingredients.forEach(ingredient => {
        const totalToRemove = ingredient.quantity * item.quantity;
        const estoqueItem = estoque.ingredients.find(i => i.id === ingredient.id)!;
        estoqueDispatch({
          type: 'EDIT_INGREDIENT',
          payload: { ...estoqueItem, quantity: estoqueItem.quantity - totalToRemove },
        });
      });

      return {
        product,
        quantity: item.quantity,
        subtotal: (product.sellingPrice ?? 0) * item.quantity,
      };
    });

    // calcula resumo com util
    const sellingResume = calculateSellingResume(
      saleItems,
      payment.method,
      payment.discount,
      payment.fees
    );

    const sale: Sale = {
      id: uuidv4(),
      date: new Date().toISOString(),
      items: saleItems,
      sellingResume,
    };

    salesDispatch({ type: 'ADD_SALE', payload: sale });

    toast({
      title: 'Venda registrada com sucesso! 🎉',
      description: `Total: R$ ${sellingResume.totalValue.toFixed(2)} (${saleItems.length} itens)`,
      variant: 'accept',
    });

    setCart([]);
  };

  // ---------- Resumo em tempo real ----------
  const sellingResume = calculateSellingResume(
    cart
      .map(item => {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          subtotal: (product.sellingPrice ?? 0) * item.quantity,
        };
      })
      .filter(Boolean) as SaleItem[],
    payment.method,
    payment.discount,
    payment.fees
  );

  const { subtotal, fees, totalValue } = sellingResume;

  const discountValue: number = payment.discount
    ? payment.discount.type === 'percentage'
      ? (subtotal * payment.discount.value) / 100
      : payment.discount.value
    : 0;

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-6">
          <h1 className="text-primary text-xl font-bold">Sistema de Vendas</h1>
          <p className="text-muted-foreground">Selecione os produtos e configure o pagamento</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Produtos */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-lg p-6 shadow-sm">
              <h2 className="text-muted-foreground mb-4 text-xl font-semibold">
                Produtos Disponíveis
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {finalProducts.products.map(product => {
                  const inCart = cart.find(item => item.uid === product.uid);
                  const canMake = canMakeProduct(product.uid, (inCart?.quantity ?? 0) + 1);

                  return (
                    <div
                      key={product.uid}
                      className={`group relative overflow-hidden rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                        inCart ? 'border-accent-light bg-accent-light' : 'border-gray-200 bg-white'
                      } ${!canMake ? 'opacity-50' : ''}`}
                    >
                      <div className="mb-3">
                        <h3 className="text-primary font-semibold">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">{product.category}</p>
                      </div>

                      <div className="flex">
                        <img
                          className="rounded-xl"
                          src={'https://placehold.co/250'}
                          alt={product.name}
                        />
                      </div>

                      <div className="mb-3">
                        <p
                          className={`text-lg font-bold ${inCart ? 'text-primary font-black' : 'text-on-great'}`}
                        >
                          R$ {(product.sellingPrice ?? 0).toFixed(2)}
                        </p>
                      </div>

                      {inCart && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-accent text-surface flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                            {inCart.quantity}
                          </span>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={() => addToCart(product.uid)}
                        disabled={!canMake}
                        variant={inCart ? 'default' : 'outline'}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        {inCart ? 'Adicionar mais' : 'Adicionar'}
                      </Button>

                      {!canMake && (
                        <p className="text-on-critical mt-1 text-xs">Estoque insuficiente</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Carrinho e Pagamento */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Carrinho */}
              <div className="bg-surface rounded-lg p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <ShoppingCart className="text-primary h-5 w-5" />
                  <h3 className="text-lg font-semibold">Carrinho</h3>
                  <span className="text-primary bg-accent-light rounded-full px-2 py-1 text-xs font-medium">
                    {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingCart className="text-muted mx-auto h-12 w-12" />
                    <p className="text-muted-foreground mt-2 text-sm">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => {
                      const product = finalProducts.products.find(p => p.uid === item.uid);
                      if (!product) return null;

                      return (
                        <div
                          key={item.uid}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="flex-1">
                            <p className="text-muted-foreground font-medium">{product.name}</p>
                            <p className="text-muted-foreground text-sm">
                              R$ {product.sellingPrice?.toFixed(2)} cada
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.uid, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.uid, item.quantity + 1)}
                              disabled={!canMakeProduct(item.uid, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.uid)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Configuração de Pagamento */}
              {cart.length > 0 && (
                <div className="bg-surface rounded-lg p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Pagamento</h3>

                  {/* Método de Pagamento */}
                  <div className="mb-4">
                    <label className="text-muted-foreground mb-2 block text-sm font-medium">
                      Método de Pagamento
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_OPTIONS.map(option => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => setPayment(prev => ({ ...prev, method: option.id }))}
                            className={`flex items-center gap-2 rounded-lg border-2 p-3 text-sm transition-all ${
                              payment.method === option.id
                                ? 'border-accent-light bg-accent-light text-on-warning'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{option.label}</span>
                            {option.fee > 0 && (
                              <span className="text-muted-foreground ml-auto text-xs">
                                +{option.fee}%
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desconto */}
                  <div className="mb-4">
                    <label className="text-muted-foreground mb-2 block text-sm font-medium">
                      <Tag className="mr-1 inline h-4 w-4" />
                      Desconto
                    </label>
                    <div className="flex gap-2">
                      <select
                        title="Tipos de descontos"
                        value={payment.discount.type}
                        onChange={e =>
                          setPayment(prev => ({
                            ...prev,
                            discount: { ...prev.discount, type: e.target.value as DiscountType },
                          }))
                        }
                        className="rounded border px-3 py-2 text-sm"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">R$</option>
                      </select>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={payment.discount.value}
                        onChange={e =>
                          setPayment(prev => ({
                            ...prev,
                            discount: { ...prev.discount, value: Number(e.target.value) },
                          }))
                        }
                        className="flex-1 rounded border px-3 py-2 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Resumo */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {discountValue > 0 && (
                      <div className="text-on-great flex justify-between text-sm">
                        <span>Desconto:</span>
                        <span>-R$ {discountValue.toFixed(2)}</span>
                      </div>
                    )}

                    {fees && fees > 0 && (
                      <div className="text-accent flex justify-between text-sm">
                        <span>
                          Taxa ({PAYMENT_OPTIONS.find(p => p.id === payment.method)?.label}):
                        </span>
                        <span>+R$ {fees.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total:</span>
                      <span className="text-on-great text-lg">R$ {totalValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={handleConfirmSale} className="mt-4 w-full gap-1">
                    <Receipt />
                    Finalizar Venda
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
