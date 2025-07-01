'use client';

import React from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import CardFinance from '../../ui/CardFinance';
import Button from '../../ui/Button';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

export default function Finance() {
  const { state: salesState, dispatch: salesDispatch } = useSalesContext();
  const { state: storeState, dispatch: storeDispatch } = useIngredientContext();

  const totalBilling = salesState.sales.reduce(
    (acc, sale) => acc + sale.unitPrice * sale.quantity,
    0
  );

  const totalCost = salesState.sales.reduce((acc, sale) => acc + sale.costPrice, 0);

  const lucroLiquido = totalBilling - totalCost;

  const handleRemoveSale = (saleId: string) => {
    const sale = salesState.sales.find(s => s.id === saleId);
    if (!sale) return;

    // 1. Confirmar
    const confirm = window.confirm(
      'Deseja realmente excluir esta venda? Os ingredientes serão restaurados.'
    );
    if (!confirm) return;

    // 2. Restaurar estoque
    sale.ingredientsUsed.forEach(used => {
      const estoqueItem = storeState.ingredients.find(i => i.id === used.id);
      if (estoqueItem) {
        storeDispatch({
          type: 'EDIT_INGREDIENT',
          payload: {
            ...estoqueItem,
            quantity: estoqueItem.quantity + used.quantity,
          },
        });
      }
    });

    // 3. Remover venda
    salesDispatch({ type: 'REMOVE_SALE', payload: sale.id });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-title text-bold">Financeiro</h1>

      {/* Cartão com resumo financeiro */}
      <CardFinance faturamento={totalBilling} custo={totalCost} lucro={lucroLiquido} />

      {/* Tabela de vendas */}
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Data</th>
            <th className="p-2">Produto</th>
            <th className="p-2">Qtd</th>
            <th className="p-2">Valor unitário</th>
            <th className="p-2">Total</th>
            <th className="p-2">Acoes</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {salesState.sales.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-400">
                Nenhuma venda registrada.
              </td>
            </tr>
          ) : (
            salesState.sales.map(sale => (
              <tr key={sale.id} className="border-b border-gray-200">
                <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="p-2">{sale.productName}</td>
                <td className="p-2">{sale.quantity}</td>
                <td className="p-2">R$ {sale.unitPrice.toFixed(2)}</td>
                <td className="p-2">R$ {(sale.unitPrice * sale.quantity).toFixed(2)}</td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveSale(sale.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
