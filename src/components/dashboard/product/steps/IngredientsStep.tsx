import React, { useEffect, useCallback } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import IngredientSelector from '@/components/dashboard/product/IngredientSelector';

interface IngredientsStepProps {
  data: {
    ingredientsCount: number;
  };
  updateData: (data: Partial<{ ingredientsCount: number }>) => void;
}

const IngredientsStep = React.memo(function IngredientsStep({
  data,
  updateData,
}: IngredientsStepProps) {
  const { state } = useProductBuilderContext();

  const memoizedUpdateData = useCallback(updateData, [updateData]);

  useEffect(() => {
    if (state.ingredients.length !== data.ingredientsCount) {
      memoizedUpdateData({ ingredientsCount: state.ingredients.length });
    }
  }, [state.ingredients.length, data.ingredientsCount, memoizedUpdateData]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="mb-2 text-center sm:mb-4">
        <div className="bg-warning mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full sm:mb-2 sm:h-12 sm:w-12">
          <div className="loader bg-on-warning!"></div>
        </div>
        <h2 className="text-base font-bold text-gray-900 sm:text-xl">Ingredientes</h2>
        <p className="mt-0.5 text-[10px] text-gray-600 sm:mt-1 sm:text-xs">
          Adicione os ingredientes necessários para o seu produto
        </p>
        {state.ingredients.length > 0 && (
          <div className="bg-warning text-on-warning mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] sm:mt-2 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
            <span className="bg-on-warning h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5"></span>
            {state.ingredients.length} ingrediente{state.ingredients.length !== 1 ? 's' : ''}{' '}
            adicionado{state.ingredients.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="bg-muted rounded-lg p-2 sm:p-4">
        <IngredientSelector />
      </div>
    </div>
  );
});

export default IngredientsStep;
