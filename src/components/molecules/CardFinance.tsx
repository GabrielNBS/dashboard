// src/components/molecules/CardFinance.tsx
interface CardFinanceProps {
  faturamento: number;
  custo: number;
  lucro: number;
}

export default function CardFinance({ faturamento, custo, lucro }: CardFinanceProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded bg-green-100 p-4">
        <span className="block font-semibold text-green-800">Faturamento Bruto</span>
        <span className="text-xl font-bold">R$ {faturamento?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-yellow-100 p-4">
        <span className="block font-semibold text-yellow-800">Custo Total</span>
        <span className="text-xl font-bold">R$ {custo?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="rounded bg-purple-100 p-4">
        <span className="block font-semibold text-purple-800">Lucro Líquido</span>
        <span className="text-xl font-bold">R$ {lucro?.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
}
