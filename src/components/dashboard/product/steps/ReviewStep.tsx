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
    <div className="space-y-3 sm:space-y-4">
      <div className="mb-3 text-center sm:mb-4">
        <div className="bg-info mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full sm:mb-3 sm:h-12 sm:w-12">
          <div className="loader bg-on-info!"></div>
        </div>
        <h2 className="text-foreground text-base font-bold sm:text-xl">Revisar produto</h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          Confira todas as informações antes de salvar
        </p>
      </div>

      {/* Informações Básicas */}
      <div className="border-border bg-card rounded-lg border p-3 sm:p-4">
        <h3 className="text-foreground mb-2 flex items-center gap-1.5 text-sm font-semibold sm:mb-3 sm:gap-2 sm:text-base">
          Informações básicas
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
          <div>
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              Nome do Produto
            </span>
            <p className="text-foreground text-sm font-medium sm:text-base">{data.name || '-'}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">Categoria</span>
            <p className="text-foreground text-sm font-medium sm:text-base">
              {data.category || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="border-border bg-card rounded-lg border p-3 sm:p-4">
        <h3 className="text-foreground mb-2 flex items-center gap-1.5 text-sm font-semibold sm:mb-3 sm:gap-2 sm:text-base">
          Ingredientes ({state.ingredients.length})
        </h3>
        {state.ingredients.length > 0 ? (
          <div className="space-y-1.5 sm:space-y-2">
            {state.ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="bg-muted flex items-center justify-between rounded-lg p-2"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="bg-great text-on-great flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium sm:h-6 sm:w-6 sm:text-xs">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-foreground text-xs font-medium sm:text-sm">
                      {ingredient.name}
                    </p>
                    <p className="text-muted-foreground text-[10px] sm:text-xs">
                      {ingredient.totalQuantity} {getBaseUnit(ingredient.unit)} × R${' '}
                      {ingredient.averageUnitPrice.toFixed(3)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-xs font-medium sm:text-sm">
                    R$ {(ingredient.averageUnitPrice * ingredient.totalQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-2 border-t pt-2 sm:mt-3 sm:pt-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-xs font-medium sm:text-sm">
                  Custo Total dos Ingredientes
                </span>
                <span className="text-foreground text-base font-bold sm:text-lg">
                  R$ {calculations.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs sm:text-sm">Nenhum ingrediente adicionado</p>
        )}
      </div>

      {/* Produção */}
      <div className="border-border bg-card rounded-lg border p-3 sm:p-4">
        <h3 className="text-foreground mb-2 flex items-center gap-1.5 text-sm font-semibold sm:mb-3 sm:gap-2 sm:text-base">
          Configuração de Produção
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
          <div>
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              Modo de Produção
            </span>
            <p className="text-foreground text-sm font-medium sm:text-base">
              {state.production.mode === 'individual' ? 'Individual' : 'Lote'}
            </p>
          </div>
          {state.production.mode === 'lote' && (
            <div>
              <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                Rendimento do Lote
              </span>
              <p className="text-foreground text-sm font-medium sm:text-base">
                {state.production.yieldQuantity} unidades
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preços */}
      <div className="border-border bg-card rounded-lg border p-3 sm:p-4">
        <h3 className="text-foreground mb-2 flex items-center gap-1.5 text-sm font-semibold sm:mb-3 sm:gap-2 sm:text-base">
          Preços e Margens
        </h3>
        <div className="mb-3 grid grid-cols-1 gap-2 sm:mb-4 sm:gap-3 md:grid-cols-2">
          <div>
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              {state.production.mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}
            </span>
            <p className="text-foreground text-sm font-medium sm:text-base">
              R$ {parseFloat(data.sellingPrice || '0').toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              Margem desejada
            </span>
            <p className="text-foreground text-sm font-medium sm:text-base">{data.margin}%</p>
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
        <div className="border-destructive bg-bad rounded-lg border p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-destructive/20 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full sm:h-6 sm:w-6">
              <span className="text-on-bad text-[10px] sm:text-xs">⚠️</span>
            </div>
            <div>
              <h4 className="text-on-bad text-xs font-medium sm:text-sm">
                Atenção: Margem Negativa
              </h4>
              <p className="text-on-bad mt-1 text-xs sm:text-sm">
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
