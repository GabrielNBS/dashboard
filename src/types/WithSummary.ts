import { FinanceSummary } from '@/hooks/useSummaryFinance';

// types/WithSummary.ts
export type WithSummary<T> = {
  summary: FinanceSummary;
} & T;
