import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function BreakEvenCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Ponto de Equilíbrio"
      value={summary.breakEven ?? 0}
      type="currency"
      bgColor="bg-gray-100"
      textColor="text-gray-800"
    />
  );
}
