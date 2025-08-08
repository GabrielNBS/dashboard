import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function FixedCostCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Custo Fixo Total"
      value={summary.totalFixedCost ?? 0}
      type="currency"
      bgColor="bg-yellow-100"
      textColor="text-yellow-800"
    />
  );
}
