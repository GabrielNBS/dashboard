'use client';

import { useState } from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { Ingredient, UnitType } from '@/types/ingredients';
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
  const [useWeightMode, setUseWeightMode] = useState(false);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setInputValue(ingredient.name);
    setQuantity('0');
    setDisplayQuantity('0');
    setUseWeightMode(false);
  };
  const getDynamicUnit = (value: string, baseUnit: UnitType): UnitType => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return baseUnit;

    // Para kg, converter para g quando valor < 1
    if (baseUnit === 'kg') {
      return numValue < 1 ? 'g' : 'kg';
    }
    // Para l, converter para ml quando valor < 1
    if (baseUnit === 'l') {
      return numValue < 1 ? 'ml' : 'l';
    }
    // Para g, ml - retornar diretamente (não usar getBaseUnit que retorna 'un')
    if (baseUnit === 'g' || baseUnit === 'ml') {
      return baseUnit;
    }
    // Para un - retornar diretamente
    return 'un';
  };

  // Função para calcular o custo usando preço médio ponderado
  const getTotalPrice = (quantity: string, ingredient: Ingredient): string => {
    // Converter vírgula para ponto (formato brasileiro -> parseFloat)
    const normalizedInput = quantity.replace(',', '.');
    const realQuantity = parseFloat(normalizedInput);
    if (isNaN(realQuantity) || realQuantity <= 0) return '0.00';

    if (useWeightMode && ingredient.weightPerUnit && ingredient.weightUnit) {
      // Conversão: Quantidade (g/ml) -> Unidades
      const normalizedQuantity = normalizeQuantity(realQuantity, ingredient.weightUnit);
      const normalizedWeightPerUnit = normalizeQuantity(
        ingredient.weightPerUnit,
        ingredient.weightUnit
      );
      const unitsNeeded = normalizedQuantity / normalizedWeightPerUnit;
      return formatCurrency(unitsNeeded * ingredient.averageUnitPrice);
    }

    // Converte a quantidade para unidade base (ex: g, ml, un)
    const normalized = normalizeQuantity(realQuantity, ingredient.unit);
    // Usa o preço médio ponderado atual
    const total = normalized * ingredient.averageUnitPrice;
    return formatCurrency(total);
  };

  // Verifica se há quantidade suficiente em estoque
  const hasEnoughStock = (ingredient: Ingredient, quantity: string): boolean => {
    const normalizedInput = quantity.replace(',', '.');
    const realQuantity = parseFloat(normalizedInput);
    if (isNaN(realQuantity) || realQuantity <= 0) return false;

    if (useWeightMode && ingredient.weightPerUnit && ingredient.weightUnit) {
      const normalizedQuantity = normalizeQuantity(realQuantity, ingredient.weightUnit);
      const normalizedWeightPerUnit = normalizeQuantity(
        ingredient.weightPerUnit,
        ingredient.weightUnit
      );
      const unitsNeeded = normalizedQuantity / normalizedWeightPerUnit;
      return ingredient.totalQuantity >= unitsNeeded;
    }

    const normalizedRequired = normalizeQuantity(realQuantity, ingredient.unit);
    return ingredient.totalQuantity >= normalizedRequired;
  };

  // Handler antigo removido daqui pois foi movido para cima no primeiro chunk
  // Mantemos o getDynamicUnit se for necessário, mas ele estava no chunk anterior não editado

  const handleAddIngredient = () => {
    if (!selectedIngredient) return;

    const normalizedInput = displayQuantity.replace(',', '.');
    const realQuantity = parseFloat(normalizedInput);

    if (
      !selectedIngredient ||
      !displayQuantity ||
      isNaN(realQuantity) ||
      realQuantity <= 0 ||
      !selectedIngredient.name
    ) {
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

    const alreadyAdded = finalProduct.ingredients.some(
      ingredient => ingredient.id === selectedIngredient.id
    );

    if (alreadyAdded) {
      alert('Este ingrediente já foi adicionado.');
      return;
    }

    let ingredientSnapshot: Ingredient;

    if (useWeightMode && selectedIngredient.weightPerUnit && selectedIngredient.weightUnit) {
      // Cria snapshot convertido para a unidade de peso (ex: g)
      // Ajusta o preço médio para ser "por g"
      const normalizedQuantity = normalizeQuantity(realQuantity, selectedIngredient.weightUnit);
      // Preço total calculado
      const normalizedWeightPerUnit = normalizeQuantity(
        selectedIngredient.weightPerUnit,
        selectedIngredient.weightUnit
      );
      const unitsUsed = normalizedQuantity / normalizedWeightPerUnit;
      const totalCost = unitsUsed * selectedIngredient.averageUnitPrice;

      const pricePerWeightUnit = totalCost / normalizedQuantity;

      ingredientSnapshot = {
        ...selectedIngredient,
        unit: selectedIngredient.weightUnit, // Muda a unidade para g/ml
        totalQuantity: normalizedQuantity,
        averageUnitPrice: pricePerWeightUnit,
        batches: [
          {
            id: `recipe_batch_${Date.now()}`,
            purchaseDate: new Date(),
            buyPrice: totalCost,
            originalQuantity: normalizedQuantity,
            currentQuantity: normalizedQuantity,
            unitPrice: pricePerWeightUnit,
          },
        ],
      };
    } else {
      const normalizedQuantity = normalizeQuantity(realQuantity, selectedIngredient.unit);
      ingredientSnapshot = {
        ...selectedIngredient,
        totalQuantity: normalizedQuantity,
        averageUnitPrice: selectedIngredient.averageUnitPrice,
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
    }

    dispatch({
      type: 'ADD_INGREDIENT',
      payload: ingredientSnapshot,
    });

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
            <div className="flex items-center gap-2">
              {selectedIngredient.unit === 'un' && selectedIngredient.weightPerUnit && (
                <Button
                  type="button"
                  onClick={() => {
                    setUseWeightMode(!useWeightMode);
                    setDisplayQuantity('0');
                  }}
                  variant="outline"
                  className="h-6 px-2 text-[10px] sm:h-7 sm:text-xs"
                >
                  {useWeightMode ? 'Usar Unidades' : `Usar ${selectedIngredient.weightUnit}`}
                </Button>
              )}
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] sm:px-2 sm:py-1 sm:text-xs">
                {selectedIngredient.unit}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:gap-4 sm:text-sm">
            <div className="bg-info rounded-lg p-2 sm:p-3">
              <p className="text-on-info text-[10px] font-medium sm:text-xs">
                {useWeightMode && selectedIngredient.weightPerUnit
                  ? 'Preço por unidade'
                  : 'Preço médio'}
              </p>
              <p className="text-on-info text-xs font-semibold sm:text-sm">
                {useWeightMode && selectedIngredient.weightPerUnit
                  ? // No modo peso, mostrar preço por unidade inteira
                    `R$ ${selectedIngredient.averageUnitPrice.toFixed(2)}/un`
                  : selectedIngredient.unit === 'un'
                    ? `R$ ${selectedIngredient.averageUnitPrice.toFixed(2)}/${getBaseUnit(selectedIngredient.unit)}`
                    : `R$ ${selectedIngredient.averageUnitPrice.toFixed(3)}/${getBaseUnit(selectedIngredient.unit)}`}
              </p>
              {useWeightMode &&
                selectedIngredient.weightPerUnit &&
                selectedIngredient.weightUnit && (
                  <p className="text-on-info/70 mt-0.5 text-[9px] sm:text-[10px]">
                    (1 un = {selectedIngredient.weightPerUnit}
                    {selectedIngredient.weightUnit})
                  </p>
                )}
            </div>
            <div className="bg-great rounded-lg p-2 sm:p-3">
              <p className="text-on-great text-[10px] font-medium sm:text-xs">Estoque disponível</p>
              <p className="text-on-great text-xs font-semibold sm:text-sm">
                {selectedIngredient.totalQuantity} {getBaseUnit(selectedIngredient.unit)}
              </p>
              {useWeightMode &&
                selectedIngredient.weightPerUnit &&
                selectedIngredient.weightUnit && (
                  <p className="text-on-great/70 mt-0.5 text-[9px] sm:text-[10px]">
                    (≈{' '}
                    {(selectedIngredient.totalQuantity * selectedIngredient.weightPerUnit).toFixed(
                      0
                    )}
                    {selectedIngredient.weightUnit} total)
                  </p>
                )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex-1">
                <label className="text-card-foreground mb-1 block text-xs font-medium sm:text-sm">
                  Quantidade necessária
                  {useWeightMode && selectedIngredient.weightUnit ? (
                    <span className="text-muted-foreground ml-1 text-[10px] sm:text-xs">
                      (em{' '}
                      {selectedIngredient.weightUnit === 'g' ||
                      selectedIngredient.weightUnit === 'kg'
                        ? 'gramas'
                        : 'mililitros'}
                      )
                    </span>
                  ) : (
                    (selectedIngredient.unit === 'kg' || selectedIngredient.unit === 'l') && (
                      <span className="text-muted-foreground ml-1 text-[10px] sm:text-xs">
                        (em {selectedIngredient.unit === 'kg' ? 'gramas' : 'mililitros'})
                      </span>
                    )
                  )}
                </label>
                <div className="flex gap-2">
                  <QuantityInput
                    value={displayQuantity}
                    onChange={value => {
                      setDisplayQuantity(value);
                      setQuantity(value);
                    }}
                    placeholder="0"
                    className="w-full"
                    unit={
                      useWeightMode && selectedIngredient.weightUnit
                        ? getDynamicUnit(displayQuantity, selectedIngredient.weightUnit)
                        : getDynamicUnit(displayQuantity, selectedIngredient.unit)
                    }
                    maxValue={
                      useWeightMode ? 100000 : selectedIngredient.unit === 'un' ? 1000 : 100
                    }
                  />
                  {/* Botão para usar unidade inteira - aparece apenas no modo peso */}
                  {useWeightMode && selectedIngredient.weightPerUnit && (
                    <Button
                      type="button"
                      onClick={() => {
                        setDisplayQuantity(selectedIngredient.weightPerUnit!.toString());
                        setQuantity(selectedIngredient.weightPerUnit!.toString());
                      }}
                      variant="outline"
                      className="h-9 shrink-0 px-2 text-[10px] sm:h-10 sm:px-3 sm:text-xs"
                      title={`Usar 1 unidade inteira (${selectedIngredient.weightPerUnit}${selectedIngredient.weightUnit})`}
                    >
                      1 un
                    </Button>
                  )}
                </div>
                {/* Feedback visual quando está usando unidade inteira */}
                {useWeightMode && selectedIngredient.weightPerUnit && (
                  <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs">
                    {(() => {
                      const qty = parseFloat(displayQuantity);
                      if (isNaN(qty) || qty <= 0) return null;
                      const unitsUsed = qty / selectedIngredient.weightPerUnit!;
                      const isWholeUnit = Math.abs(unitsUsed - Math.round(unitsUsed)) < 0.001;
                      if (isWholeUnit && unitsUsed >= 1) {
                        return (
                          <span className="text-primary font-medium">
                            ≈ {Math.round(unitsUsed)} unidade{Math.round(unitsUsed) > 1 ? 's' : ''}{' '}
                            inteira{Math.round(unitsUsed) > 1 ? 's' : ''}
                          </span>
                        );
                      }
                      return (
                        <span>
                          ≈ {unitsUsed.toFixed(2)} unidades ({(unitsUsed * 100).toFixed(0)}% de 1
                          un)
                        </span>
                      );
                    })()}
                  </p>
                )}
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
                className="bg-secondary text-on-secondary hover:bg-secondary/80 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleAddIngredient}
                className="disabled:bg-muted bg-great text-on-great hover:bg-great/80 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
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
                const realQuantity = parseFloat(displayQuantity);
                if (!displayQuantity || realQuantity <= 0) return '0';
                // Usar weightUnit quando no modo peso, senão unit
                const displayUnit =
                  useWeightMode && selectedIngredient.weightUnit
                    ? selectedIngredient.weightUnit
                    : selectedIngredient.unit;
                return `${realQuantity} ${displayUnit}`;
              })()}{' '}
              {useWeightMode && selectedIngredient.weightPerUnit && (
                <span className="text-primary font-medium">
                  (≈ {(parseFloat(displayQuantity) / selectedIngredient.weightPerUnit).toFixed(2)}{' '}
                  unidades)
                </span>
              )}
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
                    <span className="text-on-great">
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
