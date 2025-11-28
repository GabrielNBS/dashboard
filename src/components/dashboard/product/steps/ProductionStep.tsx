import React, { useCallback } from 'react';
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

// ✅ FASE 2.1: Memoizado para evitar re-renders
const ProductionStep = React.memo(function ProductionStep({ data, updateData }: ProductionStepProps) {
  const { state } = useProductBuilderContext();

  // ✅ FASE 1.4: Memoiza updateData para evitar loops
  const memoizedUpdateData = useCallback(updateData, [updateData]);

  // Sincronizar com o contexto
  React.useEffect(() => {
    if (state.production.mode !== data.productionMode) {
      memoizedUpdateData({ productionMode: state.production.mode });
    }
    if (state.production.yieldQuantity !== data.yieldQuantity) {
      memoizedUpdateData({ yieldQuantity: state.production.yieldQuantity });
    }
  }, [
    state.production.mode,
    state.production.yieldQuantity,
    data.productionMode,
    data.yieldQuantity,
    memoizedUpdateData,
  ]);

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="mb-2 text-center sm:mb-4">
        <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 sm:mb-2 sm:h-12 sm:w-12">
          <div className="loader bg-purple-500!"></div>
        </div>
        <h2 className="text-base font-bold text-gray-900 sm:text-xl">Configuração de Produção</h2>
        <p className="mt-0.5 text-[10px] text-gray-600 sm:mt-1 sm:text-xs">
          Defina como este produto será produzido
        </p>
        {state.production.mode && (
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-[10px] text-purple-700 sm:mt-2 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
            <span className="h-1 w-1 rounded-full bg-purple-500 sm:h-1.5 sm:w-1.5"></span>
            Modo: {state.production.mode === 'individual' ? 'Individual' : 'Lote'}
            {state.production.mode === 'lote' && ` (${state.production.yieldQuantity} unidades)`}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-purple-50 p-2 sm:p-3">
        <ProductionSelector />
      </div>
    </div>
  );
});

export default ProductionStep;
