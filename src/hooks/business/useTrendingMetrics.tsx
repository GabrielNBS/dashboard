import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { FinanceSummary } from './useSummaryFinance';

export interface TrendingData {
  percentage: number;
  isPositive: boolean;
  period: string;
}

export interface TrendingMetrics {
  revenue: TrendingData;
  netProfit: TrendingData;
  margin: TrendingData;
  variableCost: TrendingData;
}

/**
 * Hook para calcular métricas de tendência comparando o mês atual com o anterior
 */
export function useTrendingMetrics(sales: Sale[], currentSummary: FinanceSummary): TrendingMetrics {
  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Primeiro dia do mês atual
    const currentMonthStart = new Date(currentYear, currentMonth, 1);

    // Primeiro dia do mês anterior
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const previousMonthEnd = new Date(currentYear, currentMonth, 0);

    // Filtrar vendas do mês anterior
    const previousMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= previousMonthStart && saleDate <= previousMonthEnd;
    });

    // Calcular métricas do mês anterior
    const previousRevenue = previousMonthSales.reduce(
      (sum, sale) => sum + sale.sellingResume.totalValue,
      0
    );

    // Calcular custo total dos itens vendidos no mês anterior
    const previousItemsCost = previousMonthSales.reduce((sum, sale) => {
      return (
        sum +
        sale.items.reduce((itemSum, item) => {
          return itemSum + item.product.production.sellingPrice * item.quantity;
        }, 0)
      );
    }, 0);

    const previousNetProfit = previousRevenue - previousItemsCost;
    const previousMargin = previousRevenue > 0 ? (previousNetProfit / previousRevenue) * 100 : 0;

    // Função para calcular tendência
    const calculateTrend = (current: number, previous: number): TrendingData => {
      if (previous === 0) {
        return {
          percentage: current > 0 ? 100 : 0,
          isPositive: current >= 0,
          period: 'vs mês anterior',
        };
      }

      const percentage = ((current - previous) / Math.abs(previous)) * 100;

      return {
        percentage: Math.abs(percentage),
        isPositive: percentage >= 0,
        period: 'vs mês anterior',
      };
    };

    // Função especial para custos (onde redução é positiva)
    const calculateCostTrend = (current: number, previous: number): TrendingData => {
      if (previous === 0) {
        return {
          percentage: current > 0 ? 100 : 0,
          isPositive: current <= 0, // Para custos, zero ou negativo é bom
          period: 'vs mês anterior',
        };
      }

      const percentage = ((current - previous) / Math.abs(previous)) * 100;

      return {
        percentage: Math.abs(percentage),
        isPositive: percentage <= 0, // Para custos, redução é positiva
        period: 'vs mês anterior',
      };
    };

    // Métricas atuais (usando o summary atual que já considera todo o período)
    const currentRevenue = currentSummary.totalRevenue;
    const currentNetProfit = currentSummary.netProfit;
    const currentMargin = currentSummary.margin;
    const currentVariableCost = currentSummary.totalVariableCost;

    return {
      revenue: calculateTrend(currentRevenue, previousRevenue),
      netProfit: calculateTrend(currentNetProfit, previousNetProfit),
      margin: calculateTrend(currentMargin, previousMargin),
      variableCost: calculateCostTrend(currentVariableCost, previousItemsCost),
    };
  }, [sales, currentSummary]);
}
