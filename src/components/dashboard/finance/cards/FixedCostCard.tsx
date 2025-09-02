import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { WithSummary } from '@/types/WithSummary';

export default function FixedCostCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Custo Fixo Total"
      value={summary.totalFixedCost}
      type="currency"
      {...props}
    />
  );
}
