// hooks/useSummaryFinance.tsx
// Hook customizado para calcular resumos financeiros baseados em vendas e custos fixos

import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { FixedCostSettings } from '@/types/settings';
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
export interface FinanceSummary {
  totalRevenue: number;
  totalVariableCost?: number;
  totalFixedCost?: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  valueToSave?: number;
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
  savingRate?: number
): FinanceSummary {
  const { state: settings } = useSettings();

  return useMemo(() => {
    // Usa custos fixos das configurações se não fornecidos
    const effectiveFixedCosts = fixedCosts || settings.fixedCosts;

    // Usa taxa de poupança das configurações se não fornecida
    const effectiveSavingRate = savingRate ?? settings.financial.emergencyReservePercentage / 100;

    // Calcula receita total das vendas
    const totalRevenue = getTotalRevenue(sales);

    // Calcula custo variável total (ingredientes utilizados)
    const totalVariableCost = getTotalVariableCost(sales);

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

    return {
      totalRevenue,
      totalVariableCost,
      totalFixedCost,
      grossProfit,
      netProfit,
      margin,
      valueToSave,
    };
  }, [sales, fixedCosts, savingRate, settings]);
}
