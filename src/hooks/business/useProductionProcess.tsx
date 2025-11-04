// src/hooks/business/useProductionProcess.tsx
'use client';

import { useCallback } from 'react';
import { toast } from '@/components/ui/feedback/use-toast';

import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useProductContext } from '@/contexts/products/ProductContext';

import {
  calculateMaxProducibleBatches,
  produceBatch,
  updateProducedQuantity,
} from '@/utils/calculations/batchSale';

export function useProductionProcess() {
  const { state: ingredientStore, dispatch: ingredientDispatch } = useIngredientContext();
  const { state: productStore, dispatch: productDispatch } = useProductContext();

  // Produz lotes de um produto
  const produceProduct = useCallback(
    (productUid: string, batchesToProduce: number = 1) => {
      const product = productStore.products.find(p => p.uid === productUid);
      if (!product) {
        toast({
          title: 'Produto não encontrado',
          description: 'O produto selecionado não foi encontrado.',
          variant: 'destructive',
        });
        return false;
      }

      if (product.production.mode !== 'lote') {
        toast({
          title: 'Produto não é em lote',
          description: 'Este produto não é produzido em lote.',
          variant: 'destructive',
        });
        return false;
      }

      const maxBatches = calculateMaxProducibleBatches(product, ingredientStore.ingredients);
      if (batchesToProduce > maxBatches) {
        toast({
          title: 'Ingredientes insuficientes',
          description: `Você pode produzir no máximo ${maxBatches} lote(s) com os ingredientes disponíveis.`,
          variant: 'destructive',
        });
        return false;
      }

      const productionResult = produceBatch(product, ingredientStore.ingredients, batchesToProduce);
      if (!productionResult.success) {
        toast({
          title: 'Falha na produção',
          description: 'Não foi possível produzir o lote.',
          variant: 'destructive',
        });
        return false;
      }

      // Atualiza estoque de ingredientes
      productionResult.consumedIngredients.forEach(consumption => {
        const ingredient = ingredientStore.ingredients.find(ing => ing.id === consumption.id);
        if (ingredient) {
          const newQuantity = Math.max(0, ingredient.totalQuantity - consumption.quantityConsumed);
          ingredientDispatch({
            type: 'EDIT_INGREDIENT',
            payload: {
              ...ingredient,
              totalQuantity: newQuantity,
            },
          });
        }
      });

      // Atualiza produto com quantidade produzida
      const updatedProduct = updateProducedQuantity(product, productionResult.producedQuantity);
      productDispatch({
        type: 'EDIT_PRODUCT',
        payload: updatedProduct,
      });

      toast({
        title: 'Produção realizada com sucesso! 🎉',
        description: `Produzido ${batchesToProduce} lote(s) de "${product.name}" (${productionResult.producedQuantity} unidades).`,
        variant: 'accept',
      });

      return true;
    },
    [productStore.products, ingredientStore.ingredients, ingredientDispatch, productDispatch]
  );

  // Calcula informações de produção para um produto
  const getProductionInfo = useCallback(
    (productUid: string) => {
      const product = productStore.products.find(p => p.uid === productUid);
      if (!product || product.production.mode !== 'lote') {
        return null;
      }

      const maxBatches = calculateMaxProducibleBatches(product, ingredientStore.ingredients);
      const currentProduced = product.production.producedQuantity || 0;
      const yieldQuantity = product.production.yieldQuantity;

      return {
        product,
        maxBatches,
        currentProduced,
        yieldQuantity,
        canProduce: maxBatches > 0,
        maxUnitsCanProduce: maxBatches * yieldQuantity,
      };
    },
    [productStore.products, ingredientStore.ingredients]
  );

  return {
    produceProduct,
    getProductionInfo,
  };
}
