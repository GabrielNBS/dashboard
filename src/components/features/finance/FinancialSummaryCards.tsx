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

  const cards = [
    { title: 'Receita Total', value: totalRevenue, type: 'currency' as const, bgColor: 'bg-great' },
    {
      title: 'Custo Variável',
      value: totalVariableCost,
      type: 'currency' as const,
      bgColor: 'bg-warning',
    },
    { title: 'Custo Fixo', value: totalFixedCost, type: 'currency' as const, bgColor: 'bg-muted' },
    { title: 'Lucro Bruto', value: grossProfit, type: 'currency' as const, bgColor: 'bg-info' },
    { title: 'Lucro Líquido', value: netProfit, type: 'currency' as const, bgColor: 'bg-info' },
    {
      title: 'Margem de Lucro',
      value: margin,
      type: 'percentage' as const,
      bgColor: 'bg-accent/20',
    },
    {
      title: 'Valor a Pagar',
      value: valueToSave,
      type: 'currency' as const,
      bgColor: 'bg-bad',
    },
  ];

  // Separar KPIs principais dos secundários
  const primaryKPIs = [
    { title: 'Receita Total', value: totalRevenue, type: 'currency' as const, bgColor: 'bg-great' },
    { title: 'Lucro Líquido', value: netProfit, type: 'currency' as const, bgColor: 'bg-info' },
    {
      title: 'Margem de Lucro',
      value: margin,
      type: 'percentage' as const,
      bgColor: 'bg-accent/20',
    },
  ];

  const secondaryKPIs = [
    {
      title: 'Custo Variável',
      value: totalVariableCost,
      type: 'currency' as const,
      bgColor: 'bg-warning',
    },
    { title: 'Custo Fixo', value: totalFixedCost, type: 'currency' as const, bgColor: 'bg-muted' },
    { title: 'Lucro Bruto', value: grossProfit, type: 'currency' as const, bgColor: 'bg-info' },
    {
      title: 'Valor a Pagar',
      value: valueToSave,
      type: 'currency' as const,
      bgColor: 'bg-bad',
    },
  ];

  return (
    <>
      {/* Mobile Layout - Compacto e Legível */}
      <div className="space-y-4 sm:hidden">
        {/* KPIs Principais - Destaque */}
        <div className="grid grid-cols-1 gap-3">
          {primaryKPIs.map((kpi, index) => (
            <div key={index} className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">{kpi.title}</p>
                  <p className="text-card-foreground text-xl font-bold">
                    {kpi.type === 'currency'
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(kpi.value)
                      : `${kpi.value.toFixed(1)}%`}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-full ${kpi.bgColor} flex items-center justify-center`}
                >
                  <div className="bg-card/30 h-6 w-6 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KPIs Secundários - Grid Compacto */}
        <div className="bg-muted rounded-lg p-3">
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">Detalhamento</h4>
          <div className="grid grid-cols-2 gap-3">
            {secondaryKPIs.map((kpi, index) => (
              <div key={index} className="bg-card rounded-md p-3">
                <p className="text-muted-foreground truncate text-xs font-medium">{kpi.title}</p>
                <p className="text-card-foreground text-sm font-bold">
                  {kpi.type === 'currency'
                    ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(kpi.value)
                    : `${kpi.value.toFixed(1)}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid - Layout Original */}
      <div className="hidden grid-cols-2 gap-4 sm:grid lg:grid-cols-4">
        {cards.map((card, index) => (
          <CardWrapper
            key={index}
            title={card.title}
            value={card.value}
            type={card.type}
            bgColor={card.bgColor}
          />
        ))}
      </div>
    </>
  );
}
