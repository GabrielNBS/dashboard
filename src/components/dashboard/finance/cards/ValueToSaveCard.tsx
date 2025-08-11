import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';

export default function ValueToSaveCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Valor a Guardar"
      value={summary.valueToSave ?? 0}
      type="currency"
      {...props}
    />
  );
}
