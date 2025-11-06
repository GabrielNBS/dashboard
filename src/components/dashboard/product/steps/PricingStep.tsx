import React from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import PriceAndMarginInputs from '@/components/dashboard/product/PriceAndMarginInputs';

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
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-warning mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full shadow-md">
          <div className="loader bg-on-warning!"></div>
        </div>
        <h2 className="text-on-surface text-xl font-bold">Preços e Margens</h2>
        <p className="text-on-surface-variant mt-1 text-sm">
          Defina o preço de venda e margem de lucro desejada
        </p>

        <div
          className={`bg-warning text-on-warning invisible mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${isComplete && 'visible'}`}
        >
          <span className="bg-warning h-2 w-2 rounded-full"></span>
          Preço: R$ {parseFloat(data.sellingPrice).toFixed(2)} | Margem: {data.margin}%
        </div>
      </div>

      <div className="bg-warning rounded-lg p-4">
        <PriceAndMarginInputs
          mode={state.production.mode}
          sellingPrice={data.sellingPrice}
          onSellingPriceChange={handleSellingPriceChange}
          margin={data.margin}
          onMarginChange={handleMarginChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="border-warning bg-warning rounded-lg border p-3 shadow-md">
          <div className="flex items-start gap-2">
            <div className="bg-warning mt-0.5 flex h-5 w-5 items-center justify-center rounded-full">
              <span className="text-on-warning text-xs">💰</span>
            </div>
            <div>
              <h4 className="text-on-warning text-sm font-medium">Preço de Venda</h4>
              <p className="text-on-warning mt-1 text-xs">
                {state.production.mode === 'lote'
                  ? `Valor de CADA unidade (lote completo: R$ ${(parseFloat(data.sellingPrice) * state.production.yieldQuantity).toFixed(2)})`
                  : 'Valor total do produto'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-warning bg-warning rounded-lg border p-3 shadow-md">
          <div className="flex items-start gap-2">
            <div className="bg-tertiary mt-0.5 flex h-5 w-5 items-center justify-center rounded-full">
              <span className="text-on-tertiary text-xs">📈</span>
            </div>
            <div>
              <h4 className="text-on-warning text-sm font-medium">Margem de Lucro</h4>
              <p className="text-on-warning mt-1 text-xs">
                Percentual de lucro desejado sobre o custo dos ingredientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
