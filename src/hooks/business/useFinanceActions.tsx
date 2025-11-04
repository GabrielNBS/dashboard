// src/lib/hooks/business/useFinanceActions.tsx
'use client';

import React, { useCallback } from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useConfirmation } from '@/hooks/ui/useConfirmation';

export function useFinanceActions() {
  const { state: salesState, dispatch: salesDispatch } = useSalesContext();
  const { state: storeState, dispatch: storeDispatch } = useIngredientContext();
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  const handleRemoveSale = useCallback(
    (saleId: string, onConfirm?: () => void) => {
      const sale = salesState.sales.find(sale => sale.id === saleId);
      if (!sale) return;

      showConfirmation(
        {
          title: 'Excluir Venda',
          description: (
            <div className="bg-warning text-on-warning rounded p-2 text-sm">
              <strong>⚠️ Os ingredientes serão restaurados</strong> para o estoque automaticamente.
            </div>
          ),
          variant: 'destructive',
        },
        () => {
          // restaurar ingredientes vendidos (considerando lotes)
          sale.items.forEach(item => {
            item.product.ingredients.forEach(used => {
              const estoqueItem = storeState.ingredients.find(i => i.id === used.id);
              if (estoqueItem) {
                let quantityToRestore: number;

                if (
                  item.product.production.mode === 'lote' &&
                  item.product.production.yieldQuantity > 0
                ) {
                  // Para produtos em lote, calcula proporcionalmente
                  const proportion = item.quantity / item.product.production.yieldQuantity;
                  quantityToRestore = used.totalQuantity * proportion;
                } else {
                  // Para produtos individuais, usa a quantidade total
                  quantityToRestore = used.totalQuantity * item.quantity;
                }

                storeDispatch({
                  type: 'EDIT_INGREDIENT',
                  payload: {
                    ...estoqueItem,
                    totalQuantity: estoqueItem.totalQuantity + quantityToRestore,
                  },
                });
              }
            });
          });

          salesDispatch({ type: 'REMOVE_SALE', payload: sale.id });
          onConfirm?.();
        }
      );
    },
    [salesState.sales, storeState.ingredients, salesDispatch, storeDispatch, showConfirmation]
  );

  return {
    handleRemoveSale,
    confirmationState,
    hideConfirmation,
    handleConfirm,
  };
}
