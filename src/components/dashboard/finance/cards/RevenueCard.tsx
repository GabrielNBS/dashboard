import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { WithSummary } from '@/types/WithSummary';
import { memo } from 'react';

const RevenueCard = memo(function RevenueCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper title="Receita total" value={summary.totalRevenue} type="currency" {...props} />
  );
});

RevenueCard.displayName = 'RevenueCard';

export default RevenueCard;
