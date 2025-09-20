import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';

export default function VariableCostCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Custos Variáveis"
      value={summary.totalVariableCost}
      type="currency"
      {...props}
    />
  );
}
