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
    <div className="relative w-full">
      <label className="font-medium">Selecione os ingredientes</label>
      <SearchableInput<Ingredient>
        items={ingredientsWithStock}
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
              Preço médio por {getBaseUnit(selectedIngredient.unit)}: R${' '}
              {selectedIngredient.averageUnitPrice.toFixed(3)}
            </span>

            <span className="text-sm text-gray-600">
              Estoque: {selectedIngredient.totalQuantity} {getBaseUnit(selectedIngredient.unit)}
            </span>

            <QuantityInput
              value={quantityUtilized}
              onChange={setQuantity}
              placeholder="Quantidade"
              className="w-24"
              unit={getBaseUnit(selectedIngredient.unit)}
              maxValue={selectedIngredient.unit === 'un' ? 1000 : 100} // 1000 unidades ou 100kg/l
            />

            <span>Total: R$ {getTotalPrice(quantityUtilized, selectedIngredient)}</span>

            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-accent text-background rounded px-4 py-2"
              disabled={!hasEnoughStock(selectedIngredient, parseFloat(quantityUtilized) || 0)}
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

          {/* Mostrar informações dos batches disponíveis */}
          {selectedIngredient.batches.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <details>
                <summary className="cursor-pointer">
                  Ver batches em estoque ({selectedIngredient.batches.length})
                </summary>
                <div className="mt-1 space-y-1">
                  {selectedIngredient.batches.map(batch => (
                    <div key={batch.id} className="flex justify-between">
                      <span>{new Date(batch.purchaseDate).toLocaleDateString()}</span>
                      <span>
                        {batch.currentQuantity} {getBaseUnit(selectedIngredient.unit)}
                      </span>
                      <span>
                        R$ {batch.unitPrice.toFixed(3)}/{getBaseUnit(selectedIngredient.unit)}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      )}

      <AddIngredientList />
    </div>
  );
}
