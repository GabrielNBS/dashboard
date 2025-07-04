// src/components/molecules/CardFinance.tsx
interface CardFinanceProps {
  totalRevenue: number;
  totalVariableCost: number;
  totalFixedCost: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
}

export default function CardFinance({
  totalRevenue,
  totalVariableCost,
  totalFixedCost,
  grossProfit,
  netProfit,
  margin,
}: CardFinanceProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded bg-green-100 p-4">
        <span className="block font-semibold text-green-800">Faturamento Bruto</span>
        <span className="text-xl font-bold">R$ {totalRevenue?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-yellow-100 p-4">
        <span className="block font-semibold text-yellow-800">Custo Total</span>
        <span className="text-xl font-bold">R$ {totalVariableCost?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Lucro Líquido</span>
        <span className="text-xl font-bold">R$ {netProfit?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Margem</span>
        <span className="text-xl font-bold">R$ {margin?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Custo Fixo</span>
        <span className="text-xl font-bold">R$ {totalFixedCost?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Lucro Bruto</span>
        <span className="text-xl font-bold">R$ {grossProfit?.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
}
