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
        <div className="bg-info mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          <div className="loader bg-on-info!"></div>
        </div>
        <h2 className="text-foreground text-xl font-bold">Revisar produto</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Confira todas as informações antes de salvar
        </p>
      </div>

      {/* Informações Básicas */}
      <div className="border-border bg-card rounded-lg border p-4">
        <h3 className="text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
          <div className="bg-on-info h-2 w-2 rounded-full"></div>
          Informações básicas
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <span className="text-muted-foreground text-sm font-medium">Nome do Produto</span>
            <p className="text-foreground font-medium">{data.name || '-'}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm font-medium">Categoria</span>
            <p className="text-foreground font-medium">{data.category || '-'}</p>
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="border-border bg-card rounded-lg border p-4">
        <h3 className="text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
          <div className="bg-on-great h-2 w-2 rounded-full"></div>
          Ingredientes ({state.ingredients.length})
        </h3>
        {state.ingredients.length > 0 ? (
          <div className="space-y-2">
            {state.ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="bg-muted flex items-center justify-between rounded-lg p-2"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-great text-on-great flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{ingredient.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {ingredient.totalQuantity} {getBaseUnit(ingredient.unit)} × R${' '}
                      {ingredient.averageUnitPrice.toFixed(3)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-foreground font-medium">
                    R$ {(ingredient.averageUnitPrice * ingredient.totalQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">Custo Total dos Ingredientes</span>
                <span className="text-foreground text-lg font-bold">
                  R$ {calculations.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum ingrediente adicionado</p>
        )}
      </div>

      {/* Produção */}
      <div className="border-border bg-card rounded-lg border p-4">
        <h3 className="text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
          <div className="bg-accent h-2 w-2 rounded-full"></div>
          Configuração de Produção
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <span className="text-muted-foreground text-sm font-medium">Modo de Produção</span>
            <p className="text-foreground font-medium">
              {state.production.mode === 'individual' ? 'Individual' : 'Lote'}
            </p>
          </div>
          {state.production.mode === 'lote' && (
            <div>
              <span className="text-muted-foreground text-sm font-medium">Rendimento do Lote</span>
              <p className="text-foreground font-medium">
                {state.production.yieldQuantity} unidades
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preços */}
      <div className="border-border bg-card rounded-lg border p-4">
        <h3 className="text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
          <div className="bg-accent h-2 w-2 rounded-full"></div>
          Preços e Margens
        </h3>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <span className="text-muted-foreground text-sm font-medium">
              {state.production.mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}
            </span>
            <p className="text-foreground font-medium">
              R$ {parseFloat(data.sellingPrice || '0').toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm font-medium">Margem desejada</span>
            <p className="text-foreground font-medium">{data.margin}%</p>
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
        <div className="border-destructive bg-bad rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <div className="bg-destructive/20 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full">
              <span className="text-on-bad text-xs">⚠️</span>
            </div>
            <div>
              <h4 className="text-on-bad text-sm font-medium">Atenção: Margem Negativa</h4>
              <p className="text-on-bad mt-1 text-sm">
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
