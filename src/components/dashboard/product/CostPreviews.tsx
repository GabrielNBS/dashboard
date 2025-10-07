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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-4 shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-red-700">
            {mode === 'individual' ? 'Custo Total' : 'Custo por Unidade'}
          </span>
        </div>
        <div className="text-2xl font-bold text-red-900">{formatCurrency(unitCost)}</div>
        <p className="mt-1 text-xs text-red-600">Soma dos ingredientes</p>
      </div>

      <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700">
            {mode === 'individual' ? 'Preço Sugerido' : 'Preço por Unidade'}
          </span>
        </div>
        <div className="text-2xl font-bold text-blue-900">{formatCurrency(suggestedPrice)}</div>
        <p className="mt-1 text-xs text-blue-600">Baseado na margem</p>
      </div>

      <div
        className={`bg-gradient-to-br shadow-md ${
          realProfitMargin >= 0
            ? 'border-green-200 from-green-50 to-green-100'
            : 'border-red-200 from-red-50 to-red-100'
        } rounded-lg border p-4`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              realProfitMargin >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            Margem Real
          </span>
        </div>
        <div
          className={`text-2xl font-bold ${
            realProfitMargin >= 0 ? 'text-green-900' : 'text-red-900'
          }`}
        >
          {realProfitMargin.toFixed(1)}%
        </div>
        <p className={`mt-1 text-xs ${realProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {realProfitMargin >= 0 ? 'Lucro positivo' : 'Prejuízo'}
        </p>
      </div>
    </div>
  );
}
