import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { WithSummary } from '@/types/WithSummary';

export default function RevenueCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper title="Receita total" value={summary.totalRevenue} type="currency" {...props} />
  );
}
