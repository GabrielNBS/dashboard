'use client';

import dynamic from 'next/dynamic';
import type { FinanceSummary } from '@/hooks/business/useSummaryFinance';

const FinancePieChart = dynamic(() => import('./FinancePieChart'), {
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="loader" />
    </div>
  ),
  ssr: false,
});

interface LazyFinancePieChartProps {
  financialSummary: FinanceSummary;
}

export default function LazyFinancePieChart({ financialSummary }: LazyFinancePieChartProps) {
  return <FinancePieChart financialSummary={financialSummary} />;
}
