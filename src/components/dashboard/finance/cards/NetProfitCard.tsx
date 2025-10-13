import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';

export default function NetProfitCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return <CardWrapper title="Lucro líquido" value={summary.netProfit} type="currency" {...props} />;
}
