import Button from '@/components/ui/base/Button';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { getBaseUnit } from '@/utils/helpers/normalizeQuantity';
import { Trash2 } from 'lucide-react';
import React from 'react';

function AddIngredientList() {
  const { dispatch, state } = useProductBuilderContext();

  if (state.ingredients.length === 0) {
    return (
      <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-center">
        <p className="text-sm text-gray-500">Nenhum ingrediente adicionado ainda</p>
        <p className="mt-1 text-xs text-gray-400">
          Use o campo acima para buscar e adicionar ingredientes
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Ingredientes Adicionados ({state.ingredients.length})
        </h4>
        <div className="text-primary text-xs">
          Total: R${' '}
          {state.ingredients
            .reduce((acc, ing) => acc + ing.averageUnitPrice * ing.totalQuantity, 0)
            .toFixed(2)}
        </div>
      </div>

      <div className="space-y-2">
        {state.ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="border-surface bg-surface rounded-lg border p-3 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-great flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-green-700">
                    {index + 1}
                  </span>
                  <span className="text-primary font-medium">{ingredient.name}</span>
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
                  <span>
                    {ingredient.totalQuantity} {getBaseUnit(ingredient.unit)}
                  </span>
                  <span>
                    R$ {ingredient.averageUnitPrice.toFixed(3)}/{getBaseUnit(ingredient.unit)}
                  </span>
                  <span className="text-on-great font-medium">
                    = R$ {(ingredient.averageUnitPrice * ingredient.totalQuantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => dispatch({ type: 'REMOVE_INGREDIENT', payload: ingredient.id })}
                size="sm"
                variant="edit"
                className="ml-3 text-red-500 hover:bg-red-50 hover:text-red-700"
                tooltip={{ tooltipContent: 'Remover ingrediente' }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddIngredientList;
