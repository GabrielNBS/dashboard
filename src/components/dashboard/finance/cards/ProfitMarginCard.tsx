import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { memo } from 'react';

const ProfitMarginCard = memo(function ProfitMarginCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper title="Margem de lucro" value={summary.margin} type="percentage" {...props} />
  );
});

ProfitMarginCard.displayName = 'ProfitMarginCard';

export default ProfitMarginCard;
