import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function VariableCostCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Custo com Ingredientes"
      value={summary.totalVariableCost ?? 0}
      type="currency"
      bgColor="bg-red-100"
      textColor="text-red-800"
    />
  );
}
