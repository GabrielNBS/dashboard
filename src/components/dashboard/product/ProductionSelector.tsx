import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { QuantityInput } from '@/components/ui/forms';

export default function ProductionSelector() {
  const { state, dispatch } = useProductBuilderContext();
  const { production } = state;

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Modo de produção <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PRODUCTION_MODE', payload: 'individual' })}
            className={`relative rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              production.mode === 'individual'
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 font-semibold">
                {production.mode === 'individual' && (
                  <div className="relative h-3 w-3 rounded-full bg-purple-500">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-75"></div>
                  </div>
                )}
                <p>Individual</p>
              </div>
              <div className="text-xs opacity-75">Uma unidade por vez</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PRODUCTION_MODE', payload: 'lote' })}
            className={`relative rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              production.mode === 'lote'
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 font-semibold">
                {production.mode === 'lote' && (
                  <div className="relative h-3 w-3 rounded-full bg-purple-500">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-75"></div>
                  </div>
                )}
                <p>Lote</p>
              </div>
              <div className="text-xs opacity-75">Múltiplas unidades</div>
            </div>
          </button>
        </div>
      </div>

      {production.mode === 'lote' && (
        <div className="bg-purple-25 rounded-lg border border-purple-200 p-3">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rendimento do lote <span className="text-red-500">*</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">Quantas unidades este lote produzirá?</p>
          <QuantityInput
            value={production.yieldQuantity?.toString() || '1'}
            onChange={value => {
              const numValue = parseFloat(value) || 1;
              dispatch({
                type: 'SET_YIELD_QUANTITY',
                payload: numValue,
              });
            }}
            placeholder="Ex: 12 unidades"
            className="w-full"
            unit="un"
            allowDecimals={false}
            maxValue={10000}
            minValue={1}
          />
        </div>
      )}
    </div>
  );
}
