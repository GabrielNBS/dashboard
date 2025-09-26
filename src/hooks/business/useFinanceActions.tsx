// src/lib/hooks/business/useFinanceActions.tsx
'use client';

import { useCallback } from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useConfirmation } from '@/hooks/ui/useConfirmation';

export function useFinanceActions() {
  const { state: salesState, dispatch: salesDispatch } = useSalesContext();
  const { state: storeState, dispatch: storeDispatch } = useIngredientContext();
  const { showConfirmation } = useConfirmation();

  const handleRemoveSale = useCallback(
    (saleId: string, onConfirm?: () => void) => {
      const sale = salesState.sales.find(sale => sale.id === saleId);
      if (!sale) return;

      showConfirmation(
        {
          title: 'Excluir Venda',
          description:
            'Deseja realmente excluir esta venda? Os ingredientes serão restaurados para o estoque. Esta ação não pode ser desfeita.',
          variant: 'destructive',
        },
        () => {
          // restaurar ingredientes vendidos
          sale.items.forEach(item => {
            item.product.ingredients.forEach(used => {
              const estoqueItem = storeState.ingredients.find(i => i.id === used.id);
              if (estoqueItem) {
                storeDispatch({
                  type: 'EDIT_INGREDIENT',
                  payload: {
                    ...estoqueItem,
                    totalQuantity: estoqueItem.totalQuantity + used.totalQuantity * item.quantity,
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
    showConfirmation,
  };
}
