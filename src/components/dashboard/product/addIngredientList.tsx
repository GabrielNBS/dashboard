import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { getBaseUnit } from '@/utils/normalizeQuantity';
import React from 'react';

function AddIngredientList() {
  const { dispatch, state } = useProductBuilderContext();

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {state.ingredients.map(ingredient => (
        <div key={ingredient.id} className="flex items-center gap-2">
          <span className="text-accent bg-accent-light rounded px-3 py-1 text-sm">
            {ingredient.name} | {ingredient.quantity} {getBaseUnit(ingredient.unit)} x R$
            {(ingredient.buyPrice ?? 0).toFixed(3)} = R${ingredient.totalValue.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'REMOVE_INGREDIENT', payload: ingredient.id })}
            className="text-on-critical text-xs hover:underline"
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}

export default AddIngredientList;
