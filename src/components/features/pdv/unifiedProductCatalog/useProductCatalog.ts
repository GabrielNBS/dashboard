'use client';

import { useMemo } from 'react';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';
import { calculateMaxSellableQuantity, validateBatchSale } from '@/utils/calculations/batchSale';

interface UnifiedCartItem {
  uid: string;
  quantity: number;
  saleMode?: 'unit' | 'batch';
}

interface UseProductCatalogLogicProps {
  products: ProductState[];
  cart: UnifiedCartItem[];
  availableIngredients: Ingredient[];
  canMakeProduct: (productUid: string, quantity: number) => boolean;
  onAddToCart: (uid: string, quantity?: number, saleMode?: 'unit' | 'batch') => void;
}

export function useProductCatalog({
  products,
  cart,
  availableIngredients,
  canMakeProduct,
  onAddToCart,
}: UseProductCatalogLogicProps) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const handleProductClick = (product: ProductState, saleMode: 'unit' | 'batch' = 'unit') => {
    const isBatchProduct = product.production.mode === 'lote';
    const validation = validateBatchSale(product, 1, availableIngredients);

    if (!validation.isValid) return;

    if (isBatchProduct && saleMode === 'batch') {
      onAddToCart(product.uid, product.production.yieldQuantity, 'batch');
    } else {
      onAddToCart(product.uid, 1, 'unit');
    }
  };

  const getProductData = (product: ProductState) => {
    const inCart = cart.find(item => item.uid === product.uid);
    const isBatchProduct = product.production.mode === 'lote';
    const maxAvailable = calculateMaxSellableQuantity(product, availableIngredients);
    const canMake = canMakeProduct(product.uid, (inCart?.quantity ?? 0) + 1);
    const validation = validateBatchSale(product, 1, availableIngredients);
    const yieldQuantity = product.production.yieldQuantity;

    const unitPrice = isBatchProduct
      ? product.production.unitSellingPrice
      : product.production.sellingPrice;

    const batchPrice = isBatchProduct
      ? product.production.unitSellingPrice * yieldQuantity
      : product.production.sellingPrice;

    return {
      inCart,
      isBatchProduct,
      maxAvailable,
      canMake,
      validation,
      yieldQuantity,
      unitPrice,
      batchPrice,
    };
  };

  return { sortedProducts, handleProductClick, getProductData };
}
