import { CurrencyInput, PercentageInput } from '@/components/ui/forms';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';
import { useMemo } from 'react';

interface PriceAndMarginInputsProps {
  mode: 'individual' | 'lote';
  sellingPrice: string;
  onSellingPriceChange: (value: string) => void;
  margin: string;
  onMarginChange: (value: string) => void;
}

export default function PriceAndMarginInputs({
  mode,
  sellingPrice,
  onSellingPriceChange,
  margin,
  onMarginChange,
}: PriceAndMarginInputsProps) {
  const { state } = useProductBuilderContext();

  // Cálculos em tempo real
  const calculations = useMemo(() => {
    const totalCost = state.ingredients.reduce(
      (acc, ing) => acc + (ing.averageUnitPrice * ing.totalQuantity || 0),
      0
    );

    const unitCost = calculateUnitCost(
      totalCost,
      state.production.mode,
      state.production.yieldQuantity
    );

    const suggestedPrice = calculateSuggestedPrice(
      totalCost,
      parseFloat(margin) || 0,
      state.production.mode,
      state.production.yieldQuantity
    );

    const realProfitMargin = calculateRealProfitMargin(
      totalCost,
      parseFloat(sellingPrice) || 0,
      state.production.mode,
      state.production.yieldQuantity
    );

    return { totalCost, unitCost, suggestedPrice, realProfitMargin };
  }, [state.ingredients, state.production, margin, sellingPrice]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CurrencyInput
              value={sellingPrice}
              onChange={onSellingPriceChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="R$ 0,00"
              maxValue={9999.99}
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-400">BRL</span>
            </div>
          </div>
          {mode === 'lote' && (
            <p className="mt-1 text-xs text-gray-500">Valor que cada unidade será vendida</p>
          )}

          {/* Área fixa para margem real - evita saltos visuais */}
          <div className="mt-2 h-12 transition-all duration-200">
            {sellingPrice && parseFloat(sellingPrice) > 0 && calculations.totalCost > 0 ? (
              <div className="rounded-md bg-blue-50 p-2 opacity-100 transition-opacity duration-200">
                <span className="text-sm font-medium text-blue-700">
                  Margem real: {calculations.realProfitMargin.toFixed(1)}%
                </span>
                <p className="text-xs text-blue-600">
                  Baseado no custo de R$ {calculations.unitCost.toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="opacity-0 transition-opacity duration-200">
                <div className="rounded-md bg-gray-50 p-2">
                  <span className="text-sm text-gray-400">Margem será calculada</span>
                  <p className="text-xs text-gray-400">Digite o preço de venda</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Margem de Lucro <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <PercentageInput
              value={margin}
              onChange={onMarginChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="0%"
              maxValue={300}
              minValue={0}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-400">%</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Percentual de lucro desejado sobre o custo</p>

          {/* Área fixa para preço sugerido - evita saltos visuais */}
          <div className="mt-2 h-12 transition-all duration-200">
            {margin && parseFloat(margin) > 0 && calculations.totalCost > 0 ? (
              <div className="rounded-md bg-green-50 p-2 opacity-100 transition-opacity duration-200">
                <span className="text-sm font-medium text-green-700">
                  Preço sugerido: R$ {calculations.suggestedPrice.toFixed(2)}
                </span>
                <p className="text-xs text-green-600">Para margem de {margin}%</p>
              </div>
            ) : (
              <div className="opacity-0 transition-opacity duration-200">
                <div className="rounded-md bg-gray-50 p-2">
                  <span className="text-sm text-gray-400">Preço será sugerido</span>
                  <p className="text-xs text-gray-400">Digite a margem desejada</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumo dos cálculos - altura fixa */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <h4 className="mb-2 text-sm font-medium text-gray-900">Resumo dos Cálculos</h4>
        {calculations.totalCost > 0 ? (
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div>
              <span className="text-gray-600">Custo Total:</span>
              <p className="font-medium text-gray-900">R$ {calculations.totalCost.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-600">
                {mode === 'lote' ? 'Custo/Unidade:' : 'Custo Unit.:'}
              </span>
              <p className="font-medium text-gray-900">R$ {calculations.unitCost.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-600">Preço Sugerido:</span>
              <p className="font-medium text-green-700">
                {margin && parseFloat(margin) > 0
                  ? `R$ ${calculations.suggestedPrice.toFixed(2)}`
                  : '--'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Margem Real:</span>
              <p className="font-medium text-blue-700">
                {sellingPrice && parseFloat(sellingPrice) > 0
                  ? `${calculations.realProfitMargin.toFixed(1)}%`
                  : '--'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Adicione ingredientes para ver os cálculos de custo e margem
          </p>
        )}
      </div>
    </div>
  );
}
