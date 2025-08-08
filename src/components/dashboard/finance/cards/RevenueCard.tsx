import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function RevenueCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Receita Total"
      value={summary.totalRevenue}
      type="currency"
      bgColor="bg-green-100"
      textColor="text-green-800"
    />
  );
}
