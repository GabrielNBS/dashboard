'use client';

import { useState } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { Ingredient } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { getBaseUnit, normalizeQuantity } from '@/utils/normalizeQuantity';
import AddIngredientList from './addIngredientList';
import SearchableInput from '@/components/ui/SearcheableInput';

export default function IngredientSelector() {
  const { state: estoque } = useIngredientContext();
  const { dispatch, state: finalProduct } = useProductBuilderContext();

  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState<string>('1');

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.name);
  };

  const handleAddIngredient = () => {
    const parsedInput = parseFloat(quantity);

    if (
      !selectedIngredient ||
      !quantity ||
      isNaN(parsedInput) ||
      parsedInput <= 0 ||
      !selectedIngredient.name
    ) {
      alert('Preencha todos os campos');
      return;
    }

    const normalizedQuantity = normalizeQuantity(parsedInput, selectedIngredient.unit);

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
        quantity: normalizedQuantity,
        totalValue: normalizedQuantity * (selectedIngredient.buyPrice ?? 0),
      },
    });

    setSelectedIngredient(null);
    setQuantity('1');
    setInputValue('');
  };

  return (
    <div className="relative w-full space-y-4">
      <SearchableInput<Ingredient>
        items={estoque.ingredients}
        onSelectItem={handleSelectIngredient}
        displayAttribute="name"
        placeholder="Digite o nome do ingrediente"
        inputValue={inputValue}
        onInputChange={setInputValue}
      />

      {selectedIngredient && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium">
              Valor por {getBaseUnit(selectedIngredient.unit)}: R${' '}
              {(selectedIngredient.buyPrice ?? 0).toFixed(3)}
            </span>

            <input
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min={0}
              step="any"
              className="w-24 rounded border p-2"
            />

            <span>
              Total: R${' '}
              {(() => {
                const parsed = parseFloat(quantity);
                if (!quantity || isNaN(parsed)) return '0.00';
                const normalized = normalizeQuantity(parsed, selectedIngredient.unit);
                return (normalized * (selectedIngredient.buyPrice ?? 0)).toFixed(2);
              })()}
            </span>

            <button
              type="button"
              onClick={handleAddIngredient}
              className="rounded bg-purple-600 px-4 py-2 text-white"
            >
              Adicionar
            </button>
          </div>

          <span className="ml-[2px] text-xs text-gray-500">
            Quantidade normalizada:{' '}
            {(() => {
              const parsed = parseFloat(quantity);
              if (!quantity || isNaN(parsed)) return 0;
              return normalizeQuantity(parsed, selectedIngredient.unit);
            })()}{' '}
            {getBaseUnit(selectedIngredient.unit)}
          </span>
        </div>
      )}

      <AddIngredientList />
    </div>
  );
}
