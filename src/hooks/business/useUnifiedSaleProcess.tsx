// src/hooks/business/useUnifiedSaleProcess.tsx
'use client';

import { formatISO } from 'date-fns';
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/feedback/use-toast';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useStablePaymentFees } from '@/hooks/business/useStablePaymentFees';

import { calculateSellingResume } from '@/utils/calculations/calcSale';
import {
  calculateProportionalIngredientConsumption,
  validateBatchSale,
  calculateMaxSellableQuantity,
  convertToBatchSaleItem,
  reduceProducedQuantity,
} from '@/utils/calculations/batchSale';
import { BatchToasts } from '@/components/ui/feedback/BatchToast';

import { CartItem, PAYMENT_METHODS, PaymentConfig, BatchSale, BatchSaleItem } from '@/types/sale';

interface UnifiedCartItem extends CartItem {
  maxAvailable?: number;
  isBatchProduct?: boolean;
  saleMode?: 'unit' | 'batch'; // Modo de venda: unitário ou lote completo
}

export function useUnifiedSaleProcess() {
  const { state: finalProducts, dispatch: productDispatch } = useProductContext();
  const { dispatch: salesDispatch } = useSalesContext();
  const { state: store, dispatch: storeDispatch } = useIngredientContext();
  const { paymentFeesConfig } = useStablePaymentFees();

  const [cart, setCart] = useState<UnifiedCartItem[]>([]);
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

  // Calcula informações de lote para um produto
  const getBatchInfo = useCallback(
    (productUid: string) => {
      const product = finalProducts.products.find(p => p.uid === productUid);
      if (!product) return null;

      const maxAvailable = calculateMaxSellableQuantity(product, store.ingredients);
      const isBatchProduct = product.production.mode === 'lote';

      return {
        product,
        maxAvailable,
        isBatchProduct,
        yieldQuantity: product.production.yieldQuantity,
      };
    },
    [finalProducts.products, store.ingredients]
  );

  // Adiciona produto ao carrinho com suporte a lotes (lógica simplificada)
  const addToCart = useCallback(
    (uid: string, specificQuantity?: number, saleMode: 'unit' | 'batch' = 'unit') => {
      const batchInfo = getBatchInfo(uid);
      if (!batchInfo) return;

      const { maxAvailable, isBatchProduct } = batchInfo;

      setCart(prev => {
        const existing = prev.find(i => i.uid === uid);
        let newQuantity: number;

        if (specificQuantity !== undefined) {
          // Quantidade específica fornecida
          newQuantity = specificQuantity;
        } else if (existing) {
          // Item já existe no carrinho - adiciona 1 unidade
          newQuantity = existing.quantity + 1;
        } else {
          // Novo item - adiciona 1 unidade (mesmo para lotes)
          newQuantity = 1;
        }

        // Valida se a quantidade solicitada está disponível
        if (newQuantity > maxAvailable) {
          const product = finalProducts.products.find(p => p.uid === uid);
          if (product) {
            BatchToasts.insufficientStock(product.name, newQuantity, maxAvailable);
          }
          return prev;
        }

        if (existing) {
          return prev.map(i =>
            i.uid === uid
              ? { ...i, quantity: newQuantity, maxAvailable, isBatchProduct, saleMode }
              : i
          );
        }

        return [
          ...prev,
          {
            uid,
            quantity: newQuantity,
            maxAvailable,
            isBatchProduct,
            saleMode,
          },
        ];
      });
    },
    [getBatchInfo, finalProducts.products]
  );

  const removeFromCart = useCallback((uid: string) => {
    setCart(prev => prev.filter(i => i.uid !== uid));
  }, []);

  const updateQuantity = useCallback(
    (uid: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(uid);

      const batchInfo = getBatchInfo(uid);
      if (!batchInfo) return;

      if (quantity > batchInfo.maxAvailable) {
        const product = finalProducts.products.find(p => p.uid === uid);
        if (product) {
          BatchToasts.insufficientStock(product.name, quantity, batchInfo.maxAvailable);
        }
        return;
      }

      setCart(prev =>
        prev.map(i =>
          i.uid === uid ? { ...i, quantity, maxAvailable: batchInfo.maxAvailable } : i
        )
      );
    },
    [getBatchInfo, removeFromCart, finalProducts.products]
  );

  // Validação de estoque unificada
  const validateStock = useCallback(
    (productUid: string, requestedQuantity: number) => {
      const product = finalProducts.products.find(p => p.uid === productUid);
      if (!product) return { isValid: false, missingIngredients: [] as string[] };

      return validateBatchSale(product, requestedQuantity, store.ingredients);
    },
    [finalProducts.products, store.ingredients]
  );

  const canMakeProduct = useCallback(
    (productUid: string, requestedQuantity: number) => {
      return validateStock(productUid, requestedQuantity).isValid;
    },
    [validateStock]
  );

  // Confirma venda unificada
  const confirmSale = useCallback(() => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione itens ao carrinho.',
        type: 'error',
      });
      return;
    }

    // Valida todo o carrinho antes de processar
    for (const item of cart) {
      const validation = validateStock(item.uid, item.quantity);
      if (!validation.isValid) {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        if (product) {
          BatchToasts.missingIngredients(product.name, validation.missingIngredients);
        }
        return;
      }
    }

    // Cria itens de venda com suporte unificado
    const saleItems: BatchSaleItem[] = cart.map(item => {
      const product = finalProducts.products.find(p => p.uid === item.uid)!;

      if (product.production.mode === 'lote') {
        // Para produtos em lote, apenas reduz a quantidade produzida
        const updatedProduct = reduceProducedQuantity(product, item.quantity);

        // Atualiza o produto no contexto
        productDispatch({
          type: 'EDIT_PRODUCT',
          payload: updatedProduct,
        });
      } else {
        // Para produtos individuais, calcula e desconta ingredientes
        const ingredientConsumption = calculateProportionalIngredientConsumption(
          product,
          item.quantity
        );

        // Atualiza estoque de ingredientes
        ingredientConsumption.forEach(consumption => {
          const storeItem = store.ingredients.find(i => i.id === consumption.id)!;
          const newQuantity = Math.max(0, storeItem.totalQuantity - consumption.quantityToConsume);

          storeDispatch({
            type: 'EDIT_INGREDIENT',
            payload: {
              ...storeItem,
              totalQuantity: newQuantity,
            },
          });
        });
      }

      // Sempre usar unitSellingPrice para consistência
      const unitPrice = product.production.unitSellingPrice;

      // Cria item de venda regular
      const regularSaleItem = {
        product: product,
        quantity: item.quantity,
        subtotal: unitPrice * item.quantity,
      };

      // Converte para BatchSaleItem se necessário
      return convertToBatchSaleItem(regularSaleItem, item.quantity);
    });

    // Calcula resumo da venda
    const sellingResume = calculateSellingResume(
      saleItems,
      payment.method,
      payment.discount,
      paymentFeesConfig
    );

    const sale: BatchSale = {
      id: uuidv4(),
      date: formatISO(new Date()),
      items: saleItems,
      sellingResume,
      error: null,
      isLoading: false,
    };

    salesDispatch({ type: 'ADD_SALE', payload: sale });

    // Mostra toasts específicos para diferentes tipos de venda
    const batchItems = saleItems.filter(item => item.isBatchSale);
    const regularItems = saleItems.filter(item => !item.isBatchSale);

    // Toast específico para vendas de lote
    if (batchItems.length > 0) {
      batchItems.forEach(item => {
        BatchToasts.saleSuccess(
          item.product.name,
          item.batchSoldQuantity || item.quantity,
          item.batchYieldQuantity || item.product.production.yieldQuantity
        );
      });
    }

    // Toast geral para vendas regulares ou mistas
    if (regularItems.length > 0 || batchItems.length === 0) {
      let description = `Total: R$ ${sellingResume.totalValue.toFixed(2)}`;
      if (batchItems.length > 0) {
        description += ` (${batchItems.length} lote${batchItems.length > 1 ? 's' : ''} + ${regularItems.length} regular${regularItems.length > 1 ? 'es' : ''})`;
      } else {
        description += ` (${regularItems.length} item${regularItems.length > 1 ? 's' : ''})`;
      }

      toast({
        title: 'Venda registrada com sucesso! 🎉',
        description,
        type: 'success',
      });
    }

    setCart([]);
  }, [
    cart,
    payment.method,
    payment.discount,
    paymentFeesConfig,
    finalProducts.products,
    store.ingredients,
    storeDispatch,
    productDispatch,
    salesDispatch,
    validateStock,
  ]);

  // Calcula resumo em tempo real
  const sellingResume = calculateSellingResume(
    cart
      .map(item => {
        const product = finalProducts.products.find(p => p.uid === item.uid);
        if (!product) return null;

        // Sempre usar unitSellingPrice para consistência
        const unitPrice = product.production.unitSellingPrice;

        const regularSaleItem = {
          product,
          quantity: item.quantity,
          subtotal: unitPrice * item.quantity,
        };

        return convertToBatchSaleItem(regularSaleItem, item.quantity);
      })
      .filter(Boolean) as BatchSaleItem[],
    payment.method,
    payment.discount,
    paymentFeesConfig
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
    getBatchInfo,
  };
}
