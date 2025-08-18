'use client';

import { useState } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { Ingredient } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { getBaseUnit, normalizeQuantity } from '@/utils/normalizeQuantity';
import AddIngredientList from './addIngredientList';

export default function IngredientSelector() {
  const { state: estoque } = useIngredientContext();
  const { dispatch, state: finalProduct } = useProductBuilderContext();

  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState<string>('1');

  // Filtro em tempo real dos ingredientes com base no input
  const filtered = estoque.ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.name); // Preenche o campo com o nome selecionado
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

    // Converte automaticamente kg → g, l → ml, etc
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
        quantity: normalizedQuantity, // Quantidade já normalizada
        totalValue: normalizedQuantity * (selectedIngredient.buyPrice ?? 0), // Preço por unidade base
      },
    });

    setSelectedIngredient(null);
    setQuantity('1');
    setInputValue('');
  };

  return (
    <div className="relative w-full space-y-4">
      {/* Input de busca de ingrediente */}
      <input
        type="text"
        placeholder="Digite o nome do ingrediente"
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          setSelectedIngredient(null); // Limpa a seleção ao digitar novamente
        }}
        className="w-full rounded border p-2"
      />

      {/* Lista de sugestões */}
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

      {/* Formulário com ingrediente selecionado */}
      {selectedIngredient && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium">
              Valor por {getBaseUnit(selectedIngredient.unit)}: R${' '}
              {(selectedIngredient.buyPrice ?? 0).toFixed(3)}
            </span>

            {/* Input de quantidade (será normalizada se necessário) */}
            <input
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min={0}
              step="any"
              className="w-24 rounded border p-2"
            />

            {/* Cálculo em tempo real do valor total com base na unidade base */}
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

          {/* Exibe a quantidade já convertida */}
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
