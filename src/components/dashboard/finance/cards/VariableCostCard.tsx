import { WithSummary } from '@/types/WithSummary';
import CardWrapper, { CardWrapperProps } from './CardWrapper';
import { memo } from 'react';

const VariableCostCard = memo(function VariableCostCard({
  summary,
  ...props
}: WithSummary<Omit<CardWrapperProps, 'value' | 'title'>>) {
  return (
    <CardWrapper
      title="Custos variáveis"
      value={summary.totalVariableCost}
      type="currency"
      {...props}
    />
  );
});

VariableCostCard.displayName = 'VariableCostCard';

export default VariableCostCard;
