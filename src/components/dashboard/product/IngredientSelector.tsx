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
import { Button } from '@/components/ui/base';

export default function IngredientSelector() {
  const { state: estoque } = useIngredientContext();
  const { dispatch, state: finalProduct } = useProductBuilderContext();

  const [inputValue, setInputValue] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [, setQuantity] = useState<string>('1');
  const [displayQuantity, setDisplayQuantity] = useState<string>('1');

  // Converte valor de display para valor real baseado na unidade
  const convertDisplayToReal = (displayValue: string, unit: string): number => {
    const parsed = parseFloat(displayValue);
    if (isNaN(parsed) || parsed <= 0) return 0;

    // Para kg e l, o usuário digita em gramas/ml, então dividimos por 1000
    if (unit === 'kg' || unit === 'l') {
      return parsed / 1000;
    }

    return parsed;
  };

  // Converte valor real para valor de display baseado na unidade
  const convertRealToDisplay = (realValue: string, unit: string): string => {
    const parsed = parseFloat(realValue);
    if (isNaN(parsed) || parsed <= 0) return '';

    // Para kg e l, mostramos em gramas/ml
    if (unit === 'kg' || unit === 'l') {
      return (parsed * 1000).toString();
    }

    return realValue;
  };

  // Função para calcular o custo usando preço médio ponderado
  const getTotalPrice = (displayQuantity: string, ingredient: Ingredient): string => {
    const realQuantity = convertDisplayToReal(displayQuantity, ingredient.unit);

    if (realQuantity <= 0) return '0.00';

    // Converte a quantidade para unidade base (ex: g, ml, un)
    const normalized = normalizeQuantity(realQuantity, ingredient.unit);

    // Usa o preço médio ponderado atual
    const total = normalized * ingredient.averageUnitPrice;

    return formatCurrency(total);
  };

  // Verifica se há quantidade suficiente em estoque
  const hasEnoughStock = (ingredient: Ingredient, displayQuantity: string): boolean => {
    const realQuantity = convertDisplayToReal(displayQuantity, ingredient.unit);
    const normalizedRequired = normalizeQuantity(realQuantity, ingredient.unit);
    return ingredient.totalQuantity >= normalizedRequired;
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.name);
    // Reset quantity when selecting new ingredient
    setQuantity('0');
    setDisplayQuantity(convertRealToDisplay('0', ingredient.unit));
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient) return;

    const realQuantity = convertDisplayToReal(displayQuantity, selectedIngredient.unit);

    if (!selectedIngredient || !displayQuantity || realQuantity <= 0 || !selectedIngredient.name) {
      alert('Preencha todos os campos');
      return;
    }

    // Verifica se há estoque suficiente (apenas validação, não consome)
    if (!hasEnoughStock(selectedIngredient, displayQuantity)) {
      alert(
        `Estoque insuficiente. Disponível: ${selectedIngredient.totalQuantity} ${getBaseUnit(selectedIngredient.unit)}`
      );
      return;
    }

    const normalizedQuantity = normalizeQuantity(realQuantity, selectedIngredient.unit);

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
    setQuantity('');
    setDisplayQuantity('');
    setInputValue('');
  };

  const handleCancelSelection = () => {
    setSelectedIngredient(null);
    setQuantity('');
    setDisplayQuantity('');
    setInputValue('');
  };

  // Filtrar apenas ingredientes que têm estoque
  const ingredientsWithStock = estoque.ingredients.filter(
    ingredient => ingredient.totalQuantity > 0
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-card-foreground mb-2 block text-sm font-medium">
          Buscar ingrediente
        </label>
        <SearchableInput<Ingredient>
          items={ingredientsWithStock}
          onSelectItem={handleSelectIngredient}
          displayAttribute="name"
          placeholder="Digite o nome do ingrediente..."
          inputValue={inputValue}
          onInputChange={setInputValue}
          className="bg-surface rounded-md"
        />
      </div>

      {selectedIngredient && (
        <div className="border-border bg-card space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-card-foreground font-medium">{selectedIngredient.name}</h4>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
              {selectedIngredient.unit}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-[var(--color-info)] p-3">
              <p className="font-medium text-[var(--color-on-info)]">Preço médio</p>
              <p className="font-semibold text-[var(--color-on-info)]">
                {selectedIngredient.unit === 'un'
                  ? `R$ ${selectedIngredient.averageUnitPrice.toFixed(2)}`
                  : ` R$ ${selectedIngredient.averageUnitPrice.toFixed(3)}`}
                /{getBaseUnit(selectedIngredient.unit)}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--color-great)] p-3">
              <p className="font-medium text-[var(--color-on-great)]">Estoque disponível</p>
              <p className="font-semibold text-[var(--color-on-great)]">
                {selectedIngredient.totalQuantity} {getBaseUnit(selectedIngredient.unit)}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-card-foreground mb-1 block text-sm font-medium">
                Quantidade necessária
                {(selectedIngredient.unit === 'kg' || selectedIngredient.unit === 'l') && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    (em {selectedIngredient.unit === 'kg' ? 'gramas' : 'mililitros'})
                  </span>
                )}
              </label>
              <QuantityInput
                value={displayQuantity}
                onChange={value => {
                  setDisplayQuantity(value);
                  const realValue = convertDisplayToReal(value, selectedIngredient.unit);
                  setQuantity(realValue.toString());
                }}
                placeholder="0"
                className="w-full"
                unit={
                  selectedIngredient.unit === 'kg'
                    ? 'g'
                    : selectedIngredient.unit === 'l'
                      ? 'ml'
                      : getBaseUnit(selectedIngredient.unit)
                }
                maxValue={
                  selectedIngredient.unit === 'un'
                    ? 1000
                    : selectedIngredient.unit === 'kg' || selectedIngredient.unit === 'l'
                      ? 100000
                      : 100
                }
              />
            </div>
            <div className="flex-1">
              <label className="text-card-foreground mb-1 block text-sm font-medium">
                Custo total
              </label>
              <div className="border-border bg-muted rounded-lg border px-3 py-2 text-sm font-medium">
                {getTotalPrice(displayQuantity, selectedIngredient)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCancelSelection}
                className="rounded-lg bg-[var(--color-danger)] px-4 py-2 text-sm font-medium text-[var(--color-on-danger)] transition-colors hover:bg-[var(--color-danger)]/80"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleAddIngredient}
                className="disabled:bg-muted rounded-lg bg-[var(--color-great)] px-4 py-2 text-sm font-medium text-[var(--color-on-great)] transition-colors hover:bg-[var(--color-great)]/80 disabled:cursor-not-allowed"
                disabled={!hasEnoughStock(selectedIngredient, displayQuantity)}
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div className="bg-muted text-muted-foreground rounded p-2 text-xs">
            <p>
              <strong>Quantidade na receita:</strong>{' '}
              {(() => {
                const realQuantity = convertDisplayToReal(displayQuantity, selectedIngredient.unit);
                if (!displayQuantity || realQuantity <= 0) return '0';
                return `${realQuantity} ${selectedIngredient.unit}`;
              })()}{' '}
              <span className="text-muted-foreground/70">
                (normalizada:{' '}
                {(() => {
                  const realQuantity = convertDisplayToReal(
                    displayQuantity,
                    selectedIngredient.unit
                  );
                  if (realQuantity <= 0) return 0;
                  return normalizeQuantity(realQuantity, selectedIngredient.unit);
                })()}{' '}
                {getBaseUnit(selectedIngredient.unit)})
              </span>
            </p>
          </div>

          {/* Mostrar informações dos batches disponíveis */}
          {selectedIngredient.batches.length > 0 && (
            <details className="text-xs">
              <summary className="text-muted-foreground hover:text-card-foreground cursor-pointer font-medium">
                Ver lotes em estoque ({selectedIngredient.batches.length})
              </summary>
              <div className="bg-muted mt-2 space-y-2 rounded p-3">
                {selectedIngredient.batches.map(batch => (
                  <div
                    key={batch.id}
                    className="text-muted-foreground flex items-center justify-between"
                  >
                    <span>{new Date(batch.purchaseDate).toLocaleDateString()}</span>
                    <span className="font-medium">
                      {batch.currentQuantity} {getBaseUnit(selectedIngredient.unit)}
                    </span>
                    <span className="text-[var(--color-on-great)]">
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
