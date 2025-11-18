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
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label className="text-card-foreground mb-1.5 block text-xs font-medium sm:mb-2 sm:text-sm">
          Buscar ingrediente
        </label>
        <SearchableInput<Ingredient>
          items={ingredientsWithStock}
          onSelectItem={handleSelectIngredient}
          displayAttribute="name"
          placeholder="Digite o nome..."
          inputValue={inputValue}
          onInputChange={setInputValue}
          className="bg-surface rounded-md"
        />
      </div>

      {selectedIngredient && (
        <div className="border-border bg-card space-y-3 rounded-lg border p-3 sm:space-y-4 sm:p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-card-foreground text-sm font-medium sm:text-base">
              {selectedIngredient.name}
            </h4>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] sm:px-2 sm:py-1 sm:text-xs">
              {selectedIngredient.unit}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:gap-4 sm:text-sm">
            <div className="rounded-lg bg-[var(--color-info)] p-2 sm:p-3">
              <p className="text-[10px] font-medium text-[var(--color-on-info)] sm:text-xs">
                Preço médio
              </p>
              <p className="text-xs font-semibold text-[var(--color-on-info)] sm:text-sm">
                {selectedIngredient.unit === 'un'
                  ? `R$ ${selectedIngredient.averageUnitPrice.toFixed(2)}`
                  : ` R$ ${selectedIngredient.averageUnitPrice.toFixed(3)}`}
                /{getBaseUnit(selectedIngredient.unit)}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--color-great)] p-2 sm:p-3">
              <p className="text-[10px] font-medium text-[var(--color-on-great)] sm:text-xs">
                Estoque disponível
              </p>
              <p className="text-xs font-semibold text-[var(--color-on-great)] sm:text-sm">
                {selectedIngredient.totalQuantity} {getBaseUnit(selectedIngredient.unit)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex-1">
                <label className="text-card-foreground mb-1 block text-xs font-medium sm:text-sm">
                  Quantidade necessária
                  {(selectedIngredient.unit === 'kg' || selectedIngredient.unit === 'l') && (
                    <span className="text-muted-foreground ml-1 text-[10px] sm:text-xs">
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
                <label className="text-card-foreground mb-1 block text-xs font-medium sm:text-sm">
                  Custo total
                </label>
                <div className="border-border bg-muted rounded-lg border px-2 py-2 text-xs font-medium sm:px-3 sm:text-sm">
                  {getTotalPrice(displayQuantity, selectedIngredient)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCancelSelection}
                className="flex-1 rounded-lg bg-[var(--color-danger)] px-3 py-1.5 text-xs font-medium text-[var(--color-on-danger)] transition-colors hover:bg-[var(--color-danger)]/80 sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleAddIngredient}
                className="disabled:bg-muted flex-1 rounded-lg bg-[var(--color-great)] px-3 py-1.5 text-xs font-medium text-[var(--color-on-great)] transition-colors hover:bg-[var(--color-great)]/80 disabled:cursor-not-allowed sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
                disabled={!hasEnoughStock(selectedIngredient, displayQuantity)}
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div className="bg-muted text-muted-foreground rounded p-2 text-[10px] sm:text-xs">
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
            <details className="text-[10px] sm:text-xs">
              <summary className="text-muted-foreground hover:text-card-foreground cursor-pointer font-medium">
                Ver lotes em estoque ({selectedIngredient.batches.length})
              </summary>
              <div className="bg-muted mt-2 space-y-1.5 rounded p-2 sm:space-y-2 sm:p-3">
                {selectedIngredient.batches.map(batch => (
                  <div
                    key={batch.id}
                    className="text-muted-foreground flex flex-col gap-1 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:text-xs"
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
