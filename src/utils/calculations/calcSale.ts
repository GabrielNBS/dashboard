// src/utils/calcSale.ts
import { normalizeQuantity } from '../helpers/normalizeQuantity';
import { UnitType } from '@/types/ingredients';
import { ProductionModel } from '@/types/products';
import { SaleItem, SellingResume, PaymentMethod, PaymentDiscount, PaymentFees } from '@/types/sale';
import { DEFAULT_PAYMENT_FEES } from '@/types/sale';

/** Mapeia método de pagamento para chave de configuração de fees */
function getFeesKey(paymentMethod: PaymentMethod): keyof PaymentFees {
  const methodMap: Record<PaymentMethod, keyof PaymentFees> = {
    dinheiro: 'cash',
    débito: 'debit',
    crédito: 'credit',
    Ifood: 'ifood',
  };
  return methodMap[paymentMethod];
}

/** Calcula o total proporcional do ingrediente */
export function calculateIngredientTotalByUnitPrice(
  quantityUsed: number,
  unit: UnitType,
  unitPrice: number
) {
  const normalizedQty = normalizeQuantity(quantityUsed, unit);
  return normalizedQty * unitPrice;
}

/**
 * Calcula preço sugerido de venda baseado no custo total atual e margem
 * @param totalCost - Custo total calculado dos ingredientes
 * @param margin - Margem de lucro desejada (%)
 * @param mode - Modo de produção ('individual' ou 'lote')
 * @param yieldQuantity - Quantidade produzida no lote (apenas para modo 'lote')
 */
export function calculateSuggestedPrice(
  totalCost: number,
  margin: number,
  mode: 'individual' | 'lote',
  yieldQuantity: number = 1
): number {
  if (totalCost <= 0) return 0;

  // Calcula o preço com margem aplicada
  const priceWithMargin = totalCost * (1 + margin / 100);

  // Se for modo lote, divide pelo rendimento para obter preço unitário
  if (mode === 'lote' && yieldQuantity > 0) {
    return priceWithMargin / yieldQuantity;
  }

  return priceWithMargin;
}

/**
 * Calcula margem real de lucro baseado no preço de venda informado
 * @param totalCost - Custo total dos ingredientes
 * @param sellingPrice - Preço de venda por unidade informado
 * @param mode - Modo de produção ('individual' ou 'lote')
 * @param yieldQuantity - Quantidade produzida no lote (apenas para modo 'lote')
 */
export function calculateRealProfitMargin(
  totalCost: number,
  sellingPrice: number,
  mode: 'individual' | 'lote',
  yieldQuantity: number = 1
): number {
  if (sellingPrice <= 0 || totalCost <= 0) return 0;

  let unitCost: number;
  let unitSellingPrice: number;

  if (mode === 'lote' && yieldQuantity > 0) {
    // Para modo lote, calcula custo e preço unitários
    unitCost = totalCost / yieldQuantity;
    unitSellingPrice = sellingPrice; // sellingPrice já é por unidade no form
  } else {
    // Para modo individual
    unitCost = totalCost;
    unitSellingPrice = sellingPrice;
  }

  // Fórmula da margem: ((preço - custo) / preço) * 100
  return ((unitSellingPrice - unitCost) / unitSellingPrice) * 100;
}

/**
 * Calcula o custo unitário baseado no modo de produção
 * @param totalCost - Custo total dos ingredientes
 * @param mode - Modo de produção
 * @param yieldQuantity - Quantidade produzida (para modo lote)
 */
export function calculateUnitCost(
  totalCost: number,
  mode: 'individual' | 'lote',
  yieldQuantity: number = 1
): number {
  if (mode === 'lote' && yieldQuantity > 0) {
    return totalCost / yieldQuantity;
  }
  return totalCost;
}

// === FUNÇÕES LEGADAS (mantidas para compatibilidade) ===

/**
 * @deprecated Use calculateSuggestedPrice instead
 * Calcula preço sugerido de venda baseado no modelo de produção
 */
export function calculateSuggestedPriceFromProduction(production: ProductionModel): number {
  const { totalCost, mode, yieldQuantity, unitMargin } = production;
  return calculateSuggestedPrice(totalCost, unitMargin, mode, yieldQuantity);
}

/**
 * @deprecated Use calculateRealProfitMargin instead
 * Calcula margem real de lucro baseado no preço informado
 */
export function calculateRealProfitMarginFromProduction(
  production: ProductionModel,
  manualSellingPrice: number
): number {
  const { mode, yieldQuantity, totalCost } = production;
  return calculateRealProfitMargin(totalCost, manualSellingPrice, mode, yieldQuantity);
}

/** Calcula resumo de venda com desconto e taxas */
export function calculateSellingResume(
  items: SaleItem[],
  paymentMethod: PaymentMethod,
  discount?: PaymentDiscount,
  feesConfig: PaymentFees = DEFAULT_PAYMENT_FEES
): SellingResume {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const discountValue = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;

  const feePercentage = paymentMethod === 'dinheiro' ? 0 : feesConfig[getFeesKey(paymentMethod)];
  const fees = ((subtotal - discountValue) * feePercentage) / 100;
  const totalValue = subtotal - discountValue - fees;

  return { paymentMethod, discount, fees, subtotal, totalValue };
}

/** Verifica status de estoque */
export function getStockStatus(quantity: number, maxQuantity: number) {
  if (!maxQuantity || maxQuantity <= 0) return 'normal';
  const percentage = (quantity / maxQuantity) * 100;
  if (percentage < 15) return 'critico';
  if (percentage < 30) return 'atencao';
  return 'normal';
}
