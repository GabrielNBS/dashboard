import { useMemo } from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useFinanceSummary, FinanceSummary } from './useSummaryFinance';
import { useTrendingMetrics, TrendingMetrics } from './useTrendingMetrics';
import { Sale } from '@/types/sale';
import {
  getTotalRevenue,
  getIntegratedVariableCost,
  getTotalFixedCost,
  getTotalUnitsSold,
} from '@/utils/calculations/finance';

export interface DashboardMetrics {
  summary: FinanceSummary;
  trending: TrendingMetrics;
  chartData: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  aggregatedData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  isLoading: boolean;
}

export function useDashboardMetrics(): DashboardMetrics {
  const { state: salesState, isLoading: salesLoading } = useSalesContext();
  const { state: settings, isLoading: settingsLoading } = useSettings();

  const isLoading = salesLoading || settingsLoading;

  const summary = useFinanceSummary(salesState.sales);

  const trending = useTrendingMetrics(salesState.sales, summary);
  const chartData = useMemo(() => {
    if (isLoading || salesState.sales.length === 0) return [];

    const salesByDate = salesState.sales.reduce(
      (acc, sale) => {
        const date = new Date(sale.date).toISOString().split('T')[0];

        if (!acc[date]) {
          acc[date] = {
            sales: [],
            revenue: 0,
          };
        }

        acc[date].sales.push(sale);
        acc[date].revenue += sale.sellingResume.totalValue;

        return acc;
      },
      {} as Record<string, { sales: Sale[]; revenue: number }>
    );

    const fixedCostDaily = getTotalFixedCost(settings.fixedCosts) / 30;

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

        return {
          date,
          revenue: dailyRevenue,
          expenses,
          profit,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [salesState.sales, settings.variableCosts, settings.fixedCosts, isLoading]);

  const aggregatedData = useMemo(() => {
    const colors = {
      revenue: '#3B82F6',
      expenses: '#EF4444',
      profit: '#10B981',
    };

    return [
      {
        name: 'Receita',
        value: summary.totalRevenue,
        color: colors.revenue,
      },
      {
        name: 'Gastos',
        value: (summary.totalVariableCost || 0) + (summary.totalFixedCost || 0),
        color: colors.expenses,
      },
      {
        name: 'Lucro',
        value: summary.netProfit,
        color: colors.profit,
      },
    ];
  }, [summary]);

  return {
    summary,
    trending,
    chartData,
    aggregatedData,
    isLoading,
  };
}
