// hooks/useSummaryFinance.tsx
// Hook customizado para calcular resumos financeiros baseados em vendas e custos fixos/variáveis

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
} from '@/utils/calculations/finance';

export interface FinanceSummary {
  totalRevenue: number;
  totalVariableCost?: number;
  totalFixedCost?: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  valueToSave?: number;
  breakEven?: number;
  totalUnitsSold?: number; // ✅ incluído no retorno
}

/**
 * Hook customizado para calcular resumos financeiros
 *
 * Calcula automaticamente receita, custos, lucros e margens baseado nas vendas,
 * custos fixos/variáveis e taxa de poupança configurada.
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

    // Usa custos variáveis das configurações se não fornecidos
    const effectiveVariableCosts = variableCosts || settings.variableCosts;

    // Usa taxa de poupança das configurações se não fornecida
    const effectiveSavingRate = savingRate ?? settings.financial.emergencyReservePercentage / 100;

    // Receita total
    const totalRevenue = getTotalRevenue(sales);

    // Quantidade total de unidades vendidas
    const totalUnitsSold = getTotalUnitsSold(sales);

    // Custos variáveis totais (ingredientes, embalagens, etc.)
    const totalVariableCost = getTotalVariableCost(
      effectiveVariableCosts,
      totalRevenue,
      totalUnitsSold
    );

    // Custos fixos totais mensais
    const totalFixedCost = getTotalFixedCost(effectiveFixedCosts);

    // Lucro bruto
    const grossProfit = getGrossProfit(totalRevenue, totalVariableCost);

    // Lucro líquido
    const netProfit = getNetProfit(totalRevenue, totalVariableCost, totalFixedCost);

    // Margem de lucro (%)
    const margin = getProfitMargin(netProfit, totalRevenue);

    // Valor a ser reservado (poupança)
    const valueToSave = getValueToSave(netProfit, effectiveSavingRate);

    // Ponto de equilíbrio
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
      totalUnitsSold,
    };
  }, [sales, fixedCosts, variableCosts, savingRate, settings]);
}
