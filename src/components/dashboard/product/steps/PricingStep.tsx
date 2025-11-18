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

export default function PricingStep({ data, updateData }: PricingStepProps) {
  const { state } = useProductBuilderContext();

  const handleSellingPriceChange = (price: string) => {
    updateData({ sellingPrice: price });
  };

  const handleMarginChange = (margin: string) => {
    updateData({ margin });
  };

  const isComplete = data.sellingPrice && parseFloat(data.sellingPrice) > 0 && data.margin;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-center">
        <div className="bg-warning mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full shadow-md sm:mb-3 sm:h-12 sm:w-12">
          <div className="loader bg-on-warning!"></div>
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <h2 className="text-on-surface text-base font-bold sm:text-xl">Preços e Margens</h2>
          <InfoButton
            info="A margem de lucro é calculada sobre o custo dos ingredientes. Por exemplo, se o custo é R$ 10,00 e a margem é 50%, o preço de venda será R$ 15,00."
            position="bottom"
          />
        </div>
        <p className="text-on-surface-variant mt-1 text-xs sm:text-sm">
          Defina o preço de venda e margem de lucro desejada
        </p>

        <div
          className={`bg-warning text-on-warning invisible mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs sm:mt-3 sm:gap-2 sm:px-3 sm:text-sm ${isComplete && 'visible'}`}
        >
          <span className="bg-warning h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"></span>
          <span className="hidden sm:inline">
            Preço: R$ {parseFloat(data.sellingPrice).toFixed(2)} | Margem: {data.margin}%
          </span>
          <span className="sm:hidden">
            R$ {parseFloat(data.sellingPrice).toFixed(2)} | {data.margin}%
          </span>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-3 sm:p-4">
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
}
