'use client';

import React from 'react';
import CardWrapper from '@/components/dashboard/finance/cards/CardWrapper';
import { FinanceSummary } from '@/hooks/business/useSummaryFinance';

interface FinancialSummaryCardsProps {
  financialSummary: FinanceSummary;
}

export default function FinancialSummaryCards({ financialSummary }: FinancialSummaryCardsProps) {
  const {
    totalRevenue,
    totalVariableCost,
    totalFixedCost,
    grossProfit,
    netProfit,
    margin,
    valueToSave,
  } = financialSummary;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CardWrapper title="Receita Total" value={totalRevenue} type="currency" bgColor="bg-great" />
      <CardWrapper
        title="Custo Variável Total"
        value={totalVariableCost}
        type="currency"
        bgColor="bg-warning"
      />
      <CardWrapper
        title="Custo Fixo Total"
        value={totalFixedCost}
        type="currency"
        bgColor="bg-muted"
      />
      <CardWrapper title="Lucro Bruto" value={grossProfit} type="currency" bgColor="bg-blue-100" />
      <CardWrapper title="Lucro Líquido" value={netProfit} type="currency" bgColor="bg-blue-200" />
      <CardWrapper
        title="Margem de Lucro"
        value={margin}
        type="percentage"
        bgColor="bg-purple-100"
      />
      <CardWrapper title="Valor a Pagar" value={valueToSave} type="currency" bgColor="bg-red-100" />
    </div>
  );
}
