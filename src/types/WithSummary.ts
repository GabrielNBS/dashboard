import { FinanceSummary } from '@/hooks/business/useSummaryFinance';

// types/WithSummary.ts
export type WithSummary<T> = {
  summary: FinanceSummary;
} & T;
