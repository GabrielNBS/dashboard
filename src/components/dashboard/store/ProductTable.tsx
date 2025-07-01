import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/icons/formatCurrency';
import { useIngredientContext } from '@/hooks/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';

export default function IngredientTable() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;

  function handleDeleteIngredient(ingredientId: number) {
    dispatch({ type: 'DELETE_INGREDIENT', payload: ingredientId });
  }

  function handleEditIngredient(ingredient: Ingredient) {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: ingredient });
  }

  const hydrated = useHydrated();

  if (!hydrated) {
    return <div>Loading...</div>;
  }

  return (
    <table className="w-1/2">
      <thead className="text-hero-left text-hero-sm font-bold uppercase">
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="p-2">Nome</th>
          <th className="p-2">Quantidade</th>
          <th className="p-2">unidade</th>
          <th className="p-2">Preço de compra</th>
          <th className="p-2">Status</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody className="text-hero-sm">
        {ingredients.map(ingredient => (
          <tr key={ingredient.id}>
            <td className="p-2">{ingredient.name}</td>
            <td className="p-2">{ingredient.quantity}</td>
            <td className="p-2">{ingredient.unit}</td>
            <td className="p-2">{formatCurrency(ingredient.buyPrice ?? 0)}</td>
            <td className="p-2">{ingredient.stockStatus}</td>
            <td className="p-2">
              <div className="flex gap-2">
                <Button variant="edit" onClick={() => handleEditIngredient(ingredient)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteIngredient(ingredient.id)}>
                  Deletar
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
