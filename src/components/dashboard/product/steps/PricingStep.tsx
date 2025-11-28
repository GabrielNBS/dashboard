import React from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import PriceAndMarginInputs from '@/components/dashboard/product/PriceAndMarginInputs';
import { InfoButton } from '@/components/ui/InfoButton';

interface PricingStepProps {
  data: {
    sellingPrice: string;
    margin: string;
  };
  updateData: (data: Partial<{ sellingPrice: string; margin: string }>) => void;
}

// ✅ FASE 2.1: Memoizado para performance
const PricingStep = React.memo(function PricingStep({ data, updateData }: PricingStepProps) {
  const { state } = useProductBuilderContext();

  const handleSellingPriceChange = (price: string) => {
    updateData({ sellingPrice: price });
  };

  const handleMarginChange = (margin: string) => {
    updateData({ margin });
  };

  const isComplete = data.sellingPrice && parseFloat(data.sellingPrice) > 0 && data.margin;

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="text-center">
        <div className="bg-warning mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md sm:mb-2 sm:h-10 sm:w-10">
          <div className="loader bg-on-warning!"></div>
        </div>
        <div className="flex items-center justify-center gap-1 sm:gap-1.5">
          <h2 className="text-on-surface text-sm font-bold sm:text-lg">Preços e Margens</h2>
          <InfoButton
            info="A margem de lucro é calculada sobre o custo dos ingredientes. Por exemplo, se o custo é R$ 10,00 e a margem é 50%, o preço de venda será R$ 15,00."
            position="bottom"
          />
        </div>
        <p className="text-on-surface-variant mt-0.5 text-[10px] sm:text-xs">
          Defina o preço de venda e margem de lucro desejada
        </p>

        <div
          className={`bg-warning text-on-warning invisible mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:mt-2 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs ${isComplete && 'visible'}`}
        >
          <span className="bg-warning h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5"></span>
          <span className="hidden sm:inline">
            Preço: R$ {parseFloat(data.sellingPrice).toFixed(2)} | Margem: {data.margin}%
          </span>
          <span className="sm:hidden">
            R$ {parseFloat(data.sellingPrice).toFixed(2)} | {data.margin}%
          </span>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-2 sm:p-3">
        <PriceAndMarginInputs
          mode={state.production.mode}
          sellingPrice={data.sellingPrice}
          onSellingPriceChange={handleSellingPriceChange}
          margin={data.margin}
          onMarginChange={handleMarginChange}
        />
      </div>
    </div>
  );
});

export default PricingStep;
