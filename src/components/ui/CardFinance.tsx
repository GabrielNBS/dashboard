import { FinanceSummary } from '@/hooks/useSummaryFinance';

import RevenueCard from '../dashboard/finance/cards/RevenueCard';
import VariableCostCard from '../dashboard/finance/cards/VariableCostCard';
import FixedCostCard from '../dashboard/finance/cards/FixedCostCard';
import GrossProfitCard from '../dashboard/finance/cards/GrossProfitCard';
import NetProfitCard from '../dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '../dashboard/finance/cards/ProfitMarginCard';
import ValueToSaveCard from '../dashboard/finance/cards/ValueToSaveCard';
import BreakEvenCard from '../dashboard/finance/cards/BreakEvenCard';

interface CardFinanceProps {
  summary: FinanceSummary;
  className?: string;
}

export default function CardFinance({ summary, className = '' }: CardFinanceProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4 ${className}`}>
      <RevenueCard summary={summary} />
      <VariableCostCard summary={summary} />
      <FixedCostCard summary={summary} />
      <GrossProfitCard summary={summary} />
      <NetProfitCard summary={summary} />
      <ProfitMarginCard summary={summary} />
      <ValueToSaveCard summary={summary} />
      <BreakEvenCard summary={summary} />
    </div>
  );
}
