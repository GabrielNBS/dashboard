// src/hooks/business/useProductionProcess.tsx
'use client';

import { useCallback } from 'react';
import { formatISO } from 'date-fns';
import { toast } from '@/components/ui/feedback/use-toast';

import { useProductContext } from '@/contexts/products/ProductContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

import {
  calculateMaxProducibleBatches,
  validateBatchProduction,
} from '@/utils/calculations/batchSale';

/**
 * Hook para gerenciar o processo de produção de lotes
 */
export function useProductionProcess() {
  const { state: products, dispatch: productDispatch } = useProductContext();
  const { state: ingredients, dispatch: ingredientDispatch } = useIngredientContext();

  /**
   * Produz um ou mais lotes de um produto
   */
  const produceBatch = useCallback(
    (productUid: string, batchCount: number = 1) => {
      const product = products.products.find(p => p.uid === productUid);

      if (!product) {
        toast({
          title: 'Erro',
          description: 'Produto não encontrado',
          type: 'error',
        });
        return false;
      }

      if (product.production.mode !== 'lote') {
        toast({
          title: 'Erro',
          description: 'Este produto não é produzido em lote',
          type: 'error',
        });
        return false;
      }

      if (batchCount <= 0) {
        toast({
          title: 'Erro',
          description: 'Quantidade de lotes deve ser maior que zero',
          type: 'error',
        });
        return false;
      }

      // Validar ingredientes disponíveis
      const validation = validateBatchProduction(product, batchCount, ingredients.ingredients);

      if (!validation.isValid) {
        toast({
          title: 'Ingredientes insuficientes',
          description: `Faltam: ${validation.missingIngredients.join(', ')}`,
          type: 'error',
        });
        return false;
      }

      // Descontar ingredientes do estoque
      product.ingredients.forEach(ingredient => {
        const storeIngredient = ingredients.ingredients.find(i => i.id === ingredient.id);
        if (storeIngredient) {
          const quantityToConsume = ingredient.totalQuantity * batchCount;
          const newQuantity = Math.max(0, storeIngredient.totalQuantity - quantityToConsume);

          ingredientDispatch({
            type: 'EDIT_INGREDIENT',
            payload: {
              ...storeIngredient,
              totalQuantity: newQuantity,
            },
          });
        }
      });

      // Atualizar producedQuantity do produto
      const producedUnits = product.production.yieldQuantity * batchCount;
      const updatedProduct = {
        ...product,
        production: {
          ...product.production,
          producedQuantity: (product.production.producedQuantity || 0) + producedUnits,
          lastProductionDate: formatISO(new Date()),
        },
      };

      productDispatch({
        type: 'EDIT_PRODUCT',
        payload: updatedProduct,
      });

      toast({
        title: 'Produção concluída! 🎉',
        description: `${producedUnits} unidades de ${product.name} produzidas (${batchCount} lote${batchCount > 1 ? 's' : ''})`,
        type: 'success',
      });

      return true;
    },
    [products.products, ingredients.ingredients, productDispatch, ingredientDispatch]
  );

  /**
   * Retorna todos os produtos que são produzidos em lote
   */
  const getBatchProducts = useCallback(() => {
    return products.products.filter(p => p.production.mode === 'lote');
  }, [products.products]);

  /**
   * Calcula quantos lotes podem ser produzidos com os ingredientes disponíveis
   */
  const calculateMaxBatches = useCallback(
    (productUid: string) => {
      const product = products.products.find(p => p.uid === productUid);
      if (!product || product.production.mode !== 'lote') return 0;

      return calculateMaxProducibleBatches(product, ingredients.ingredients);
    },
    [products.products, ingredients.ingredients]
  );

  /**
   * Valida se é possível produzir uma quantidade específica de lotes
   */
  const canProduceBatches = useCallback(
    (productUid: string, batchCount: number) => {
      const product = products.products.find(p => p.uid === productUid);
      if (!product || product.production.mode !== 'lote') return false;

      const validation = validateBatchProduction(product, batchCount, ingredients.ingredients);

      return validation.isValid;
    },
    [products.products, ingredients.ingredients]
  );

  /**
   * Retorna informações detalhadas sobre a produção de um produto
   */
  const getProductionInfo = useCallback(
    (productUid: string) => {
      const product = products.products.find(p => p.uid === productUid);
      if (!product) return null;

      const maxBatches =
        product.production.mode === 'lote'
          ? calculateMaxProducibleBatches(product, ingredients.ingredients)
          : 0;

      const currentStock = product.production.producedQuantity || 0;
      const yieldQuantity = product.production.yieldQuantity;
      const lastProduction = product.production.lastProductionDate;
      const maxUnitsCanProduce = maxBatches * yieldQuantity;

      return {
        product,
        maxBatches,
        currentStock,
        currentProduced: currentStock, // Alias para compatibilidade
        yieldQuantity,
        lastProduction,
        canProduce: maxBatches > 0,
        maxUnitsCanProduce,
      };
    },
    [products.products, ingredients.ingredients]
  );

  /**
   * Alias para produceBatch com 1 lote (usado pelo ProductionButton)
   */
  const produceProduct = useCallback(
    (productUid: string, batchCount: number = 1) => {
      return produceBatch(productUid, batchCount);
    },
    [produceBatch]
  );

  return {
    produceBatch,
    produceProduct,
    getBatchProducts,
    calculateMaxBatches,
    canProduceBatches,
    getProductionInfo,
  };
}
