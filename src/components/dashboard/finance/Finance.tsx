'use client';

import React from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useFinanceSummary } from '@/lib/hooks/business/useSummaryFinance';
import { useFinanceActions } from '@/lib/hooks/business/useFinanceActions';
import FinancialSummaryCards from '@/components/features/finance/FinancialSummaryCards';
import SalesTable from '@/components/features/finance/SalesTable';

export default function Finance() {
  const { state: salesState } = useSalesContext();
  const { handleRemoveSale } = useFinanceActions();

  // Calculate financial summary
  const financialSummary = useFinanceSummary(salesState.sales);

  return (
    <div className="flex flex-col gap-4">
      {/* Financial summary cards */}
      <FinancialSummaryCards financialSummary={financialSummary} />

      {/* Sales table */}
      <SalesTable sales={salesState.sales} onRemoveSale={handleRemoveSale} />
    </div>
  );
}
