import { endOfMonth, isWithinInterval, parseISO, startOfMonth, subMonths } from 'date-fns';
import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { TrendingData } from './useTrendingMetrics';

/**
 * Hook para calcular trending de receita comparando mês atual com mês anterior
 * Retorna null se não houver dados do mês anterior (primeiro mês)
 */
export function useRevenueMonthlyTrending(sales: Sale[]): TrendingData | null {
  return useMemo(() => {
    if (!sales || sales.length === 0) {
      return null;
    }

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(currentMonthStart, 1));
    const previousMonthEnd = endOfMonth(previousMonthStart);

    // Filtrar vendas do mês atual
    const currentMonthSales = sales.filter(sale => {
      const saleDate = parseISO(sale.date);
      return saleDate >= currentMonthStart;
    });

    // Filtrar vendas do mês anterior
    const previousMonthSales = sales.filter(sale => {
      const saleDate = parseISO(sale.date);
      return isWithinInterval(saleDate, { start: previousMonthStart, end: previousMonthEnd });
    });

    // Se não houver vendas no mês anterior, não mostrar trending
    // (primeiro mês de operação)
    if (previousMonthSales.length === 0) {
      return null;
    }

    // Calcular receita do mês atual
    const currentRevenue = currentMonthSales.reduce(
      (sum, sale) => sum + sale.sellingResume.totalValue,
      0
    );

    // Calcular receita do mês anterior
    const previousRevenue = previousMonthSales.reduce(
      (sum, sale) => sum + sale.sellingResume.totalValue,
      0
    );

    // Se não houver receita no mês anterior, mas há vendas
    // mostrar como 100% de crescimento
    if (previousRevenue === 0) {
      return {
        percentage: currentRevenue > 0 ? 100 : 0,
        isPositive: currentRevenue > 0,
        period: 'vs mês anterior',
      };
    }

    // Calcular percentual de mudança
    const percentageChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    return {
      percentage: Math.abs(percentageChange),
      isPositive: percentageChange >= 0,
      period: 'vs mês anterior',
    };
  }, [sales]);
}
