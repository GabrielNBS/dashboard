import React from 'react';
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
  React.useEffect(() => {
    if (state.ingredients.length !== data.ingredientsCount) {
      updateData({ ingredientsCount: state.ingredients.length });
    }
  }, [state.ingredients.length, data.ingredientsCount, updateData]);

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <div className="bg-warning mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <div className="loader bg-on-warning!"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Ingredientes</h2>
        <p className="mt-2 text-gray-600">
          Adicione os ingredientes necessários para o seu produto
        </p>
        {state.ingredients.length > 0 && (
          <div className="bg-warning text-on-warning mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <span className="bg-on-warning h-2 w-2 rounded-full"></span>
            {state.ingredients.length} ingrediente{state.ingredients.length !== 1 ? 's' : ''}{' '}
            adicionado{state.ingredients.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="bg-muted rounded-lg p-6">
        <IngredientSelector />
      </div>
    </div>
  );
}
