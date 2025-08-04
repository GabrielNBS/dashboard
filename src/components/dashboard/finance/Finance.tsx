'use client';

import React from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import CardFinance from '../../ui/CardFinance';
import Button from '../../ui/Button';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { FixedCost } from '@/types/sale';
import { useFinanceSummary } from '@/hooks/useSummaryFinance';

export default function Finance() {
  const { state: salesState, dispatch: salesDispatch } = useSalesContext();
  const { state: storeState, dispatch: storeDispatch } = useIngredientContext();

  // 🔸 Mock de custos fixos (pode substituir por contexto futuro)
  const fixedCosts: FixedCost[] = [
    {
      id: '1',
      name: 'Aluguel',
      amount: 1500,
      recurrence: 'mensal',
    },
    {
      id: '2',
      name: 'Internet',
      amount: 200,
      recurrence: 'mensal',
    },
    {
      id: '3',
      name: 'Salário Funcionários',
      amount: 3000,
      recurrence: 'mensal',
    },
    {
      id: '4',
      name: 'Manutenção Equipamentos',
      amount: 500,
      recurrence: 'anual',
    },
  ];

  // 🔸 Cálculo do resumo financeiro
  const {
    totalRevenue,
    totalVariableCost,
    totalFixedCost,
    grossProfit,
    netProfit,
    margin,
    valueToSave,
  } = useFinanceSummary(salesState.sales, fixedCosts, 0.1);

  //  Remoção de venda
  const handleRemoveSale = (saleId: string) => {
    const sale = salesState.sales.find(sale => sale.id === saleId);
    if (!sale) return;

    const confirm = window.confirm(
      'Deseja realmente excluir esta venda? Os ingredientes serão restaurados.'
    );
    if (!confirm) return;

    sale.ingredientsUsed.forEach(used => {
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
      <CardFinance
        totalRevenue={totalRevenue}
        totalVariableCost={totalVariableCost}
        totalFixedCost={totalFixedCost}
        grossProfit={grossProfit}
        netProfit={netProfit}
        margin={margin}
        valueToSave={valueToSave}
      />

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
