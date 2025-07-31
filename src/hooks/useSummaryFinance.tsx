// hooks/useFinanceSummary.ts
import { useMemo } from 'react';
import { Sale } from '@/types/sale';
import { FixedCost } from '@/types/sale';
import {
  getTotalRevenue,
  getTotalVariableCost,
  getTotalFixedCost,
  getGrossProfit,
  getNetProfit,
  getProfitMargin,
  getValueToSave,
} from '@/utils/finance';

export function useFinanceSummary(sales: Sale[], fixedCosts: FixedCost[], savingRate = 0.1) {
  return useMemo(() => {
    const totalRevenue = getTotalRevenue(sales);
    const totalVariableCost = getTotalVariableCost(sales);
    const totalFixedCost = getTotalFixedCost(fixedCosts);
    const grossProfit = getGrossProfit(totalRevenue, totalVariableCost);
    const netProfit = getNetProfit(totalRevenue, totalVariableCost, totalFixedCost);
    const margin = getProfitMargin(netProfit, totalRevenue);
    const valueToSave = getValueToSave(netProfit, savingRate);

    return {
      totalRevenue,
      totalVariableCost,
      totalFixedCost,
      grossProfit,
      netProfit,
      margin,
      valueToSave,
    };
  }, [sales, fixedCosts, savingRate]);
}
