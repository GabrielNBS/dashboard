'use client';

import { useState } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { Ingredient } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

import AddIngredientList from './addIngredientList';
import SearchableInput from '@/components/ui/SearcheableInput';
import { getBaseUnit, normalizeQuantity } from '@/utils/helpers/normalizeQuantity';
import { formatCurrency } from '@/utils/UnifiedUtils';
import { QuantityInput } from '@/components/ui/forms';

export default function IngredientSelector() {
  const { state: estoque } = useIngredientContext();
  const { dispatch, state: finalProduct } = useProductBuilderContext();

  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantityUtilized, setQuantity] = useState<string>('1');

  // Função para calcular o custo usando preço médio ponderado
  const getTotalPrice = (quantityUtilized: string, ingredient: Ingredient): string => {
    const parsed = parseFloat(quantityUtilized);

    if (isNaN(parsed) || parsed <= 0) return '0.00';

    // Converte a quantidade para unidade base (ex: g, ml, un)
    const normalized = normalizeQuantity(parsed, ingredient.unit);

    // Usa o preço médio ponderado atual
    const total = normalized * ingredient.averageUnitPrice;

    return formatCurrency(total);
  };

  // Verifica se há quantidade suficiente em estoque
  const hasEnoughStock = (ingredient: Ingredient, requiredQuantity: number): boolean => {
    const normalizedRequired = normalizeQuantity(requiredQuantity, ingredient.unit);
    return ingredient.totalQuantity >= normalizedRequired;
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

    // Verifica se há estoque suficiente (apenas validação, não consome)
    if (!hasEnoughStock(selectedIngredient, parsedInput)) {
      alert(
        `Estoque insuficiente. Disponível: ${selectedIngredient.totalQuantity} ${getBaseUnit(selectedIngredient.unit)}`
      );
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

    // Adiciona ao produto - cria um "snapshot" do ingrediente com preço fixo
    // NÃO consome estoque - isso acontece apenas no PDV
    const ingredientSnapshot: Ingredient = {
      ...selectedIngredient,
      totalQuantity: normalizedQuantity,
      averageUnitPrice: selectedIngredient.averageUnitPrice, // Preço fixo no momento da adição
      batches: [
        {
          id: `recipe_batch_${Date.now()}`,
          purchaseDate: new Date(),
          buyPrice: selectedIngredient.averageUnitPrice * normalizedQuantity,
          originalQuantity: normalizedQuantity,
          currentQuantity: normalizedQuantity,
          unitPrice: selectedIngredient.averageUnitPrice,
        },
      ],
    };

    dispatch({
      type: 'ADD_INGREDIENT',
      payload: ingredientSnapshot,
    });

    // NÃO chama consumeIngredient aqui - estoque permanece inalterado

    setSelectedIngredient(null);
    setQuantity('1');
    setInputValue('');
  };

  // Filtrar apenas ingredientes que têm estoque
  const ingredientsWithStock = estoque.ingredients.filter(
    ingredient => ingredient.totalQuantity > 0
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Buscar ingrediente</label>
        <SearchableInput<Ingredient>
          items={ingredientsWithStock}
          onSelectItem={handleSelectIngredient}
          displayAttribute="name"
          placeholder="Digite o nome do ingrediente..."
          inputValue={inputValue}
          onInputChange={setInputValue}
        />
      </div>

      {selectedIngredient && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{selectedIngredient.name}</h4>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {selectedIngredient.unit}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="font-medium text-blue-600">Preço médio</p>
              <p className="font-semibold text-blue-900">
                R$ {selectedIngredient.averageUnitPrice.toFixed(3)}/
                {getBaseUnit(selectedIngredient.unit)}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <p className="font-medium text-green-600">Estoque disponível</p>
              <p className="font-semibold text-green-900">
                {selectedIngredient.totalQuantity} {getBaseUnit(selectedIngredient.unit)}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quantidade necessária
              </label>
              <QuantityInput
                value={quantityUtilized}
                onChange={setQuantity}
                placeholder="0"
                className="w-full"
                unit={getBaseUnit(selectedIngredient.unit)}
                maxValue={selectedIngredient.unit === 'un' ? 1000 : 100}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Custo total</label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium">
                R$ {getTotalPrice(quantityUtilized, selectedIngredient)}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              disabled={!hasEnoughStock(selectedIngredient, parseFloat(quantityUtilized) || 0)}
            >
              Adicionar
            </button>
          </div>

          <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">
            <p>
              <strong>Quantidade normalizada:</strong>{' '}
              {(() => {
                const parsed = parseFloat(quantityUtilized);
                if (!quantityUtilized || isNaN(parsed)) return 0;
                return normalizeQuantity(parsed, selectedIngredient.unit);
              })()}{' '}
              {getBaseUnit(selectedIngredient.unit)}
            </p>
          </div>

          {/* Mostrar informações dos batches disponíveis */}
          {selectedIngredient.batches.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800">
                Ver lotes em estoque ({selectedIngredient.batches.length})
              </summary>
              <div className="mt-2 space-y-2 rounded bg-gray-50 p-3">
                {selectedIngredient.batches.map(batch => (
                  <div key={batch.id} className="flex items-center justify-between text-gray-600">
                    <span>{new Date(batch.purchaseDate).toLocaleDateString()}</span>
                    <span className="font-medium">
                      {batch.currentQuantity} {getBaseUnit(selectedIngredient.unit)}
                    </span>
                    <span className="text-green-600">
                      R$ {batch.unitPrice.toFixed(3)}/{getBaseUnit(selectedIngredient.unit)}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      <AddIngredientList />
    </div>
  );
}
