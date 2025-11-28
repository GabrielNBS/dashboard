import { CurrencyInput, PercentageInput } from '@/components/ui/forms';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';
import { useMemo } from 'react';
import { CURRENCY_LIMITS, PERCENTAGE_LIMITS } from '@/schemas/validationSchemas';
// ✅ FASE 2.2: Hook de debounce para otimizar cálculos
import { useDebounce } from '@/hooks/useDebounce';

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

  // ✅ FASE 2.2: Debounce de valores digitados para reduzir cálculos
  // Benefício: Apenas calcula quando usuário pausa a digitação (300ms)
  // Redução: ~10 cálculos/segundo → ~3 cálculos/segundo
  const debouncedSellingPrice = useDebounce(sellingPrice, 300);
  const debouncedMargin = useDebounce(margin, 300);

  // Cálculos em tempo real (agora com valores debounced)
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
      parseFloat(debouncedMargin) || 0,
      state.production.mode,
      state.production.yieldQuantity
    );

    const realProfitMargin = calculateRealProfitMargin(
      totalCost,
      parseFloat(debouncedSellingPrice) || 0,
      state.production.mode,
      state.production.yieldQuantity
    );

    return { totalCost, unitCost, suggestedPrice, realProfitMargin };
  }, [state.ingredients, state.production, debouncedMargin, debouncedSellingPrice]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CurrencyInput
          label={mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}
          value={sellingPrice}
          onChange={onSellingPriceChange}
          placeholder="R$ 0,00"
          maxValue={CURRENCY_LIMITS.product.max}
          required
          size="md"
        />

        <PercentageInput
          label="Margem de Lucro"
          value={margin}
          onChange={onMarginChange}
          placeholder="0%"
          maxValue={PERCENTAGE_LIMITS.margin.max}
          minValue={PERCENTAGE_LIMITS.margin.min}
          required
          size="md"
        />
      </div>

      {/* Resumo dos cálculos - altura fixa */}
      <div className="border-border bg-muted rounded-lg border p-3">
        <h4 className="text-foreground mb-2 text-sm font-medium">Resumo dos Cálculos</h4>
        {calculations.totalCost > 0 ? (
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Custo Total:</span>
              <p className="text-foreground font-medium">R$ {calculations.totalCost.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">
                {mode === 'lote' ? 'Custo/Unidade:' : 'Custo Unit.:'}
              </span>
              <p className="text-foreground font-medium">R$ {calculations.unitCost.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Preço Sugerido:</span>
              <p className="text-success font-medium">
                {margin && parseFloat(margin) > 0
                  ? `R$ ${calculations.suggestedPrice.toFixed(2)}`
                  : '--'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Margem Real:</span>
              <p className="text-on-great font-bold">
                {sellingPrice && parseFloat(sellingPrice) > 0
                  ? `${calculations.realProfitMargin.toFixed(1)}%`
                  : '--'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Adicione ingredientes para ver os cálculos de custo e margem
          </p>
        )}
      </div>
    </div>
  );
}
