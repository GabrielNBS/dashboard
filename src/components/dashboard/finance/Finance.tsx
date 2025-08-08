'use client';

import React from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import Button from '../../ui/Button';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useFinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './cards/CardWrapper';

export default function Finance() {
  const { state: salesState, dispatch: salesDispatch } = useSalesContext();
  const { state: storeState, dispatch: storeDispatch } = useIngredientContext();

  // 🔸 Cálculo do resumo financeiro
  const {
    totalRevenue,
    totalVariableCost,
    totalFixedCost,
    grossProfit,
    netProfit,
    margin,
    valueToSave,
    breakEven,
  } = useFinanceSummary(salesState.sales);

  //  Remoção de venda
  const handleRemoveSale = (saleId: string) => {
    const sale = salesState.sales.find(sale => sale.id === saleId);
    if (!sale) return;

    const confirm = window.confirm(
      'Deseja realmente excluir esta venda? Os ingredientes serão restaurados.'
    );
    if (!confirm) return;

    sale.ingredients.forEach(used => {
      const estoqueItem = storeState.ingredients.find(ingredient => ingredient.id === used.id);
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

    salesDispatch({ type: 'REMOVE_SALE', payload: sale.id });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-title text-bold">Financeiro</h1>

      {/*  Resumo financeiro */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardWrapper title="Receita Total" value={totalRevenue} type="currency" />
        <CardWrapper title="Custo Variável Total" value={totalVariableCost ?? 0} type="currency" />
        <CardWrapper title="Custo Fixo Total" value={totalFixedCost ?? 0} type="currency" />
        <CardWrapper title="Lucro Bruto" value={grossProfit} type="currency" />
        <CardWrapper title="Lucro Líquido" value={netProfit} type="currency" />
        <CardWrapper title="Margem de Lucro" value={margin} type="percent" />
        <CardWrapper title="Valor a Pagar" value={valueToSave ?? 0} type="currency" />
        <CardWrapper title="Ponto de Equilíbrio" value={breakEven ?? 0} type="currency" />
      </div>

      {/*  Tabela de vendas */}
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Data</th>
            <th className="p-2">Produto</th>
            <th className="p-2">Qtd</th>
            <th className="p-2">Valor de venda</th>
            <th className="p-2">Total</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {salesState.sales.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-400">
                Nenhuma venda registrada.
              </td>
            </tr>
          ) : (
            salesState.sales.map(sale => (
              <tr key={sale.id} className="border-b border-gray-200">
                <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="p-2">{sale.name}</td>
                <td className="p-2">{sale.yieldQuantity}</td>
                <td className="p-2">R$ {sale.sellingPrice?.toFixed(2)}</td>
                <td className="p-2">
                  R$ {((sale.sellingPrice ?? 0) * (sale.yieldQuantity ?? 0)).toFixed(2)}
                </td>
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
