import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';

export default function NetProfitCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return <CardWrapper title="Lucro Líquido" value={summary.netProfit} type="currency" {...props} />;
}
