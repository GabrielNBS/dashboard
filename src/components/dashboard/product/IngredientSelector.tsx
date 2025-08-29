'use client';

import { useState } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { getBaseUnit, normalizeQuantity } from '@/utils/normalizeQuantity';
import AddIngredientList from './addIngredientList';
import SearchableInput from '@/components/ui/SearcheableInput';

export default function IngredientSelector() {
  const { state: estoque } = useIngredientContext();
  const { dispatch, state: finalProduct } = useProductBuilderContext();

  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantityUtilized, setQuantity] = useState<string>('1');

  const pricePerUnit = (buyPrice: number, quantity: number): number => buyPrice / quantity;

  // Função para calcular o custo proporcional de um ingrediente utilizado
  const getTotalPrice = (
    quantityUtilized: string,
    ingredient: {
      unit: UnitType;
      buyPrice: number;
      quantity: number;
    }
  ): string => {
    const parsed = parseFloat(quantityUtilized);

    if (isNaN(parsed) || parsed <= 0) return '0.00';

    // Converte a quantidade para unidade base (ex: g, ml, un)
    const normalized = normalizeQuantity(parsed, ingredient.unit);

    // Cálculo proporcional do custo
    const unitPrice = pricePerUnit(ingredient.buyPrice, ingredient.quantity);
    const total = normalized * unitPrice;

    return total.toFixed(2); // string com 2 casas decimais
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.name);
  };

  const handleAddIngredient = () => {
    const parsedInput = parseFloat(quantityUtilized);

    if (
      !selectedIngredient ||
      !quantityUtilized ||
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
        buyPrice: pricePerUnit(selectedIngredient.buyPrice, selectedIngredient.quantity),
        unit: selectedIngredient.unit,
        quantity: normalizedQuantity,
      },
    });

    setSelectedIngredient(null);
    setQuantity('1');
    setInputValue('');
  };

  return (
    <div className="relative w-full">
      <label className="font-medium">Selecione os ingredientes</label>
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
              {pricePerUnit(selectedIngredient.buyPrice, selectedIngredient.quantity).toFixed(3)}
            </span>

            <input
              type="number"
              placeholder="Quantidade"
              value={quantityUtilized}
              onChange={e => setQuantity(e.target.value)}
              min={0}
              step="any"
              className="w-24 rounded border p-2"
            />

            <span>Total: R$ {getTotalPrice(quantityUtilized, selectedIngredient)}</span>

            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-accent text-background rounded px-4 py-2"
            >
              Adicionar
            </button>
          </div>

          <span className="text-muted-foreground ml-[2px] text-xs">
            Quantidade normalizada:{' '}
            {(() => {
              const parsed = parseFloat(quantityUtilized);
              if (!quantityUtilized || isNaN(parsed)) return 0;
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
