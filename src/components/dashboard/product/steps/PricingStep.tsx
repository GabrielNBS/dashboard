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
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <div className="loader"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Preços e Margens</h2>
        <p className="mt-1 text-sm text-gray-600">
          Defina o preço de venda e margem de lucro desejada
        </p>
        {isComplete && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            Preço: R$ {parseFloat(data.sellingPrice).toFixed(2)} | Margem: {data.margin}%
          </div>
        )}
      </div>

      <div className="rounded-lg bg-orange-50 p-4">
        <PriceAndMarginInputs
          mode={state.production.mode}
          sellingPrice={data.sellingPrice}
          onSellingPriceChange={handleSellingPriceChange}
          margin={data.margin}
          onMarginChange={handleMarginChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100">
              <span className="text-xs text-yellow-600">💰</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Preço de Venda</h4>
              <p className="mt-1 text-xs text-yellow-700">
                {state.production.mode === 'lote'
                  ? 'Valor que cada unidade será vendida'
                  : 'Valor total do produto'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
              <span className="text-xs text-green-600">📈</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900">Margem de Lucro</h4>
              <p className="mt-1 text-xs text-green-700">
                Percentual de lucro desejado sobre o custo dos ingredientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
