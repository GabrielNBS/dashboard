import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function NetProfitCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Lucro Líquido"
      value={summary.netProfit}
      type="currency"
      bgColor="bg-purple-100"
      textColor="text-purple-800"
    />
  );
}
