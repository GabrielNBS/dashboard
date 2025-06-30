'use client';

import React from 'react';
import { useSalesContext } from '@/hooks/useSalesContext';
import CardFinance from '../molecules/CardFinance';
import Button from '../atoms/Button';

export default function FinanceTemplate() {
  const { state, dispatch } = useSalesContext();

  // Cálculos de totais
  const totalBilling = state.sales.reduce((acc, sale) => acc + sale.unitPrice * sale.quantity, 0);

  const totalCost = state.sales.reduce((acc, sale) => acc + sale.costPrice, 0);

  const lucroLiquido = totalBilling - totalCost;

  const handleRemoveSale = (id: string) => {
    dispatch({ type: 'REMOVE_SALE', payload: id });
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
          {state.sales.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-400">
                Nenhuma venda registrada.
              </td>
            </tr>
          ) : (
            state.sales.map(sale => (
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
