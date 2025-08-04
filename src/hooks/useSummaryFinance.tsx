// hooks/useSummaryFinance.tsx
// Hook customizado para calcular resumos financeiros baseados em vendas e custos fixos

import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { FixedCost } from '@/types/sale';
import {
  getTotalRevenue,
  getTotalVariableCost,
  getTotalFixedCost,
  getGrossProfit,
  getNetProfit,
  getProfitMargin,
  getValueToSave,
} from '@/utils/finance';

/**
 * Interface para o resumo financeiro calculado
 */
interface FinanceSummary {
  totalRevenue: number;
  totalVariableCost: number;
  totalFixedCost: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  valueToSave: number;
}

/**
 * Hook customizado para calcular resumos financeiros
 *
 * Calcula automaticamente receita, custos, lucros e margens baseado nas vendas
 * e custos fixos fornecidos.
 *
 * @param sales - Array de vendas realizadas
 * @param fixedCosts - Array de custos fixos mensais
 * @param savingRate - Taxa de poupança em percentual (padrão: 10%)
 * @returns Objeto com todos os cálculos financeiros
 *
 * @example
 * const summary = useFinanceSummary(sales, fixedCosts, 0.15);
 * console.log(summary.netProfit); // Lucro líquido
 */
export function useFinanceSummary(
  sales: Sale[],
  fixedCosts: FixedCost[],
  savingRate = 0.1
): FinanceSummary {
  return useMemo(() => {
    // Calcula receita total das vendas
    const totalRevenue = getTotalRevenue(sales);

    // Calcula custo variável total (ingredientes utilizados)
    const totalVariableCost = getTotalVariableCost(sales);

    // Calcula custo fixo total mensal
    const totalFixedCost = getTotalFixedCost(fixedCosts);

    // Calcula lucro bruto (receita - custo variável)
    const grossProfit = getGrossProfit(totalRevenue, totalVariableCost);

    // Calcula lucro líquido (receita - custo variável - custo fixo)
    const netProfit = getNetProfit(totalRevenue, totalVariableCost, totalFixedCost);

    // Calcula margem de lucro percentual
    const margin = getProfitMargin(netProfit, totalRevenue);

    // Calcula valor a ser reservado do lucro
    const valueToSave = getValueToSave(netProfit, savingRate);

    return {
      totalRevenue,
      totalVariableCost,
      totalFixedCost,
      grossProfit,
      netProfit,
      margin,
      valueToSave,
    };
  }, [sales, fixedCosts, savingRate]);
}
