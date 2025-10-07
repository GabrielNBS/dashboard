import React, { useMemo } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CostPreviews from '@/components/dashboard/product/CostPreviews';
import { getBaseUnit } from '@/utils/helpers/normalizeQuantity';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';

interface ReviewStepProps {
  data: {
    name: string;
    category: string;
    sellingPrice: string;
    margin: string;
  };
}

export default function ReviewStep({ data }: ReviewStepProps) {
  const { state } = useProductBuilderContext();

  // Cálculos finais
  const calculations = useMemo(() => {
    const totalCost = state.ingredients.reduce(
      (acc, ing) => acc + (ing.averageUnitPrice * ing.totalQuantity || 0),
      0
    );

    const suggestedPrice = calculateSuggestedPrice(
      totalCost,
      parseFloat(data.margin) || 0,
      state.production.mode,
      state.production.yieldQuantity
    );

    const realProfitMargin = calculateRealProfitMargin(
      totalCost,
      parseFloat(data.sellingPrice) || 0,
      state.production.mode,
      state.production.yieldQuantity
    );

    const unitCost = calculateUnitCost(
      totalCost,
      state.production.mode,
      state.production.yieldQuantity
    );

    return {
      totalCost,
      suggestedPrice,
      realProfitMargin,
      unitCost,
    };
  }, [state.ingredients, state.production, data.sellingPrice, data.margin]);

  return (
    <div className="space-y-4">
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <div className="loader bg-on-info!"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Revisar Produto</h2>
        <p className="mt-1 text-sm text-gray-600">Confira todas as informações antes de salvar</p>
      </div>

      {/* Informações Básicas */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          Informações Básicas
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Nome do Produto</span>
            <p className="font-medium text-gray-900">{data.name || '-'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Categoria</span>
            <p className="font-medium text-gray-900">{data.category || '-'}</p>
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          Ingredientes ({state.ingredients.length})
        </h3>
        {state.ingredients.length > 0 ? (
          <div className="space-y-2">
            {state.ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{ingredient.name}</p>
                    <p className="text-sm text-gray-500">
                      {ingredient.totalQuantity} {getBaseUnit(ingredient.unit)} × R${' '}
                      {ingredient.averageUnitPrice.toFixed(3)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    R$ {(ingredient.averageUnitPrice * ingredient.totalQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Custo Total dos Ingredientes</span>
                <span className="text-lg font-bold text-gray-900">
                  R$ {calculations.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Nenhum ingrediente adicionado</p>
        )}
      </div>

      {/* Produção */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          Configuração de Produção
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Modo de Produção</span>
            <p className="font-medium text-gray-900">
              {state.production.mode === 'individual' ? 'Individual' : 'Lote'}
            </p>
          </div>
          {state.production.mode === 'lote' && (
            <div>
              <span className="text-sm font-medium text-gray-500">Rendimento do Lote</span>
              <p className="font-medium text-gray-900">{state.production.yieldQuantity} unidades</p>
            </div>
          )}
        </div>
      </div>

      {/* Preços */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          Preços e Margens
        </h3>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-gray-500">
              {state.production.mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}
            </span>
            <p className="font-medium text-gray-900">
              R$ {parseFloat(data.sellingPrice || '0').toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Margem Desejada</span>
            <p className="font-medium text-gray-900">{data.margin}%</p>
          </div>
        </div>

        {/* Resumo de Custos */}
        <CostPreviews
          unitCost={calculations.unitCost}
          suggestedPrice={calculations.suggestedPrice}
          realProfitMargin={calculations.realProfitMargin}
          mode={state.production.mode}
        />
      </div>

      {/* Alerta se houver problemas */}
      {calculations.realProfitMargin < 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
              <span className="text-xs text-red-600">⚠️</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-900">Atenção: Margem Negativa</h4>
              <p className="mt-1 text-sm text-red-700">
                O preço de venda está abaixo do custo dos ingredientes. Considere ajustar o preço ou
                revisar os ingredientes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
