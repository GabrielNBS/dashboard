'use client';

import { useMemo } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';

import { TrendingMetrics, useTrendingMetrics } from '@/hooks/business/useTrendingMetrics';
import { Sale } from '@/types/sale';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import {
  getTotalFixedCost,
  getTotalRevenue,
  getTotalUnitsSold,
  getIntegratedVariableCost,
} from '@/utils/UnifiedUtils';
import { FinanceSummary, useFinanceSummary } from './useSummaryFinance';
import { CHART_COLORS } from '@/utils/constants';

type SalesByDate = Record<string, { sales: Sale[]; revenue: number }>;

export interface ChartDataPoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface AggregatedDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DashboardMetrics {
  summary: FinanceSummary;
  trending: TrendingMetrics;
  chartData: ChartDataPoint[];
  aggregatedData: AggregatedDataPoint[];
  isLoading: boolean;
  error: Error | null;
}

const FALLBACK_DAYS_IN_MONTH = 30;

function getDaysInPeriod(sales: Sale[]): number {
  if (sales.length === 0) return FALLBACK_DAYS_IN_MONTH;

  const dates = sales.map(s => new Date(s.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);

  const daysDiff = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

  return daysDiff || FALLBACK_DAYS_IN_MONTH;
}

export function useDashboardMetrics(): DashboardMetrics {
  const { state: salesState } = useSalesContext();
  const { state: settingsState } = useSettings();

  const isLoading = salesState.isLoading || settingsState.isLoading;
  const error = salesState.error
    ? new Error(salesState.error)
    : settingsState.error
      ? new Error(settingsState.error)
      : null;

  const sales = salesState?.sales ?? [];
  const settings = settingsState;

  const summary = useFinanceSummary(sales);
  const trending = useTrendingMetrics(sales, summary);

  const totalFixedCost = useMemo(
    () => getTotalFixedCost(settings.fixedCosts),
    [settings.fixedCosts]
  );

  const chartData = useMemo(() => {
    if (sales.length === 0) return [];

    const salesByDate = sales.reduce<SalesByDate>((acc, sale) => {
      const date = new Date(sale.date).toISOString().split('T')[0];

      if (!acc[date]) {
        acc[date] = { sales: [], revenue: 0 };
      }

      acc[date].sales.push(sale);
      acc[date].revenue += sale.sellingResume.totalValue;

      return acc;
    }, {});

    const daysInPeriod = getDaysInPeriod(sales);

    const fixedCostDaily = totalFixedCost / daysInPeriod;

    return Object.entries(salesByDate)
      .map(([date, data]) => {
        const dailyRevenue = getTotalRevenue(data.sales);
        const dailyUnitsSold = getTotalUnitsSold(data.sales);

        const variableCost = getIntegratedVariableCost(
          settings.variableCosts,
          data.sales,
          dailyRevenue,
          dailyUnitsSold
        );

        const expenses = variableCost + fixedCostDaily;
        const profit = dailyRevenue - expenses;

        return { date, revenue: dailyRevenue, expenses, profit };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sales, settings.variableCosts, totalFixedCost]); // ✅ isLoading removido

  const aggregatedData = useMemo(() => {
    const totalExpenses = (summary.totalVariableCost || 0) + (summary.totalFixedCost || 0);

    return [
      {
        name: 'Receita',
        value: summary.totalRevenue,
        color: CHART_COLORS.revenue,
      },
      { name: 'Gastos', value: totalExpenses, color: CHART_COLORS.expenses },
      { name: 'Lucro', value: summary.netProfit, color: CHART_COLORS.profit },
    ];
  }, [summary.totalRevenue, summary.totalVariableCost, summary.totalFixedCost, summary.netProfit]);

  return {
    summary,
    trending,
    chartData,
    aggregatedData,
    isLoading,
    error, // ✅ Retornar erro
  };
}
