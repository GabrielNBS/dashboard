import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { WithSummary } from '@/types/WithSummary';

export default function FixedCostCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Custo fixo total"
      value={summary.totalFixedCost}
      type="currency"
      {...props}
    />
  );
}
