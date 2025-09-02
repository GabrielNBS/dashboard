import { FinanceSummary } from '@/lib/hooks/business/useSummaryFinance';

// types/WithSummary.ts
export type WithSummary<T> = {
  summary: FinanceSummary;
} & T;
