import React, { useEffect } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import IngredientSelector from '@/components/dashboard/product/IngredientSelector';

interface IngredientsStepProps {
  data: {
    ingredientsCount: number;
  };
  updateData: (data: Partial<{ ingredientsCount: number }>) => void;
}

export default function IngredientsStep({ data, updateData }: IngredientsStepProps) {
  const { state } = useProductBuilderContext();

  // Atualizar o contador quando ingredientes mudarem
  useEffect(() => {
    if (state.ingredients.length !== data.ingredientsCount) {
      updateData({ ingredientsCount: state.ingredients.length });
    }
  }, [state.ingredients.length, data.ingredientsCount, updateData]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 text-center sm:mb-8">
        <div className="bg-warning mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-16 sm:w-16">
          <div className="loader bg-on-warning!"></div>
        </div>
        <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">Ingredientes</h2>
        <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
          Adicione os ingredientes necessários para o seu produto
        </p>
        {state.ingredients.length > 0 && (
          <div className="bg-warning text-on-warning mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:mt-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
            <span className="bg-on-warning h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"></span>
            {state.ingredients.length} ingrediente{state.ingredients.length !== 1 ? 's' : ''}{' '}
            adicionado{state.ingredients.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="bg-muted rounded-lg p-3 sm:p-6">
        <IngredientSelector />
      </div>
    </div>
  );
}
