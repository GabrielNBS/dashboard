import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';

export default function VariableCostCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Custo com Ingredientes"
      value={summary.totalVariableCost}
      type="currency"
      {...props}
    />
  );
}
