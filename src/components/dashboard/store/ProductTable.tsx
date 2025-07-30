'use client';

import Button from '@/components/ui/Button';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatQuantity, denormalizeQuantity, getBaseUnit } from '@/utils/normalizeQuantity';
import { getStockStatus } from '@/utils/ingredientUtils';

export default function IngredientTable() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;

  const hydrated = useHydrated();
  if (!hydrated) return <div>Loading...</div>;

  function handleDeleteIngredient(ingredientId: string) {
    const confirmDelete = confirm('Tem certeza que deseja excluir este ingrediente?');
    if (!confirmDelete) return;

    dispatch({ type: 'DELETE_INGREDIENT', payload: ingredientId });
  }

  function handleEditIngredient(ingredient: Ingredient) {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: ingredient });
  }

  return (
    <table className="w-full table-auto text-left">
      <thead className="bg-gray-100 text-sm font-bold text-gray-600 uppercase">
        <tr>
          <th className="p-2">Nome</th>
          <th className="p-2">Quantidade</th>
          <th className="p-2">Unidade</th>
          <th className="p-2">Preço de compra</th>
          <th className="p-2">Preço por {getBaseUnit('kg')}</th>
          <th className="p-2">Status</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {ingredients.map(ingredient => {
          const unitCost =
            ingredient.quantity > 0 ? ingredient.totalValue / ingredient.quantity : 0;

          return (
            <tr key={ingredient.id} className="border-b">
              <td className="p-2">{ingredient.name}</td>
              <td className="p-2">{formatQuantity(ingredient.quantity, ingredient.unit)}</td>
              <td className="p-2">{getBaseUnit(ingredient.unit)}</td>
              <td className="p-2">{formatCurrency(ingredient.buyPrice ?? 0)}</td>
              <td className="p-2">{formatCurrency(unitCost)}</td>
              <td className="p-2">{getStockStatus(ingredient.quantity, ingredient.unit)}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Button variant="edit" onClick={() => handleEditIngredient(ingredient)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteIngredient(ingredient.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
