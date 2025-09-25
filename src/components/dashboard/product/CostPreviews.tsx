import { formatCurrency } from '@/utils/formatting/formatCurrency';

interface CostPreviewsProps {
  unitCost: number;
  suggestedPrice: number;
  realProfitMargin: number;
  mode: 'individual' | 'lote';
}

export default function CostPreviews({
  unitCost,
  suggestedPrice,
  realProfitMargin,
  mode,
}: CostPreviewsProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="bg-muted flex flex-col rounded-lg p-3">
        <span className="mb-1 block text-sm font-semibold">
          {mode === 'individual' ? 'Custo total:' : 'Custo por unidade:'}
        </span>
        <span className="text-on-red text-xl font-bold">{formatCurrency(unitCost)}</span>
      </div>

      <div className="bg-muted flex flex-col rounded-lg p-3">
        <span className="mb-1 block text-sm font-semibold">
          {mode === 'individual' ? 'Preço Sugerido:' : 'Preço Sugerido por unidade:'}
        </span>
        <span className="text-muted-foreground text-xl font-bold">
          {formatCurrency(suggestedPrice)}
        </span>
      </div>

      <div className="bg-muted flex flex-col rounded-lg p-3">
        <span className="mb-1 block text-sm font-semibold">Margem Real:</span>
        <span
          className={`text-xl font-bold ${realProfitMargin >= 0 ? 'text-on-great' : 'text-on-red'}`}
        >
          {realProfitMargin.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
