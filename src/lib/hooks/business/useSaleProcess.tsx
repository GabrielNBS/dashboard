// src/lib/hooks/business/useSaleProcess.tsx
'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/feedback/use-toast';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useProductContext } from '@/contexts/products/ProductContext';

import { calculateSellingResume } from '@/lib/utils/calculations/calcSale';

import {
  CartItem,
  DEFAULT_PAYMENT_FEES,
  PAYMENT_METHODS,
  PaymentConfig,
  Sale,
  SaleItem,
} from '@/types/sale';

export function useSaleProcess() {
  const { state: finalProducts } = useProductContext();
  const { dispatch: salesDispatch } = useSalesContext();
  const { state: estoque, dispatch: estoqueDispatch } = useIngredientContext();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<PaymentConfig>({
    method: PAYMENT_METHODS.CASH,
    discount: { type: 'percentage', value: 0 },
    fees: DEFAULT_PAYMENT_FEES,
  });

  // Cart management functions
  const addToCart = useCallback((uid: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.uid === uid);
      if (existing) return prev.map(i => (i.uid === uid ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { uid, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((uid: string) => {
    setCart(prev => prev.filter(i => i.uid !== uid));
  }, []);

  const updateQuantity = useCallback(
    (uid: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(uid);
      setCart(prev => prev.map(i => (i.uid === uid ? { ...i, quantity } : i)));
    },
    [removeFromCart]
  );

  // Stock validation
  const validateStock = useCallback(
    (productUid: string, requestedQuantity: number) => {
      const product = finalProducts.products.find(p => p.uid === productUid);
      if (!product) return { isValid: false, missingIngredients: [] as string[] };

      const missingIngredients: string[] = [];

      const isValid = product.ingredients.every(ingredient => {
        const estoqueItem = estoque.ingredients.find(i => i.id === ingredient.id);
        const totalNeeded = ingredient.totalQuantity ?? 0 * requestedQuantity;
        const hasEnough = !!estoqueItem && (estoqueItem.totalQuantity ?? 0) >= totalNeeded;
        if (!hasEnough) missingIngredients.push(ingredient.name);
        return hasEnough;
      });

      return { isValid, missingIngredients };
    },
    [finalProducts.products, estoque.ingredients]
  );

  const canMakeProduct = useCallback(
    (productUid: string, requestedQuantity: number) =>
      validateStock(productUid, requestedQuantity).isValid,
    [validateStock]
  );

  // Sale confirmation logic
  const confirmSale = useCallback(() => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione itens ao carrinho.',
        variant: 'destructive',
      });
      return;
    }

    // Validate entire cart before processing
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

    // Create sale items and update stocks
    const saleItems: SaleItem[] = cart.map(item => {
      const product = finalProducts.products.find(p => p.uid === item.uid)!;

      product.ingredients.forEach(ingredient => {
        const totalToRemove = ingredient.totalQuantity * item.quantity;
        const estoqueItem = estoque.ingredients.find(i => i.id === ingredient.id)!;
        const newQuantity = estoqueItem.totalQuantity - totalToRemove;

        estoqueDispatch({
          type: 'EDIT_INGREDIENT',
          payload: {
            ...estoqueItem,

            totalQuantity: newQuantity,
          },
        });
      });

      return {
        product,
        quantity: item.quantity,
        subtotal: (product.production.sellingPrice ?? 0) * item.quantity,
      };
    });

    // Calculate sale summary
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
  }, [
    cart,
    payment,
    finalProducts.products,
    estoque.ingredients,
    estoqueDispatch,
    salesDispatch,
    validateStock,
  ]);

  // Calculate real-time summary
  const sellingResume = calculateSellingResume(
    cart
      .map(item => {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          subtotal: (product.production.sellingPrice ?? 0) * item.quantity,
        };
      })
      .filter(Boolean) as SaleItem[],
    payment.method,
    payment.discount,
    payment.fees
  );

  return {
    // State
    cart,
    payment,
    sellingResume,
    products: finalProducts.products,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    setPayment,
    confirmSale,

    // Helpers
    canMakeProduct,
    validateStock,
  };
}
