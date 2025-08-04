import { Sale } from '@/types/sale';
import { FixedCost } from '@/types/sale';

/**
 * Calcula a receita total das vendas (sem descontos).
 *
 * @param sales - Array de vendas realizadas
 * @returns Receita total em reais
 *
 * @example
 * const revenue = getTotalRevenue(sales);
 * console.log(revenue); // 1500.00
 */
export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((total, sale) => {
    const revenue = sale.unitPrice * sale.quantity;
    // Validação para evitar NaN no resultado
    return total + (isNaN(revenue) ? 0 : revenue);
  }, 0);
}

/**
 * Calcula o custo variável total com base nos ingredientes usados nas vendas.
 *
 * Se a venda tiver ingredientes detalhados, usa eles. Caso contrário,
 * usa o custo unitário multiplicado pela quantidade.
 *
 * @param sales - Array de vendas realizadas
 * @returns Custo variável total em reais
 *
 * @example
 * const variableCost = getTotalVariableCost(sales);
 * console.log(variableCost); // 800.00
 */
export function getTotalVariableCost(sales: Sale[]): number {
  return sales.reduce((total, sale) => {
    // Se há ingredientes detalhados, calcula baseado neles
    const ingredientsCost =
      sale.ingredientsUsed?.reduce((sum, ing) => {
        // Usa o totalValue do ingrediente que já representa o custo total
        return sum + (isNaN(ing.totalValue) ? 0 : ing.totalValue);
      }, 0) ?? sale.costPrice * sale.quantity;

    return total + ingredientsCost;
  }, 0);
}

/**
 * Calcula o total de custos fixos mensais.
 *
 * Se a despesa for anual, ela é automaticamente dividida por 12
 * para obter o valor mensal equivalente.
 *
 * @param fixedCosts - Array de custos fixos
 * @returns Custo fixo total mensal em reais
 *
 * @example
 * const fixedCost = getTotalFixedCost(fixedCosts);
 * console.log(fixedCost); // 1200.00
 */
export function getTotalFixedCost(fixedCosts: FixedCost[]): number {
  return fixedCosts.reduce((total, cost) => {
    let monthlyAmount = 0;

    if (cost.recurrence === 'mensal') {
      monthlyAmount = cost.amount;
    } else if (cost.recurrence === 'anual') {
      // Converte custo anual para mensal
      monthlyAmount = cost.amount / 12;
    } else {
      console.warn(`Recorrência desconhecida: ${cost.recurrence}`);
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
  if (totalRevenue <= 0) return 0;
  return (netProfit / totalRevenue) * 100;
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
  return (netProfit * percentageToSave) / 100;
}
