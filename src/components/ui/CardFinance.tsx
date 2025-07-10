// src/components/molecules/CardFinance.tsx

import { CardFinanceProps } from '@/types/sale';

export default function CardFinance({
  totalRevenue,
  totalVariableCost,
  totalFixedCost,
  grossProfit,
  netProfit,
  margin,
  valueToSave,
}: CardFinanceProps) {
  const formatCurrency = (value: number) => `R$ ${value?.toFixed(2).replace('.', ',')}`;

  const formatPercent = (value: number) => `${value?.toFixed(2).replace('.', ',')}%`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
      <div className="rounded bg-green-100 p-4">
        <span className="block font-semibold text-green-800">Faturamento Bruto</span>
        <span className="text-xl font-bold">{formatCurrency(totalRevenue)}</span>
      </div>

      <div className="rounded bg-red-100 p-4">
        <span className="block font-semibold text-red-800">Custo com Ingredientes</span>
        <span className="text-xl font-bold">{formatCurrency(totalVariableCost)}</span>
      </div>

      <div className="rounded bg-yellow-100 p-4">
        <span className="block font-semibold text-yellow-800">Custo Fixo Total</span>
        <span className="text-xl font-bold">{formatCurrency(totalFixedCost)}</span>
      </div>

      <div className="rounded bg-blue-100 p-4">
        <span className="block font-semibold text-blue-800">Lucro Bruto</span>
        <span className="text-xl font-bold">{formatCurrency(grossProfit)}</span>
      </div>

      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Lucro Líquido</span>
        <span className="text-xl font-bold">{formatCurrency(netProfit)}</span>
      </div>

      <div className="rounded bg-teal-100 p-4">
        <span className="block font-semibold text-teal-800">Margem de Lucro</span>
        <span className="text-xl font-bold">{formatPercent(margin)}</span>
      </div>

      <div className="rounded bg-orange-100 p-4">
        <span className="block font-semibold text-orange-800">Valor a Guardar</span>
        <span className="text-xl font-bold">{formatCurrency(valueToSave)}</span>
      </div>
    </div>
  );
}
