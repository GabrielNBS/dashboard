import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function GrossProfitCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Lucro Bruto"
      value={summary.grossProfit}
      type="currency"
      bgColor="bg-blue-100"
      textColor="text-blue-800"
    />
  );
}
