'use client';

import React from 'react';
import CardWrapper from '@/components/dashboard/finance/cards/CardWrapper';
import { FinanceSummary } from '@/lib/hooks/business/useSummaryFinance';

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
    breakEven,
  } = financialSummary;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CardWrapper title="Receita Total" value={totalRevenue} type="currency" />
      <CardWrapper title="Custo Variável Total" value={totalVariableCost ?? 0} type="currency" />
      <CardWrapper title="Custo Fixo Total" value={totalFixedCost ?? 0} type="currency" />
      <CardWrapper title="Lucro Bruto" value={grossProfit} type="currency" />
      <CardWrapper title="Lucro Líquido" value={netProfit} type="currency" />
      <CardWrapper title="Margem de Lucro" value={margin} type="percentage" />
      <CardWrapper title="Valor a Pagar" value={valueToSave ?? 0} type="currency" />
      <CardWrapper title="Ponto de Equilíbrio" value={breakEven ?? 0} type="currency" />
    </div>
  );
}
