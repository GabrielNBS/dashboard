import { Sale } from '@/types/sale';
import { FixedCostSettings } from '@/types/settings';

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
    const revenue = (sale.sellingPrice ?? 0) * (sale.yieldQuantity ?? 0);
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
      sale.ingredients?.reduce((sum, ing) => {
        // Usa o totalValue do ingrediente que já representa o custo total
        return sum + (isNaN(ing.totalValue) ? 0 : ing.totalValue);
      }, 0) ??
      sale.totalCost ??
      0;

    return total + ingredientsCost;
  }, 0);
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
  if (totalRevenue <= 0) return 0;
  return Number(((netProfit / totalRevenue) * 100).toFixed(2));
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
  return Number(((netProfit * percentageToSave) / 100).toFixed(2));
}

/*
Exemplos de uso da função getTotalFixedCost:

const custosFixos = [
  { id: '1', name: 'Aluguel', amount: 1000, recurrence: 'mensal', category: 'aluguel' },
  { id: '2', name: 'Energia', amount: 200, recurrence: 'mensal', category: 'energia' },
  { id: '3', name: 'Limpeza', amount: 50, recurrence: 'semanal', category: 'outros' },
  { id: '4', name: 'Seguro', amount: 1200, recurrence: 'anual', category: 'outros' },
  { id: '5', name: 'Café', amount: 5, recurrence: 'diario', category: 'outros' },
];

const totalMensal = getTotalFixedCost(custosFixos);
// Resultado: 1000 + 200 + (50 * 4.33) + (1200 / 12) + (5 * 30) = 1000 + 200 + 216.5 + 100 + 150 = 1666.50

Cálculos:
- Mensal: 1000 + 200 = 1200
- Semanal: 50 * 4.33 = 216.5
- Anual: 1200 / 12 = 100
- Diário: 5 * 30 = 150
- Total: 1666.50
*/
