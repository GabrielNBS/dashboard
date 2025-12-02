// src/utils/calculations/batchSale.ts
import { formatISO } from 'date-fns';
import { ProductState } from '@/types/products';
import { BatchSaleItem, SaleItem } from '@/types/sale';
import { Ingredient } from '@/types/ingredients';

/**
 * Calcula o custo proporcional para uma venda
 * @param product - Produto sendo vendido
 * @param soldQuantity - Quantidade vendida
 * @returns Custo proporcional baseado no unitCost do produto
 */
export function calculateProportionalIngredientCost(
  product: ProductState,
  soldQuantity: number
): number {
  // Usar o custo unitário já calculado do produto
  // Isso garante consistência com os custos definidos no produto
  return product.production.unitCost * soldQuantity;
}

/**
 * Calcula a margem de lucro real para uma venda
 * @param product - Produto sendo vendido
 * @param soldQuantity - Quantidade vendida
 * @param sellingPrice - Preço de venda por unidade
 * @returns Margem de lucro real baseada no unitCost
 */
export function calculateProportionalProfitMargin(
  product: ProductState,
  soldQuantity: number,
  sellingPrice: number
): number {
  // Usar o custo unitário já calculado do produto
  const totalCost = product.production.unitCost * soldQuantity;
  const totalRevenue = sellingPrice * soldQuantity;

  if (totalRevenue <= 0) return 0;

  // Fórmula: ((receita - custo) / receita) * 100
  return ((totalRevenue - totalCost) / totalRevenue) * 100;
}

/**
 * Converte um SaleItem regular em BatchSaleItem para produtos em lote
 * @param saleItem - Item de venda regular
 * @param soldQuantity - Quantidade específica sendo vendida do lote
 * @returns BatchSaleItem com informações proporcionais
 */
export function convertToBatchSaleItem(saleItem: SaleItem, soldQuantity?: number): BatchSaleItem {
  const { product, quantity } = saleItem;

  // Se não for produto em lote, retorna como item normal
  if (product.production.mode !== 'lote') {
    return {
      ...saleItem,
      isBatchSale: false,
    };
  }

  const actualSoldQuantity = soldQuantity || quantity;
  const yieldQuantity = product.production.yieldQuantity;
  const remainingQuantity = Math.max(0, yieldQuantity - actualSoldQuantity);
  const proportionalCost = calculateProportionalIngredientCost(product, actualSoldQuantity);

  return {
    ...saleItem,
    quantity: actualSoldQuantity,
    subtotal: product.production.unitSellingPrice * actualSoldQuantity,
    isBatchSale: true,
    batchYieldQuantity: yieldQuantity,
    batchSoldQuantity: actualSoldQuantity,
    batchRemainingQuantity: remainingQuantity,
    proportionalCost,
  };
}

/**
 * Calcula os ingredientes que devem ser descontados do estoque para uma venda parcial
 * @param product - Produto sendo vendido
 * @param soldQuantity - Quantidade vendida do lote
 * @returns Array de ingredientes com quantidades proporcionais a serem descontadas
 */
export function calculateProportionalIngredientConsumption(
  product: ProductState,
  soldQuantity: number
): Array<{ id: string; name: string; quantityToConsume: number }> {
  if (product.production.mode !== 'lote' || product.production.yieldQuantity <= 0) {
    // Para produtos individuais, consome a quantidade total dos ingredientes
    return product.ingredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      quantityToConsume: (ingredient.totalQuantity || 0) * soldQuantity,
    }));
  }

  // Para produtos em lote, calcula consumo proporcional
  const proportion = soldQuantity / product.production.yieldQuantity;

  return product.ingredients.map(ingredient => ({
    id: ingredient.id,
    name: ingredient.name,
    quantityToConsume: (ingredient.totalQuantity || 0) * proportion,
  }));
}

/**
 * Valida se é possível vender uma quantidade específica de um produto
 * @param product - Produto sendo validado
 * @param requestedQuantity - Quantidade solicitada
 * @param availableIngredients - Ingredientes disponíveis no estoque
 * @returns Objeto com validação e ingredientes em falta
 */
export function validateBatchSale(
  product: ProductState,
  requestedQuantity: number,
  availableIngredients: Ingredient[]
): { isValid: boolean; missingIngredients: string[] } {
  const missingIngredients: string[] = [];

  // Para produtos em lote, valida apenas producedQuantity
  // Ingredientes já foram descontados na produção
  if (product.production.mode === 'lote') {
    const producedQuantity = product.production.producedQuantity || 0;
    const isValid = producedQuantity >= requestedQuantity;

    if (!isValid) {
      missingIngredients.push(
        `Estoque insuficiente (disponível: ${producedQuantity}, solicitado: ${requestedQuantity})`
      );
    }

    return { isValid, missingIngredients };
  }

  // Para produtos individuais, valida ingredientes disponíveis
  const ingredientConsumption = calculateProportionalIngredientConsumption(
    product,
    requestedQuantity
  );

  const isValid = ingredientConsumption.every(consumption => {
    const availableIngredient = availableIngredients.find(ing => ing.id === consumption.id);
    const hasEnough =
      !!availableIngredient && availableIngredient.totalQuantity >= consumption.quantityToConsume;

    if (!hasEnough) {
      missingIngredients.push(consumption.name);
    }

    return hasEnough;
  });

  return { isValid, missingIngredients };
}

/**
 * Calcula o máximo de unidades que podem ser vendidas baseado no estoque e produção
 * @param product - Produto sendo analisado
 * @param availableIngredients - Ingredientes disponíveis no estoque
 * @returns Quantidade máxima que pode ser vendida
 */
export function calculateMaxSellableQuantity(
  product: ProductState,
  availableIngredients: Ingredient[]
): number {
  if (product.production.mode === 'lote') {
    // Para produtos em lote, retorna apenas a quantidade já produzida
    // Ingredientes já foram descontados na produção
    return product.production.producedQuantity || 0;
  }

  // Para produtos individuais, calcula baseado no ingrediente mais limitante
  let maxQuantity = Infinity;

  for (const ingredient of product.ingredients) {
    const availableIngredient = availableIngredients.find(ing => ing.id === ingredient.id);
    if (!availableIngredient || ingredient.totalQuantity <= 0) {
      return 0;
    }

    const possibleQuantity = Math.floor(
      availableIngredient.totalQuantity / ingredient.totalQuantity
    );
    maxQuantity = Math.min(maxQuantity, possibleQuantity);
  }

  return maxQuantity === Infinity ? 0 : maxQuantity;
}

/**
 * Calcula quantos lotes podem ser produzidos com os ingredientes disponíveis
 * @param product - Produto em lote
 * @param availableIngredients - Ingredientes disponíveis no estoque
 * @returns Quantidade de lotes que podem ser produzidos
 */
export function calculateMaxProducibleBatches(
  product: ProductState,
  availableIngredients: Ingredient[]
): number {
  if (product.production.mode !== 'lote') {
    return 0;
  }

  let maxBatches = Infinity;

  for (const ingredient of product.ingredients) {
    const availableIngredient = availableIngredients.find(ing => ing.id === ingredient.id);
    if (!availableIngredient || ingredient.totalQuantity <= 0) {
      return 0;
    }

    const possibleBatches = Math.floor(
      availableIngredient.totalQuantity / ingredient.totalQuantity
    );
    maxBatches = Math.min(maxBatches, possibleBatches);
  }

  return maxBatches === Infinity ? 0 : maxBatches;
}

/**
 * Valida se é possível produzir uma quantidade específica de lotes
 * @param product - Produto em lote
 * @param batchCount - Número de lotes a produzir
 * @param availableIngredients - Ingredientes disponíveis no estoque
 * @returns Objeto com validação e ingredientes em falta
 */
export function validateBatchProduction(
  product: ProductState,
  batchCount: number,
  availableIngredients: Ingredient[]
): { isValid: boolean; missingIngredients: string[] } {
  if (product.production.mode !== 'lote') {
    return { isValid: false, missingIngredients: ['Produto não é produzido em lote'] };
  }

  const missingIngredients: string[] = [];

  const isValid = product.ingredients.every(ingredient => {
    const required = ingredient.totalQuantity * batchCount;
    const available = availableIngredients.find(i => i.id === ingredient.id);
    const hasEnough = available && available.totalQuantity >= required;

    if (!hasEnough) {
      const availableQty = available?.totalQuantity || 0;
      missingIngredients.push(
        `${ingredient.name} (necessário: ${required}, disponível: ${availableQty})`
      );
    }

    return hasEnough;
  });

  return { isValid, missingIngredients };
}

/**
 * Produz um lote, descontando ingredientes do estoque
 * @param product - Produto em lote a ser produzido
 * @param availableIngredients - Ingredientes disponíveis no estoque
 * @param batchesToProduce - Número de lotes a produzir (padrão: 1)
 * @returns Objeto com sucesso e ingredientes consumidos
 */
export function produceBatch(
  product: ProductState,
  availableIngredients: Ingredient[],
  batchesToProduce: number = 1
): {
  success: boolean;
  consumedIngredients: Array<{ id: string; name: string; quantityConsumed: number }>;
  producedQuantity: number;
} {
  if (product.production.mode !== 'lote') {
    return { success: false, consumedIngredients: [], producedQuantity: 0 };
  }

  const maxBatches = calculateMaxProducibleBatches(product, availableIngredients);
  if (batchesToProduce > maxBatches) {
    return { success: false, consumedIngredients: [], producedQuantity: 0 };
  }

  const consumedIngredients = product.ingredients.map(ingredient => ({
    id: ingredient.id,
    name: ingredient.name,
    quantityConsumed: ingredient.totalQuantity * batchesToProduce,
  }));

  const producedQuantity = product.production.yieldQuantity * batchesToProduce;

  return {
    success: true,
    consumedIngredients,
    producedQuantity,
  };
}

/**
 * Atualiza a quantidade produzida de um produto em lote
 * @param product - Produto a ser atualizado
 * @param additionalQuantity - Quantidade adicional produzida
 * @returns Produto atualizado
 */
export function updateProducedQuantity(
  product: ProductState,
  additionalQuantity: number
): ProductState {
  if (product.production.mode !== 'lote') {
    return product;
  }

  return {
    ...product,
    production: {
      ...product.production,
      producedQuantity: (product.production.producedQuantity || 0) + additionalQuantity,
      lastProductionDate: formatISO(new Date()),
    },
  };
}

/**
 * Reduz a quantidade produzida após uma venda
 * @param product - Produto vendido
 * @param soldQuantity - Quantidade vendida
 * @returns Produto atualizado
 */
export function reduceProducedQuantity(product: ProductState, soldQuantity: number): ProductState {
  if (product.production.mode !== 'lote') {
    return product;
  }

  const currentProduced = product.production.producedQuantity || 0;
  const newProduced = Math.max(0, currentProduced - soldQuantity);

  return {
    ...product,
    production: {
      ...product.production,
      producedQuantity: newProduced,
    },
  };
}
