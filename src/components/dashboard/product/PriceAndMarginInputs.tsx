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
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
          <label className="text-foreground mb-2 block text-sm font-medium">
            {mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}{' '}
            <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <CurrencyInput
              value={sellingPrice}
              onChange={onSellingPriceChange}
              className="border-border focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:ring-2"
              placeholder="R$ 0,00"
              maxValue={9999.99}
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-muted-foreground text-sm">BRL</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-foreground mb-2 block text-sm font-medium">
            Margem de Lucro <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <PercentageInput
              value={margin}
              onChange={onMarginChange}
              className="border-border focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:ring-2"
              placeholder="0%"
              maxValue={300}
              minValue={0}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-muted-foreground text-sm">%</span>
            </div>
          </div>

          {/* Área fixa para preço sugerido - evita saltos visuais */}
        </div>
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
