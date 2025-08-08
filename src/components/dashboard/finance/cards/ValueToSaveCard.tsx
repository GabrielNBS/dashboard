import { FinanceSummary } from '@/hooks/useSummaryFinance';
import CardWrapper from './CardWrapper';

export default function ValueToSaveCard({ summary }: { summary: FinanceSummary }) {
  return (
    <CardWrapper
      title="Valor a Guardar"
      value={summary.valueToSave ?? 0}
      type="currency"
      bgColor="bg-orange-100"
      textColor="text-orange-800"
    />
  );
}
