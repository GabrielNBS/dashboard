// src/lib/hooks/business/useSaleProcess.tsx
'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/feedback/use-toast';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useStablePaymentFees } from '@/hooks/business/useStablePaymentFees';

import { calculateSellingResume } from '@/utils/calculations/calcSale';

import { CartItem, PAYMENT_METHODS, PaymentConfig, Sale, SaleItem } from '@/types/sale';

export function useSaleProcess() {
  const { state: finalProducts } = useProductContext();
  const { dispatch: salesDispatch } = useSalesContext();
  const { state: store, dispatch: storeDispatch } = useIngredientContext();
  const { paymentFeesConfig } = useStablePaymentFees();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<PaymentConfig>({
    method: PAYMENT_METHODS.CASH,
    discount: { type: 'percentage', value: 0 },
    fees: {
      cash: 0,
      debit: 2.5,
      credit: 3.5,
      ifood: 15,
    },
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

  // Stock validation with batch support
  const validateStock = useCallback(
    (productUid: string, requestedQuantity: number) => {
      const product = finalProducts.products.find(p => p.uid === productUid);
      if (!product) return { isValid: false, missingIngredients: [] as string[] };

      const missingIngredients: string[] = [];

      // For batch products, calculate proportional ingredient consumption
      const isValid = product.ingredients.every(ingredient => {
        const storeItem = store.ingredients.find(i => i.id === ingredient.id);

        let totalNeeded: number;
        if (product.production.mode === 'lote' && product.production.yieldQuantity > 0) {
          // For batch products, calculate proportional consumption
          const proportion = requestedQuantity / product.production.yieldQuantity;
          totalNeeded = ingredient.totalQuantity * proportion;
        } else {
          // For individual products, use direct multiplication
          totalNeeded = ingredient.totalQuantity * requestedQuantity;
        }

        const hasEnough = !!storeItem && storeItem.totalQuantity >= totalNeeded;
        if (!hasEnough) missingIngredients.push(ingredient.name);
        return hasEnough;
      });

      return { isValid, missingIngredients };
    },
    [finalProducts.products, store.ingredients]
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
        type: 'error',
      });
      return;
    }

    // Validate entire cart before processing
    for (const item of cart) {
      const validation = validateStock(item.uid, item.quantity);
      if (!validation.isValid) {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        toast({
          title: 'store insuficiente',
          description: `Não há ingredientes suficientes para "${product?.name}". Faltam: ${validation.missingIngredients.join(', ')}`,
          type: 'error',
        });
        return;
      }
    }

    // Create sale items and update stocks with batch support
    const saleItems: SaleItem[] = cart.map(item => {
      const product = finalProducts.products.find(p => p.uid === item.uid)!;

      product.ingredients.forEach(ingredient => {
        let totalToRemove: number;

        if (product.production.mode === 'lote' && product.production.yieldQuantity > 0) {
          // For batch products, calculate proportional consumption
          const proportion = item.quantity / product.production.yieldQuantity;
          totalToRemove = ingredient.totalQuantity * proportion;
        } else {
          // For individual products, use direct multiplication
          totalToRemove = ingredient.totalQuantity * item.quantity;
        }

        const storeItem = store.ingredients.find(i => i.id === ingredient.id)!;
        const newQuantity = Math.max(0, storeItem.totalQuantity - totalToRemove);

        storeDispatch({
          type: 'EDIT_INGREDIENT',
          payload: {
            ...storeItem,
            totalQuantity: newQuantity,
          },
        });
      });

      // Use unit selling price for consistent pricing
      const unitPrice =
        product.production.mode === 'lote'
          ? product.production.unitSellingPrice
          : product.production.sellingPrice;

      return {
        product: product,
        quantity: item.quantity,
        subtotal: unitPrice * item.quantity,
      };
    });

    // Use current payment fees for calculation
    const currentFees = paymentFeesConfig;
    const sellingResume = calculateSellingResume(
      saleItems,
      payment.method,
      payment.discount,
      currentFees
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
      type: 'success',
    });

    setCart([]);
  }, [
    cart,
    payment.method,
    payment.discount,
    paymentFeesConfig,
    finalProducts.products,
    store.ingredients,
    storeDispatch,
    salesDispatch,
    validateStock,
  ]);

  // Calculate real-time summary using current fees
  const sellingResume = calculateSellingResume(
    cart
      .map(item => {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          subtotal: product.production.sellingPrice * item.quantity,
        };
      })
      .filter(Boolean) as SaleItem[],
    payment.method,
    payment.discount,
    paymentFeesConfig // Use current fees from context
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
