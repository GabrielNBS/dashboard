// src/utils/finance.ts

import { Sale } from '@/types/sale';
import { FixedCost } from '@/types/sale';

/**
 * Soma o total de receita bruta (valor recebido nas vendas)
 */
export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((total, sale) => total + sale.unitPrice * sale.quantity, 0);
}

/**
 * Soma o custo total com ingredientes (com base no custo unitário de produção)
 */
export function getTotalVariableCost(sales: Sale[]): number {
  return sales.reduce((total, sale) => total + sale.costPrice * sale.quantity, 0);
}

/**
 * Soma todos os custos fixos mensais (anual dividido por 12)
 */
export function getTotalFixedCost(fixedCosts: FixedCost[]): number {
  return fixedCosts.reduce((total, cost) => {
    const monthlyAmount = cost.recurrence === 'mensal' ? cost.amount : cost.amount / 12;
    return total + monthlyAmount;
  }, 0);
}

/**
 * Lucro bruto = receita - custo dos ingredientes
 */
export function getGrossProfit(totalRevenue: number, totalVariableCost: number): number {
  return totalRevenue - totalVariableCost;
}

/**
 * Lucro líquido = receita - custo variável - custo fixo
 */
export function getNetProfit(
  totalRevenue: number,
  totalVariableCost: number,
  totalFixedCost: number
): number {
  return totalRevenue - totalVariableCost - totalFixedCost;
}

/**
 * Margem de lucro líquido em % (netProfit / revenue)
 */
export function getProfitMargin(netProfit: number, totalRevenue: number): number {
  if (totalRevenue === 0) return 0;
  return (netProfit / totalRevenue) * 100;
}

/**
 * Valor que deve ser separado para encargos, reinvestimento, etc
 * Por padrão, reserva 20% do lucro líquido
 */
export function getValueToSave(netProfit: number, percentageToSave: number = 20): number {
  return (netProfit * percentageToSave) / 100;
}
