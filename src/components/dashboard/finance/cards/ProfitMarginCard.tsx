import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function ProfitMarginCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Margem de Lucro"
      value={summary.margin}
      type="percent"
      bgColor="bg-teal-100"
      textColor="text-teal-800"
    />
  );
}
