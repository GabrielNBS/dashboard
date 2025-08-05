// hooks/useSummaryFinance.tsx
// Hook customizado para calcular resumos financeiros baseados em vendas e custos fixos

import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { FixedCostSettings, VariableCostSettings } from '@/types/settings';
import {
  getTotalRevenue,
  getTotalVariableCost,
  getTotalFixedCost,
  getGrossProfit,
  getNetProfit,
  getProfitMargin,
  getValueToSave,
  getBreakEven,
  getTotalUnitsSold,
} from '@/utils/finance';

/**
 * Interface para o resumo financeiro calculado
 */
export interface FinanceSummary {
  totalRevenue: number;
  totalVariableCost?: number;
  totalFixedCost?: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  valueToSave?: number;
  breakEven?: number;
  totalUnitsSold?: number;
}

/**
 * Hook customizado para calcular resumos financeiros
 *
 * Calcula automaticamente receita, custos, lucros e margens baseado nas vendas
 * e custos fixos fornecidos.
 *
 * @param sales - Array de vendas realizadas
 * @param fixedCosts - Array de custos fixos (opcional, usa configurações se não fornecido)
 * @param savingRate - Taxa de poupança em percentual (opcional, usa configurações se não fornecido)
 * @returns Objeto com todos os cálculos financeiros
 *
 * @example
 * const summary = useFinanceSummary(sales, fixedCosts, 0.15);
 * console.log(summary.netProfit); // Lucro líquido
 */
export function useFinanceSummary(
  sales: Sale[],
  fixedCosts?: FixedCostSettings[],
  variableCosts?: VariableCostSettings[],
  savingRate?: number
): FinanceSummary {
  const { state: settings } = useSettings();

  return useMemo(() => {
    // Usa custos fixos das configurações se não fornecidos
    const effectiveFixedCosts = fixedCosts || settings.fixedCosts;

    // Usa custos fixos das configurações se não fornecidos
    const effectiveVariableCosts = variableCosts || settings.variableCosts;

    // Usa taxa de poupança das configurações se não fornecida
    const effectiveSavingRate = savingRate ?? settings.financial.emergencyReservePercentage / 100;

    // Calcula receita total das vendas
    const totalRevenue = getTotalRevenue(sales);

    // Calcula a quantidade de unidades vendidas
    const totalUnitsSold = getTotalUnitsSold(sales);

    // Calcula custo variável total (ingredientes, embalagens ... utilizados)
    const totalVariableCost = getTotalVariableCost(
      effectiveVariableCosts,
      totalRevenue,
      totalUnitsSold
    );

    // Calcula custo fixo total mensal
    const totalFixedCost = getTotalFixedCost(effectiveFixedCosts);

    // Calcula lucro bruto (receita - custo variável)
    const grossProfit = getGrossProfit(totalRevenue, totalVariableCost);

    // Calcula lucro líquido (receita - custo variável - custo fixo)
    const netProfit = getNetProfit(totalRevenue, totalVariableCost, totalFixedCost);

    // Calcula margem de lucro percentual
    const margin = getProfitMargin(netProfit, totalRevenue);

    // Calcula valor a ser reservado do lucro
    const valueToSave = getValueToSave(netProfit, effectiveSavingRate);

    // Calcula o valor necessário para alcançar o ponto de equilíbrio entre despesas fixas e variáveis quando comparado ao lucro total
    const breakEven = getBreakEven(totalFixedCost, totalVariableCost, totalRevenue);

    return {
      totalRevenue,
      totalVariableCost,
      totalFixedCost,
      grossProfit,
      netProfit,
      margin,
      valueToSave,
      breakEven,
    };
  }, [sales, fixedCosts, savingRate, settings]);
}
