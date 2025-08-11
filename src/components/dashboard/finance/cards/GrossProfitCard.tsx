import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';

export default function GrossProfitCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return <CardWrapper title="Lucro Bruto" value={summary.grossProfit} type="currency" {...props} />;
}
