import { Sale } from '@/types/sale';
import { FixedCostSettings, VariableCostSettings } from '@/types/settings';
import { addDays } from '../helpers/dateTime';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

export interface StockValidation {
  isValid: boolean;
  missingIngredients?: string[];
}

export interface PriceCalculation {
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
}

export interface ProductProfitability {
  unitCost: number;
  unitProfit: number;
  marginPercentage: number;
  contributionMargin: number;
}

export interface FinancialHealthIndicators {
  status: 'critical' | 'warning' | 'healthy';
  alerts: string[];
  recommendations: string[];
}

export interface BreakEvenProjection {
  daysToBreakEven: number;
  estimatedDate: Date;
  dailyRevenueNeeded: number;
}

export interface PriceChangeSimulation {
  newRevenue: number;
  newProfit: number;
  profitChange: number;
  newBreakEvenUnits: number;
  revenueChange: number;
}

// ============================================================================
// CÁLCULOS DE RECEITA E VENDAS
// ============================================================================

/**
 * Calcula a receita total das vendas (sem descontos).
 * @param sales - Array de vendas realizadas
 * @returns Receita total em reais
 */
export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((total, sale) => {
    const revenue = sale.sellingResume.totalValue;
    return total + (isNaN(revenue) ? 0 : revenue);
  }, 0);
}

/**
 * Calcula a quantidade total de unidades vendidas.
 * @param sales - Lista de vendas realizadas
 * @returns Quantidade total de unidades vendidas
 */
export function getTotalUnitsSold(sales: Sale[]): number {
  return sales.reduce((total, sale) => {
    const saleTotalQuantity = sale.items.reduce((itemTotal, item) => {
      return itemTotal + item.quantity;
    }, 0);
    return total + saleTotalQuantity;
  }, 0);
}

/**
 * Calcula a receita média por unidade vendida.
 * @param totalRevenue - Receita total
 * @param totalUnitsSold - Total de unidades vendidas
 * @returns Preço médio de venda por unidade
 */
export function getAverageSellingPrice(totalRevenue: number, totalUnitsSold: number): number {
  if (totalUnitsSold === 0) return 0;
  return Number((totalRevenue / totalUnitsSold).toFixed(2));
}

// ============================================================================
// CÁLCULOS DE CUSTOS VARIÁVEIS
// ============================================================================

/**
 * Calcula o custo variável total com base nas configurações fornecidas.
 * Considera dois tipos de custos variáveis:
 * - Percentual sobre a receita total (ex: comissões de 12%)
 * - Valor fixo por unidade vendida (ex: embalagem de R$ 0,50)
 */
export function getTotalVariableCost(
  variableCosts: VariableCostSettings[],
  totalRevenue: number,
  totalUnitsSold: number
): number {
  return variableCosts.reduce((total, cost) => {
    let costValue = 0;

    if (typeof cost.percentage === 'number') {
      const percentValue = (cost.percentage / 100) * totalRevenue;
      costValue += isNaN(percentValue) ? 0 : percentValue;
    }

    if (typeof cost.fixedValue === 'number') {
      const fixedTotal = cost.fixedValue * totalUnitsSold;
      costValue += isNaN(fixedTotal) ? 0 : fixedTotal;
    }

    return total + costValue;
  }, 0);
}

/**
 * Calcula o custo real dos produtos vendidos baseado no unitCost.
 *
 * IMPORTANTE: Para produtos em lote, os ingredientes já foram descontados
 * na PRODUÇÃO, não na venda. Por isso, usamos sempre o unitCost que já
 * considera todos os custos calculados corretamente.
 *
 * @param sales - Array de vendas realizadas
 * @returns Custo total dos produtos vendidos
 */
export function getRealIngredientsCost(sales: Sale[]): number {
  return sales.reduce((totalCost, sale) => {
    const saleCost = sale.items.reduce((itemsCost, item) => {
      // Sempre usar unitCost do produto que já considera:
      // - Custo total dos ingredientes
      // - Rendimento (para lotes)
      // - Outros custos incluídos no produto
      const unitCost = item.product.production.unitCost || 0;
      const totalItemCost = unitCost * item.quantity;

      return itemsCost + totalItemCost;
    }, 0);

    return totalCost + saleCost;
  }, 0);
}

/**
 * Calcula o custo variável total integrado, incluindo custos reais de ingredientes
 * e outros custos variáveis configurados.
 */
export function getIntegratedVariableCost(
  variableCosts: VariableCostSettings[],
  sales: Sale[],
  totalRevenue: number,
  totalUnitsSold: number
): number {
  const nonIngredientCosts = variableCosts.filter(cost => cost.type !== 'ingredientes');
  const configuredCosts = getTotalVariableCost(nonIngredientCosts, totalRevenue, totalUnitsSold);
  const realIngredientsCost = getRealIngredientsCost(sales);
  return configuredCosts + realIngredientsCost;
}

/**
 * Calcula o custo variável médio por unidade.
 * @param totalVariableCost - Custo variável total
 * @param totalUnitsSold - Total de unidades vendidas
 * @returns Custo variável médio por unidade
 */
export function getAverageVariableCostPerUnit(
  totalVariableCost: number,
  totalUnitsSold: number
): number {
  if (totalUnitsSold === 0) return 0;
  return Number((totalVariableCost / totalUnitsSold).toFixed(2));
}

// ============================================================================
// CÁLCULOS DE CUSTOS FIXOS
// ============================================================================

/**
 * Calcula o total de custos fixos mensais.
 * Converte automaticamente diferentes recorrências para o valor mensal equivalente.
 */
export function getTotalFixedCost(fixedCosts: FixedCostSettings[]): number {
  return fixedCosts.reduce((total, cost) => {
    let monthlyAmount = 0;

    switch (cost.recurrence) {
      case 'mensal':
        monthlyAmount = cost.amount;
        break;
      case 'anual':
        monthlyAmount = cost.amount / 12;
        break;
      case 'semanal':
        monthlyAmount = cost.amount * 4.33;
        break;
      case 'diario':
        monthlyAmount = cost.amount * 30;
        break;
      default:
        console.warn(`Recorrência desconhecida: ${cost.recurrence}`);
        monthlyAmount = 0;
    }

    return total + (isNaN(monthlyAmount) ? 0 : monthlyAmount);
  }, 0);
}

// ============================================================================
// CÁLCULOS DE LUCRO E MARGEM
// ============================================================================

/**
 * Calcula o lucro bruto (receita - custo variável).
 */
export function getGrossProfit(totalRevenue: number, totalVariableCost: number): number {
  return totalRevenue - totalVariableCost;
}

/**
 * Calcula o lucro líquido (receita - custo variável - custos fixos).
 */
export function getNetProfit(
  totalRevenue: number,
  totalVariableCost: number,
  totalFixedCost: number
): number {
  return totalRevenue - totalVariableCost - totalFixedCost;
}

/**
 * Calcula a margem de lucro líquida em percentual.
 */
export function getProfitMargin(netProfit: number, totalRevenue: number): number {
  if (totalRevenue <= 0) return 0;

  const margin = (netProfit / totalRevenue) * 100;

  if (isNaN(margin) || !isFinite(margin)) {
    console.warn('Margem de lucro inválida (NaN ou Infinito):', margin);
    return 0;
  }

  if (margin < -1000 || margin > 10000) {
    console.warn('Margem de lucro fora dos limites esperados:', margin);
    return margin < -1000 ? -1000 : 10000;
  }

  return Number(margin.toFixed(2));
}

/**
 * Calcula a margem de contribuição em percentual.
 * @param grossProfit - Lucro bruto
 * @param totalRevenue - Receita total
 * @returns Margem de contribuição em percentual
 */
export function getContributionMarginPercentage(grossProfit: number, totalRevenue: number): number {
  if (totalRevenue <= 0) return 0;
  return Number(((grossProfit / totalRevenue) * 100).toFixed(2));
}

// ============================================================================
// PONTO DE EQUILÍBRIO (BREAK-EVEN)
// ============================================================================

/**
 * Calcula o ponto de equilíbrio em RECEITA (reais).
 * Representa o valor de receita necessário para cobrir todos os custos fixos.
 */
export function getBreakEven(
  fixedCosts: number,
  variableCosts: number,
  totalRevenue: number
): number {
  if (fixedCosts < 0 || variableCosts < 0 || totalRevenue < 0) {
    console.warn('Valores negativos não são válidos para cálculo do ponto de equilíbrio.');
    return 0;
  }

  if (fixedCosts === 0) return 0;
  if (totalRevenue === 0) return fixedCosts;

  if (variableCosts >= totalRevenue) {
    console.warn('Custos variáveis excedem a receita. Negócio não é viável.');
    return Infinity;
  }

  const contributionMargin = 1 - variableCosts / totalRevenue;
  const breakEvenPoint = fixedCosts / contributionMargin;

  return Math.round(breakEvenPoint * 100) / 100;
}

/**
 * Calcula o ponto de equilíbrio em UNIDADES.
 * Indica quantas unidades precisam ser vendidas para cobrir os custos fixos.
 */
export function getBreakEvenUnits(
  fixedCosts: number,
  averageSellingPrice: number,
  averageVariableCostPerUnit: number
): number {
  if (fixedCosts < 0 || averageSellingPrice <= 0 || averageVariableCostPerUnit < 0) {
    console.warn('Valores inválidos para cálculo de ponto de equilíbrio em unidades.');
    return 0;
  }

  if (averageSellingPrice <= averageVariableCostPerUnit) {
    console.warn('Preço de venda não cobre o custo variável. Negócio não é viável.');
    return Infinity;
  }

  const contributionMarginPerUnit = averageSellingPrice - averageVariableCostPerUnit;
  return Math.ceil(fixedCosts / contributionMarginPerUnit);
}

/**
 * Projeta quando o ponto de equilíbrio será atingido baseado na receita média diária.
 */
export function projectBreakEvenDate(
  currentRevenue: number,
  breakEvenRevenue: number,
  averageDailyRevenue: number
): BreakEvenProjection | null {
  if (currentRevenue >= breakEvenRevenue) {
    return null; // Já atingiu o ponto de equilíbrio
  }

  if (averageDailyRevenue <= 0) {
    console.warn('Receita diária média deve ser maior que zero.');
    return null;
  }

  const remainingRevenue = breakEvenRevenue - currentRevenue;
  const daysToBreakEven = Math.ceil(remainingRevenue / averageDailyRevenue);

  const estimatedDate = addDays(new Date(), daysToBreakEven);

  return {
    daysToBreakEven,
    estimatedDate,
    dailyRevenueNeeded: averageDailyRevenue,
  };
}

// ============================================================================
// ANÁLISE DE RENTABILIDADE POR PRODUTO
// ============================================================================

/**
 * Calcula a rentabilidade individual de um produto.
 */
export function getProductProfitability(
  product: { ingredients: Array<{ averageUnitPrice?: number; totalQuantity?: number }> },
  sellingPrice: number,
  variableCostPercentage: number = 0
): ProductProfitability {
  const ingredientsCost = product.ingredients.reduce(
    (total: number, ing: { averageUnitPrice?: number; totalQuantity?: number }) =>
      total + (ing.averageUnitPrice || 0) * (ing.totalQuantity || 0),
    0
  );

  const variableCostByPercentage = sellingPrice * (variableCostPercentage / 100);
  const totalUnitCost = ingredientsCost + variableCostByPercentage;
  const unitProfit = sellingPrice - totalUnitCost;
  const contributionMargin = unitProfit;
  const marginPercentage = sellingPrice > 0 ? (unitProfit / sellingPrice) * 100 : 0;

  return {
    unitCost: Number(totalUnitCost.toFixed(2)),
    unitProfit: Number(unitProfit.toFixed(2)),
    marginPercentage: Number(marginPercentage.toFixed(2)),
    contributionMargin: Number(contributionMargin.toFixed(2)),
  };
}

/**
 * Compara rentabilidade de múltiplos produtos e retorna ranking.
 */
export function rankProductsByProfitability(
  products: Array<{
    product: {
      name?: string;
      ingredients: Array<{ averageUnitPrice?: number; totalQuantity?: number }>;
    };
    sellingPrice: number;
  }>,
  variableCostPercentage: number = 0
): Array<{ name: string; profitability: ProductProfitability }> {
  const rankings = products.map(({ product, sellingPrice }) => ({
    name: product.name || 'Produto sem nome',
    profitability: getProductProfitability(product, sellingPrice, variableCostPercentage),
  }));

  return rankings.sort(
    (a, b) => b.profitability.contributionMargin - a.profitability.contributionMargin
  );
}

// ============================================================================
// INDICADORES DE SAÚDE FINANCEIRA
// ============================================================================

/**
 * Analisa a saúde financeira do negócio e gera alertas e recomendações.
 */
export function getFinancialHealthIndicators(
  netProfit: number,
  totalRevenue: number,
  fixedCosts: number,
  currentBreakEven: number,
  grossProfit: number
): FinancialHealthIndicators {
  const alerts: string[] = [];
  const recommendations: string[] = [];
  let status: 'critical' | 'warning' | 'healthy' = 'healthy';

  // 1. Análise de Prejuízo
  if (netProfit < 0) {
    status = 'critical';
    alerts.push(`PREJUÍZO: Negócio operando com prejuízo de R$ ${Math.abs(netProfit).toFixed(2)}`);
    recommendations.push('Revise urgentemente seus custos fixos e variáveis');
    recommendations.push('Considere aumentar preços ou reduzir despesas operacionais');
  }

  // 2. Análise do Ponto de Equilíbrio
  if (totalRevenue < currentBreakEven && isFinite(currentBreakEven)) {
    status = status === 'critical' ? 'critical' : 'warning';
    const deficit = currentBreakEven - totalRevenue;
    const percentageToBreakEven = totalRevenue > 0 ? (totalRevenue / currentBreakEven) * 100 : 0;
    alerts.push(
      `Abaixo do ponto de equilíbrio: faltam R$ ${deficit.toFixed(2)} (${(100 - percentageToBreakEven).toFixed(1)}%)`
    );
    recommendations.push(
      `Você precisa aumentar as vendas em ${(100 - percentageToBreakEven).toFixed(1)}% para empatar`
    );
  }

  // 3. Análise de Margem de Lucro Líquida
  if (totalRevenue > 0) {
    const netMargin = (netProfit / totalRevenue) * 100;
    if (netMargin > 0 && netMargin < 10) {
      status = status === 'critical' ? 'critical' : 'warning';
      alerts.push(` Margem de lucro baixa: ${netMargin.toFixed(2)}% (recomendado: acima de 10%)`);
      recommendations.push('Considere revisar sua precificação');
      recommendations.push('Analise quais produtos têm melhor margem de contribuição');
    } else if (netMargin >= 10 && netMargin < 20) {
      alerts.push(` Margem de lucro moderada: ${netMargin.toFixed(2)}%`);
    } else if (netMargin >= 20) {
      alerts.push(` Margem de lucro saudável: ${netMargin.toFixed(2)}%`);
    }
  }

  // 4. Análise de Margem de Contribuição
  if (totalRevenue > 0) {
    const contributionMargin = (grossProfit / totalRevenue) * 100;
    if (contributionMargin < 30) {
      status = status === 'critical' ? 'critical' : 'warning';
      alerts.push(` Margem de contribuição baixa: ${contributionMargin.toFixed(2)}%`);
      recommendations.push('Custos variáveis estão muito altos em relação à receita');
      recommendations.push('Negocie melhores preços com fornecedores ou reduza comissões');
    }
  }

  // 5. Análise de Custos Fixos
  if (totalRevenue > 0) {
    const fixedCostPercentage = (fixedCosts / totalRevenue) * 100;
    if (fixedCostPercentage > 40) {
      status = status === 'critical' ? 'critical' : 'warning';
      alerts.push(` Custos fixos representam ${fixedCostPercentage.toFixed(1)}% da receita`);
      recommendations.push(
        'Custos fixos muito altos. Considere renegociar aluguel, salários ou outros custos recorrentes'
      );
    }
  }

  // 6. Sinais Positivos
  if (status === 'healthy') {
    alerts.push(' Negócio operando de forma saudável');
    recommendations.push('Continue monitorando seus indicadores mensalmente');
    recommendations.push('Considere reservar parte do lucro para crescimento ou emergências');
  }

  return { status, alerts, recommendations };
}

// ============================================================================
// GESTÃO DE RESERVAS E POUPANÇA
// ============================================================================

/**
 * Calcula o valor a ser reservado do lucro líquido para reinvestimento ou segurança.
 */
export function getValueToSave(netProfit: number, percentageToSave: number = 20): number {
  if (netProfit <= 0) return 0;

  if (percentageToSave < 0 || percentageToSave > 100) {
    console.warn('Percentual de poupança inválido:', percentageToSave);
    return 0;
  }

  const valueToSave = (netProfit * percentageToSave) / 100;
  return Number(valueToSave.toFixed(2));
}

// ============================================================================
// SIMULADORES E PROJEÇÕES
// ============================================================================

/**
 * Simula o impacto de mudanças de preço no lucro e ponto de equilíbrio.
 */
export function simulatePriceChange(
  currentPrice: number,
  newPrice: number,
  currentUnitsSold: number,
  variableCostPerUnit: number,
  fixedCosts: number,
  estimatedDemandChange: number = 0
): PriceChangeSimulation {
  const demandMultiplier = 1 + estimatedDemandChange / 100;
  const newUnitsSold = Math.round(currentUnitsSold * demandMultiplier);

  const currentRevenue = currentPrice * currentUnitsSold;
  const newRevenue = newPrice * newUnitsSold;

  const currentProfit = currentRevenue - variableCostPerUnit * currentUnitsSold - fixedCosts;
  const newProfit = newRevenue - variableCostPerUnit * newUnitsSold - fixedCosts;

  const newBreakEvenUnits = getBreakEvenUnits(fixedCosts, newPrice, variableCostPerUnit);

  return {
    newRevenue: Number(newRevenue.toFixed(2)),
    newProfit: Number(newProfit.toFixed(2)),
    profitChange: Number((newProfit - currentProfit).toFixed(2)),
    newBreakEvenUnits,
    revenueChange: Number((newRevenue - currentRevenue).toFixed(2)),
  };
}
