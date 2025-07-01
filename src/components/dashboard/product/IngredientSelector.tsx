import { useState } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { Ingredient } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

export default function IngredientSelector() {
  const { state: estoque } = useIngredientContext();
  const { dispatch, state: finalProduct } = useProductBuilderContext();

  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const filtered = estoque.ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.name);
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient || quantity <= 0) return;

    const alreadyAdded = finalProduct.ingredients.some(
      ingredient => ingredient.id === selectedIngredient.id
    );

    if (alreadyAdded) {
      alert('Este ingrediente já foi adicionado.');
      return;
    }

    dispatch({
      type: 'ADD_INGREDIENT',
      payload: {
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        buyPrice: selectedIngredient.buyPrice,
        unit: selectedIngredient.unit,
        quantity,
        totalValue: quantity * (selectedIngredient.buyPrice ?? 0),
      },
    });

    setSelectedIngredient(null);
    setQuantity(1);
    setInputValue('');
  };

  return (
    <div className="relative w-full space-y-4">
      <input
        type="text"
        placeholder="Digite o nome do ingrediente"
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          setSelectedIngredient(null);
        }}
        className="w-full rounded border p-2"
      />
      {inputValue && !selectedIngredient && (
        <ul className="absolute z-10 mt-1 w-full rounded bg-white shadow-lg">
          {filtered.map(item => (
            <li
              key={item.id}
              onClick={() => handleSelectIngredient(item)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {item.name}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-400">Nenhum ingrediente encontrado</li>
          )}
        </ul>
      )}

      {selectedIngredient && (
        <div key={selectedIngredient.id} className="flex items-center gap-4">
          <span className="font-medium">
            Valor unitário: R$ {(selectedIngredient.buyPrice ?? 0).toFixed(2)}
          </span>
          <input
            type="number"
            placeholder="Quantidade"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            min={0}
            className="w-24 rounded border p-2"
          />
          <span>Total: R$ {((selectedIngredient.buyPrice ?? 0) * quantity).toFixed(2)}</span>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="rounded bg-purple-600 px-4 py-2 text-white"
          >
            Adicionar
          </button>
        </div>
      )}

      {/* Ingredientes selecionados */}
      <div className="mt-4 flex flex-wrap gap-2">
        {finalProduct.ingredients.map(ingredient => (
          <div key={ingredient.id} className="flex items-center gap-2">
            <span className="rounded bg-purple-100 px-3 py-1 text-sm text-purple-800">
              {ingredient.name} | {ingredient.quantity} x R${(ingredient.buyPrice ?? 0).toFixed(2)}{' '}
              = R$
              {ingredient.totalValue.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'REMOVE_INGREDIENT', payload: ingredient.id })}
              className="text-xs text-red-500 hover:underline"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
