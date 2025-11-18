import React from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import ProductionSelector from '@/components/dashboard/product/ProductionSelector';

interface ProductionStepProps {
  data: {
    productionMode: 'individual' | 'lote' | '';
    yieldQuantity: number;
  };
  updateData: (
    data: Partial<{ productionMode: 'individual' | 'lote' | ''; yieldQuantity: number }>
  ) => void;
}

export default function ProductionStep({ data, updateData }: ProductionStepProps) {
  const { state } = useProductBuilderContext();

  // Sincronizar com o contexto
  React.useEffect(() => {
    if (state.production.mode !== data.productionMode) {
      updateData({ productionMode: state.production.mode });
    }
    if (state.production.yieldQuantity !== data.yieldQuantity) {
      updateData({ yieldQuantity: state.production.yieldQuantity });
    }
  }, [
    state.production.mode,
    state.production.yieldQuantity,
    data.productionMode,
    data.yieldQuantity,
    updateData,
  ]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="mb-4 text-center sm:mb-6">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 sm:mb-4 sm:h-16 sm:w-16">
          <div className="loader bg-purple-500!"></div>
        </div>
        <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">Configuração de Produção</h2>
        <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
          Defina como este produto será produzido
        </p>
        {state.production.mode && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs text-purple-700 sm:mt-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 sm:h-2 sm:w-2"></span>
            Modo: {state.production.mode === 'individual' ? 'Individual' : 'Lote'}
            {state.production.mode === 'lote' && ` (${state.production.yieldQuantity} unidades)`}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-purple-50 p-3 sm:p-4">
        <ProductionSelector />
      </div>
    </div>
  );
}
