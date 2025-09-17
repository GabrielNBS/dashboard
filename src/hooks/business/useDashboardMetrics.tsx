import { useMemo } from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useFinanceSummary } from './useSummaryFinance';
import { Sale } from '@/types/sale';
import {
  getTotalRevenue,
  getTotalVariableCost,
  getTotalFixedCost,
  getTotalUnitsSold,
} from '@/utils/calculations/finance';

export interface DashboardMetrics {
  // Financial summary data
  summary: {
    totalRevenue: number;
    totalVariableCost: number;
    totalFixedCost: number;
    grossProfit: number;
    netProfit: number;
    margin: number;
    valueToSave: number;
    breakEven: number;
    totalUnitsSold: number;
  };

  // Chart data for home screen
  chartData: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;

  // Aggregated data for different chart types
  aggregatedData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

/**
 * Unified hook that combines dashboard metrics with chart data
 * This connects the business logic from Dashboard metrics with home screen charts
 */
export function useDashboardMetrics(): DashboardMetrics {
  const { state: salesState } = useSalesContext();
  const { state: settings } = useSettings();

  // Get financial summary using existing business logic
  const summary = useFinanceSummary(salesState.sales);

  // Process sales data for chart visualization
  const chartData = useMemo(() => {
    // Group sales by date and calculate daily metrics
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

    // Calculate expenses for each date using business logic functions directly
    return Object.entries(salesByDate)
      .map(([date, data]) => {
        const dailyRevenue = getTotalRevenue(data.sales);
        const dailyUnitsSold = getTotalUnitsSold(data.sales);

        const variableCost = getTotalVariableCost(
          settings.variableCosts,
          dailyRevenue,
          dailyUnitsSold
        );

        const fixedCostDaily = getTotalFixedCost(settings.fixedCosts) / 30; // Daily portion
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
  }, [salesState.sales, settings]);

  // Prepare aggregated data for pie/radial charts
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
    chartData,
    aggregatedData,
  };
}
