// hooks/useSummaryFinance.tsx
// Hook customizado para calcular resumos financeiros baseados em vendas e custos fixos/variáveis

import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { FixedCostSettings, VariableCostSettings } from '@/types/settings';
import {
  getTotalRevenue,
  getTotalVariableCost,
  getIntegratedVariableCost,
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
  totalVariableCost: number;
  totalFixedCost: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  valueToSave: number;
  breakEven: number;
  totalUnitsSold: number;
}

/**
 * Hook customizado para calcular resumos financeiros
 *
 * Calcula automaticamente receita, custos, lucros e margens baseado nas vendas,
 * custos fixos/variáveis e taxa de poupança configurada.
 *
 * @param sales - Array de vendas para calcular métricas
 * @param fixedCosts - Custos fixos opcionais (usa configurações se não fornecido)
 * @param variableCosts - Custos variáveis opcionais (usa configurações se não fornecido)
 * @param savingRate - Taxa de poupança opcional (usa configurações se não fornecido)
 * @returns Resumo financeiro completo com todas as métricas calculadas
 *
 * @example
 * const summary = useFinanceSummary(salesData);
 * console.log(summary.netProfit); // Lucro líquido calculado
 */
export function useFinanceSummary(
  sales: Sale[],
  fixedCosts?: FixedCostSettings[],
  variableCosts?: VariableCostSettings[],
  savingRate?: number
): FinanceSummary {
  const { state: settings } = useSettings();

  return useMemo(() => {
    // Validação de entrada
    if (!Array.isArray(sales)) {
      console.warn('useFinanceSummary: Sales deve ser um array válido');
      return {
        totalRevenue: 0,
        totalVariableCost: 0,
        totalFixedCost: 0,
        grossProfit: 0,
        netProfit: 0,
        margin: 0,
        valueToSave: 0,
        breakEven: 0,
        totalUnitsSold: 0,
      };
    }

    try {
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

      // Custos variáveis totais integrados (ingredientes reais + outros custos configurados)
      const totalVariableCost = getIntegratedVariableCost(
        effectiveVariableCosts,
        sales,
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

      // Log para debugging em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.debug('FinanceSummary calculated:', {
          salesCount: sales.length,
          totalRevenue,
          netProfit,
          margin: `${margin}%`,
        });
      }

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
    } catch (error) {
      console.error('Erro ao calcular resumo financeiro:', error);

      // Retorna valores padrão em caso de erro
      return {
        totalRevenue: 0,
        totalVariableCost: 0,
        totalFixedCost: 0,
        grossProfit: 0,
        netProfit: 0,
        margin: 0,
        valueToSave: 0,
        breakEven: 0,
        totalUnitsSold: 0,
      };
    }
  }, [
    sales,
    fixedCosts,
    variableCosts,
    savingRate,
    settings.fixedCosts,
    settings.variableCosts,
    settings.financial.emergencyReservePercentage,
  ]);
}
