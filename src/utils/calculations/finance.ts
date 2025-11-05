import { Sale } from '@/types/sale';
import { FixedCostSettings, VariableCostSettings } from '@/types/settings';

/**
 * Calcula a receita total das vendas (sem descontos).
 * @param sales - Array de vendas realizadas
 * @returns Receita total em reais
 *
 * @example
 * const revenue = getTotalRevenue(sales);
 * console.log(revenue); // 1500.00
 */
// Sugestão para getTotalRevenue
export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((total, sale) => {
    const revenue = sale.sellingResume.totalValue;
    return total + (isNaN(revenue) ? 0 : revenue);
  }, 0);
}

/**
 * Calcula o custo variável total com base nas configurações fornecidas.
 *
 * Essa função considera dois tipos de custos variáveis:
 * - Percentual sobre a receita total de vendas (ex: comissões de plataformas)
 * - Valor fixo por unidade vendida (ex: custo de embalagem por item)
 *
 * Ambos os valores podem coexistir em um mesmo custo, e são somados.
 *
 * @param variableCosts - Lista de custos variáveis configurados no sistema
 * @param totalRevenue - Receita bruta total gerada pelas vendas (em reais)
 * @param totalUnitsSold - Quantidade total de unidades vendidas no período
 * @returns Número representando o custo variável total em reais
 *
 * @example
 * const variableCosts: VariableCostSettings[] = [
 *   { id: '1', name: 'Embalagem', type: 'embalagens', fixedValue: 0.5, category: 'materia_prima' },
 *   { id: '2', name: 'Comissão iFood', type: 'comissoes', percentage: 12, category: 'comercial' },
 * ];
 *
 * const totalRevenue = 1000; // R$ 1.000 de receita bruta
 * const totalUnitsSold = 200; // 200 unidades vendidas
 *
 * const result = getTotalVariableCost(variableCosts, totalRevenue, totalUnitsSold);
 * console.log(result); // 220 (100 de embalagens + 120 de comissão)
 */
export function getTotalVariableCost(
  variableCosts: VariableCostSettings[],
  totalRevenue: number,
  totalUnitsSold: number
): number {
  return variableCosts.reduce((total, cost) => {
    let costValue = 0;

    if (typeof cost.percentage === 'number') {
      // Se houver um percentual definido, calcula o valor com base na receita total
      const percentValue = (cost.percentage / 100) * totalRevenue;
      costValue += isNaN(percentValue) ? 0 : percentValue;
    }

    if (typeof cost.fixedValue === 'number') {
      // Se houver um valor fixo por unidade, multiplica pela quantidade total vendida
      const fixedTotal = cost.fixedValue * totalUnitsSold;
      costValue += isNaN(fixedTotal) ? 0 : fixedTotal;
    }

    return total + costValue;
  }, 0);
}

/**
 * Calcula o custo real dos ingredientes baseado nas vendas realizadas.
 *
 * Esta função analisa cada venda e calcula o custo real dos ingredientes
 * utilizados nos produtos vendidos, considerando os preços médios atuais
 * e suportando vendas parciais de lotes.
 *
 * @param sales - Array de vendas realizadas
 * @returns Custo total real dos ingredientes utilizados nas vendas
 */
export function getRealIngredientsCost(sales: Sale[]): number {
  return sales.reduce((totalCost, sale) => {
    const saleCost = sale.items.reduce((itemsCost, item) => {
      // Verifica se é um BatchSaleItem com custo proporcional já calculado
      const batchItem = item as { isBatchSale?: boolean; proportionalCost?: number };
      if (batchItem.isBatchSale && typeof batchItem.proportionalCost === 'number') {
        // Para vendas em lote, usa o custo proporcional já calculado
        return itemsCost + Math.abs(batchItem.proportionalCost);
      }

      // Para produtos individuais ou lotes sem custo proporcional calculado
      const ingredientsCost = item.product.ingredients.reduce((ingCost, ingredient) => {
        // Custo total do ingrediente no produto = preço médio * quantidade utilizada na receita
        const ingredientCostPerProduct =
          (ingredient.averageUnitPrice || 0) * (ingredient.totalQuantity || 0);

        let totalIngredientCost: number;
        if (item.product.production.mode === 'lote' && item.product.production.yieldQuantity > 0) {
          // Para produtos em lote, calcula custo proporcional baseado na quantidade vendida
          const proportion = item.quantity / item.product.production.yieldQuantity;
          totalIngredientCost = ingredientCostPerProduct * proportion;
        } else {
          // Para produtos individuais, multiplica pelo número de unidades vendidas
          totalIngredientCost = ingredientCostPerProduct * item.quantity;
        }

        return ingCost + totalIngredientCost;
      }, 0);

      return itemsCost + ingredientsCost;
    }, 0);

    return totalCost + saleCost;
  }, 0);
}

/**
 * Calcula o custo variável total integrado, incluindo custos reais de ingredientes
 * e outros custos variáveis configurados.
 *
 * @param variableCosts - Lista de custos variáveis configurados (exceto ingredientes)
 * @param sales - Array de vendas para calcular custo real dos ingredientes
 * @param totalRevenue - Receita bruta total
 * @param totalUnitsSold - Quantidade total de unidades vendidas
 * @returns Custo variável total integrado
 */
export function getIntegratedVariableCost(
  variableCosts: VariableCostSettings[],
  sales: Sale[],
  totalRevenue: number,
  totalUnitsSold: number
): number {
  // Filtra custos variáveis que não são ingredientes (para evitar duplicação)
  const nonIngredientCosts = variableCosts.filter(cost => cost.type !== 'ingredientes');

  // Calcula custos variáveis configurados (embalagens, comissões, etc.)
  const configuredCosts = getTotalVariableCost(nonIngredientCosts, totalRevenue, totalUnitsSold);

  // Calcula custo real dos ingredientes baseado nas vendas
  const realIngredientsCost = getRealIngredientsCost(sales);

  return configuredCosts + realIngredientsCost;
}

/**
 * Calcula o total de custos fixos mensais.
 *
 * Converte automaticamente diferentes recorrências para o valor mensal equivalente:
 * - Mensal: mantém o valor
 * - Anual: divide por 12
 * - Semanal: multiplica por 4.33 (média de semanas por mês)
 * - Diário: multiplica por 30 (média de dias por mês)
 *
 * @param fixedCosts - Array de custos fixos
 * @returns Custo fixo total mensal em reais
 *
 * @example
 * const fixedCost = getTotalFixedCost(fixedCosts);
 * console.log(fixedCost); // 1200.00
 */
export function getTotalFixedCost(fixedCosts: FixedCostSettings[]): number {
  return fixedCosts.reduce((total, cost) => {
    let monthlyAmount = 0;

    switch (cost.recurrence) {
      case 'mensal':
        monthlyAmount = cost.amount;
        break;
      case 'anual':
        // Converte custo anual para mensal
        monthlyAmount = cost.amount / 12;
        break;
      case 'semanal':
        // Converte custo semanal para mensal (4.33 semanas por mês)
        monthlyAmount = cost.amount * 4.33;
        break;
      case 'diario':
        // Converte custo diário para mensal (30 dias por mês)
        monthlyAmount = cost.amount * 30;
        break;
      default:
        console.warn(`Recorrência desconhecida: ${cost.recurrence}`);
        monthlyAmount = 0;
    }

    // Validação para evitar NaN no resultado
    return total + (isNaN(monthlyAmount) ? 0 : monthlyAmount);
  }, 0);
}

/**
 * Calcula o lucro bruto (receita - custo variável).
 *
 * @param totalRevenue - Receita total
 * @param totalVariableCost - Custo variável total
 * @returns Lucro bruto em reais
 *
 * @example
 * const grossProfit = getGrossProfit(1500, 800);
 * console.log(grossProfit); // 700.00
 */
export function getGrossProfit(totalRevenue: number, totalVariableCost: number): number {
  return totalRevenue - totalVariableCost;
}

/**
 * Calcula o lucro líquido (receita - custo variável - custos fixos).
 *
 * @param totalRevenue - Receita total
 * @param totalVariableCost - Custo variável total
 * @param totalFixedCost - Custo fixo total mensal
 * @returns Lucro líquido em reais
 *
 * @example
 * const netProfit = getNetProfit(1500, 800, 200);
 * console.log(netProfit); // 500.00
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
 *
 * @param netProfit - Lucro líquido
 * @param totalRevenue - Receita total
 * @returns Margem de lucro em percentual (0-100)
 *
 * @example
 * const margin = getProfitMargin(500, 1500);
 * console.log(margin); // 33.33
 */
export function getProfitMargin(netProfit: number, totalRevenue: number): number {
  if (totalRevenue <= 0) {
    // Se não há receita, não é possível calcular margem
    return 0;
  }

  const margin = (netProfit / totalRevenue) * 100;

  // Validação mais flexível - permite margens negativas (prejuízo) e altas margens
  if (isNaN(margin) || !isFinite(margin)) {
    console.warn('Margem de lucro inválida (NaN ou Infinito):', margin);
    return 0;
  }

  // Limita apenas valores extremamente irreais (mais de 10000% ou menos de -1000%)
  if (margin < -1000 || margin > 10000) {
    console.warn('Margem de lucro fora dos limites esperados:', margin);
    return margin < -1000 ? -1000 : 10000;
  }

  return Number(margin.toFixed(2));
}

/**
 * Calcula o valor a ser reservado do lucro líquido para reinvestimento ou segurança.
 *
 * @param netProfit - Lucro líquido
 * @param percentageToSave - Percentual a ser reservado (padrão: 20%)
 * @returns Valor a ser reservado em reais
 *
 * @example
 * const valueToSave = getValueToSave(500, 20);
 * console.log(valueToSave); // 100.00
 */
export function getValueToSave(netProfit: number, percentageToSave: number = 20): number {
  // Se há prejuízo, não há valor para poupar
  if (netProfit <= 0) {
    return 0;
  }

  // Valida percentual de poupança
  if (percentageToSave < 0 || percentageToSave > 100) {
    console.warn('Percentual de poupança inválido:', percentageToSave);
    return 0;
  }

  const valueToSave = (netProfit * percentageToSave) / 100;
  return Number(valueToSave.toFixed(2));
}

/**
 * Calcula o ponto de equilíbrio financeiro (break-even).
 *
 * O ponto de equilíbrio representa o valor de receita necessário para cobrir
 * todos os custos fixos, considerando a margem de contribuição (lucro bruto proporcional).
 *
 * Fórmula: Ponto de Equilíbrio = Custos Fixos / (1 - (Custos Variáveis / Receita Total))
 *
 * @param fixedCosts - Total de custos fixos (aluguel, salários, etc.)
 * @param variableCosts - Total de custos variáveis (embalagens, comissão, etc.)
 * @param totalRevenue - Receita bruta total obtida pelas vendas
 * @returns Valor da receita mínima necessária para atingir o ponto de equilíbrio
 *
 * @example
 * const breakEven = getBreakEven(2000, 800, 4000);
 * console.log(breakEven); // 2857.14
 */
export function getBreakEven(
  fixedCosts: number,
  variableCosts: number,
  totalRevenue: number
): number {
  // Validações básicas
  if (fixedCosts < 0 || variableCosts < 0 || totalRevenue < 0) {
    console.warn('Valores negativos não são válidos para cálculo do ponto de equilíbrio.');
    return 0;
  }

  // Se não há custos fixos, o ponto de equilíbrio é zero
  if (fixedCosts === 0) {
    return 0;
  }

  // Se não há receita, não é possível calcular margem de contribuição
  if (totalRevenue === 0) {
    // Retorna os custos fixos como ponto de equilíbrio mínimo
    return fixedCosts;
  }

  // Se custos variáveis são maiores ou iguais à receita, não há margem de contribuição
  if (variableCosts >= totalRevenue) {
    console.warn('Custos variáveis excedem a receita. Negócio não é viável.');
    return Infinity; // Indica que o ponto de equilíbrio não pode ser alcançado
  }

  // Margem de contribuição = proporção da receita que sobra após custos variáveis
  const contributionMargin = 1 - variableCosts / totalRevenue;

  // Ponto de equilíbrio = custos fixos divididos pela margem de contribuição
  const breakEvenPoint = fixedCosts / contributionMargin;

  return Math.round(breakEvenPoint * 100) / 100; // Arredonda para 2 casas decimais
}

/**
 * Calcula a quantidade total de unidades vendidas.
 *
 * Essa função é usada principalmente para cálculos de custos variáveis
 * baseados em valor fixo por unidade vendida.
 *
 * Se `yieldQuantity` estiver ausente ou inválido, considera zero.
 *
 * @param sales - Lista de vendas realizadas
 * @returns Quantidade total de unidades vendidas
 *
 * @example
 * const total = getTotalUnitsSold(sales);
 * console.log(total); // 42
 */

// Sugestão para getTotalUnitsSold
export function getTotalUnitsSold(sales: Sale[]): number {
  return sales.reduce((total, sale) => {
    const saleTotalQuantity = sale.items.reduce((itemTotal, item) => {
      return itemTotal + item.quantity;
    }, 0);
    return total + saleTotalQuantity;
  }, 0);
}
// utils/pricing.ts

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
