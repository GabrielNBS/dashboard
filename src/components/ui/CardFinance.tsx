// src/components/ui/CardFinance.tsx
// Componente responsável por exibir informações financeiras em cards

import { CardFinanceProps } from '@/types/sale';
import { formatCurrency, formatPercent } from '@/utils/formatCurrency';

/**
 * Componente CardFinance - Exibe métricas financeiras em cards coloridos
 *
 * @param totalRevenue - Receita total das vendas
 * @param totalVariableCost - Custo variável total (ingredientes)
 * @param totalFixedCost - Custo fixo total mensal
 * @param grossProfit - Lucro bruto (receita - custo variável)
 * @param netProfit - Lucro líquido (receita - custo variável - custo fixo)
 * @param margin - Margem de lucro percentual
 * @param valueToSave - Valor a ser reservado do lucro
 */
export default function CardFinance({
  totalRevenue,
  totalVariableCost,
  totalFixedCost,
  grossProfit,
  netProfit,
  margin,
  valueToSave,
}: CardFinanceProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {/* Card de Faturamento Bruto */}
      <div className="rounded bg-green-100 p-4">
        <span className="block font-semibold text-green-800">Faturamento Bruto</span>
        <span className="text-xl font-bold">{formatCurrency(totalRevenue)}</span>
      </div>

      {/* Card de Custo com Ingredientes */}
      <div className="rounded bg-red-100 p-4">
        <span className="block font-semibold text-red-800">Custo com Ingredientes</span>
        <span className="text-xl font-bold">{formatCurrency(totalVariableCost)}</span>
      </div>

      {/* Card de Custo Fixo Total */}
      <div className="rounded bg-yellow-100 p-4">
        <span className="block font-semibold text-yellow-800">Custo Fixo Total</span>
        <span className="text-xl font-bold">{formatCurrency(totalFixedCost)}</span>
      </div>

      {/* Card de Lucro Bruto */}
      <div className="rounded bg-blue-100 p-4">
        <span className="block font-semibold text-blue-800">Lucro Bruto</span>
        <span className="text-xl font-bold">{formatCurrency(grossProfit)}</span>
      </div>

      {/* Card de Lucro Líquido */}
      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Lucro Líquido</span>
        <span className="text-xl font-bold">{formatCurrency(netProfit)}</span>
      </div>

      {/* Card de Margem de Lucro */}
      <div className="rounded bg-teal-100 p-4">
        <span className="block font-semibold text-teal-800">Margem de Lucro</span>
        <span className="text-xl font-bold">{formatPercent(margin)}</span>
      </div>

      {/* Card de Valor a Guardar */}
      <div className="rounded bg-orange-100 p-4">
        <span className="block font-semibold text-orange-800">Valor a Guardar</span>
        <span className="text-xl font-bold">{formatCurrency(valueToSave)}</span>
      </div>
    </div>
  );
}
