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
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Primeiro dia do mês atual
    const currentMonthStart = new Date(currentYear, currentMonth, 1);

    // Primeiro dia do mês anterior
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const previousMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Filtrar vendas do mês atual
    const currentMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= currentMonthStart;
    });

    // Filtrar vendas do mês anterior
    const previousMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= previousMonthStart && saleDate <= previousMonthEnd;
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
