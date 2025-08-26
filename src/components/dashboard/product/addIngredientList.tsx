import Button from '@/components/ui/Button';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { getBaseUnit } from '@/utils/normalizeQuantity';
import { Trash2 } from 'lucide-react';
import React from 'react';

function AddIngredientList() {
  const { dispatch, state } = useProductBuilderContext();

  return (
    <div className="mt-4 flex gap-2">
      {state.ingredients.map(ingredient => (
        <div key={ingredient.id} className="flex items-center gap-2">
          <div className="text-on-warning bg-warning flex gap-2 rounded px-3 py-1 text-sm">
            <span>
              {ingredient.name} | {ingredient.quantity} {getBaseUnit(ingredient.unit)} x R$
              {(ingredient.buyPrice ?? 0).toFixed(3)} = R${ingredient.totalValue.toFixed(2)}
            </span>
            <Button
              type="button"
              onClick={() => dispatch({ type: 'REMOVE_INGREDIENT', payload: ingredient.id })}
              size="sm"
              variant="edit"
              tooltip={{ tooltipContent: 'remover ingrediente' }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AddIngredientList;
