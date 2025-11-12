import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { memo } from 'react';

const NetProfitCard = memo(function NetProfitCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return <CardWrapper title="Lucro líquido" value={summary.netProfit} type="currency" {...props} />;
});

NetProfitCard.displayName = 'NetProfitCard';

export default NetProfitCard;
