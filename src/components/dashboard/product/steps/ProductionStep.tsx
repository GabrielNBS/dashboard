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
    <div className="space-y-4">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <div className="loader bg-purple-500!"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Configuração de Produção</h2>
        <p className="mt-2 text-gray-600">Defina como este produto será produzido</p>
        {state.production.mode && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm text-purple-700">
            <span className="h-2 w-2 rounded-full bg-purple-500"></span>
            Modo: {state.production.mode === 'individual' ? 'Individual' : 'Lote'}
            {state.production.mode === 'lote' && ` (${state.production.yieldQuantity} unidades)`}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-purple-50 p-4">
        <ProductionSelector />
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <span className="text-xs text-blue-600">💡</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Dica</h4>
            <p className="mt-1 text-sm text-blue-700">
              <strong>Individual:</strong> Para produtos feitos um por vez (ex: hambúrguer, açaí).
              <br />
              <strong>Lote:</strong> Para produtos feitos em quantidade (ex: bolos, pizzas grandes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
