import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { WithSummary } from '@/types/WithSummary';

export default function BreakEvenCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Ponto de Equilíbrio"
      value={summary.breakEven ?? 0}
      type="currency"
      {...props}
    />
  );
}
