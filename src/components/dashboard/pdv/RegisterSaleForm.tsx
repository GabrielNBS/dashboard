'use client';

import { useState } from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useProductContext } from '@/contexts/products/ProductContext';
import { toast } from '@/components/ui/use-toast';
import { Sale } from '@/types/sale';
import { v4 as uuidv4 } from 'uuid';

type CartItem = {
  uid: string;
  quantity: number;
  sellingResume?: {
    paymentMethod?: string;
    discount?: {
      type: 'percentage' | 'R$';
      value: number;
    };

    subtotal?: number;
    totalValue?: number;
  };
};

export default function RegisterSaleForm() {
  const { state: finalProducts } = useProductContext();
  const { dispatch: salesDispatch } = useSalesContext();
  const { state: estoque, dispatch: estoqueDispatch } = useIngredientContext();

  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (uid: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.uid === uid);
      if (existing) {
        return prev.map(item =>
          item.uid === uid ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { uid, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (uid: string) => {
    setCart(prev => prev.filter(item => item.uid !== uid));
  };

  const updateQuantity = (uid: string, quantity: number) => {
    if (quantity <= 0) return;
    setCart(prev => prev.map(item => (item.uid === uid ? { ...item, quantity } : item)));
  };

  const handleConfirmSale = () => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione itens ao carrinho.',
        variant: 'destructive',
      });
      return;
    }

    const salesToRegister: Sale[] = [];

    for (const item of cart) {
      const product = finalProducts.products.find(p => p.uid === item.uid);
      if (!product) continue;

      const faltaIngrediente = product.ingredients.find(ingredient => {
        const estoqueItem = estoque.ingredients.find(i => i.id === ingredient.id);
        const totalToRemove = ingredient.quantity * item.quantity;
        return !estoqueItem || estoqueItem.quantity < totalToRemove;
      });

      if (faltaIngrediente) {
        toast({
          title: 'Estoque insuficiente',
          description: `Faltam ingredientes para "${product.name}"`,
          variant: 'destructive',
        });
        return;
      }

      // Subtrair do estoque
      product.ingredients.forEach(ingredient => {
        const totalToRemove = ingredient.quantity * item.quantity;
        const estoqueItem = estoque.ingredients.find(i => i.id === ingredient.id)!;

        estoqueDispatch({
          type: 'EDIT_INGREDIENT',
          payload: {
            ...estoqueItem,
            quantity: estoqueItem.quantity - totalToRemove,
          },
        });
      });

      const costPrice = product.ingredients.reduce(
        (acc, ingredient) => acc + ingredient.totalValue,
        0
      );

      const sale: Sale = {
        id: uuidv4(),
        date: new Date().toISOString(),
        uid: uuidv4(),
        name: product.name,
        yieldQuantity: item.quantity,
        sellingPrice: product.sellingPrice,
        totalCost: costPrice,
        ingredients: product.ingredients.map(ingredient => ({
          ...ingredient,
          quantity: ingredient.quantity * item.quantity,
        })),
        category: product.category,
        productionMode: product.productionMode,
      };

      salesToRegister.push(sale);
    }

    salesToRegister.forEach(sale => salesDispatch({ type: 'ADD_SALE', payload: sale }));

    toast({
      title: 'Venda registrada',
      description: `Foram vendidos ${salesToRegister.length} itens.`,
      variant: 'accept',
    });

    setCart([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Registrar Vendas</h2>

      {/* Cards de Produtos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {finalProducts.products.map(product => (
          <div key={product.uid} className="rounded border p-4 shadow transition hover:shadow-md">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="mt-2 font-semibold text-green-700">
              R$ {(product.sellingPrice || 0).toFixed(2)}
            </p>
            <button
              className="mt-3 w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
              onClick={() => addToCart(product.uid)}
            >
              Adicionar ao carrinho
            </button>
          </div>
        ))}
      </div>

      {/* Carrinho */}
      <div className="rounded border p-4 shadow">
        <h3 className="mb-4 text-lg font-bold">Carrinho</h3>
        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum item no carrinho.</p>
        ) : (
          <div className="space-y-2">
            {cart.map(item => {
              const product = finalProducts.products.find(p => p.uid === item.uid);
              if (!product) return null;

              return (
                <div key={item.uid} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantidade:{' '}
                      <input
                        type="number"
                        className="ml-2 w-16 rounded border p-1 text-sm"
                        value={item.quantity}
                        min={1}
                        onChange={e => updateQuantity(item.uid, Number(e.target.value))}
                        placeholder="quantidade"
                      />
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.uid)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmar venda */}
      <button
        onClick={handleConfirmSale}
        disabled={cart.length === 0}
        className="w-full rounded bg-green-600 p-3 font-bold text-white hover:bg-green-700 disabled:opacity-50"
      >
        Confirmar venda
      </button>
    </div>
  );
}
