'use client';

import React, { useState } from 'react';
import { FinanceSummary } from '@/hooks/business/useSummaryFinance';
import CardWrapper from '@/components/dashboard/finance/cards/CardWrapper';
import FinancePieChart from './FinancePieChart';
import { DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatting/formatCurrency';
import GoalCardWrapper from './GoalCardWrapper';
import LordIcon from '@/components/ui/LordIcon';
import FinancialMetricsModal from './FinancialMetricsModal';

interface MetroTilesKPIsProps {
  financialSummary: FinanceSummary;
}

export default function MetroTilesKPIs({ financialSummary }: MetroTilesKPIsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    totalRevenue,
    totalVariableCost,
    totalFixedCost,
    grossProfit,
    netProfit,
    margin,
    breakEven,
  } = financialSummary;

  const totalRevenueIcon = (
    <LordIcon
      src="https://cdn.lordicon.com/ytklkgsc.json"
      className="absolute top-10 right-10"
      isActive={true}
      height={64}
      width={64}
    />
  );

  return (
    <div className="space-y-3">
      {/* Container principal com Metro Tiles, GoalCard e Gráfico */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Metro Tiles Grid - 2/3 do espaço */}
        <div className="lg:col-span-2">
          <div
            className="grid grid-cols-4 gap-3 sm:gap-4"
            style={{ gridTemplateRows: 'repeat(3, minmax(70px, 1fr))' }}
          >
            {/* LARGE TILE - Lucro Líquido (Principal KPI) */}
            <CardWrapper
              title={<span className="text-base font-semibold sm:text-lg">Lucro Líquido</span>}
              className="relative col-span-2 row-span-2 items-center justify-center"
              value={
                <span className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                  {typeof netProfit === 'number' ? formatCurrency(netProfit) : netProfit}
                </span>
              }
              type="custom"
              bgColor="bg-primary"
              textColor="text-secondary"
              layout="vertical"
              trending
              icon={totalRevenueIcon}
            />

            {/* MEDIUM TILE - Receita Total */}
            <div className="col-span-2 h-full">
              <CardWrapper
                title={
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium sm:text-base">Receita total</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent">
                      <DollarSign className="text-primary h-4 w-4" />
                    </div>
                  </div>
                }
                value={
                  <span className="text-xl font-bold sm:text-2xl">
                    {typeof totalRevenue === 'number' ? formatCurrency(totalRevenue) : totalRevenue}
                  </span>
                }
                type="custom"
                bgColor="bg-surface"
                layout="vertical"
                className="h-full"
              />
            </div>

            {/* GOAL CARD - Ponto de Equilíbrio */}
            <div className="col-span-2 h-full">
              <GoalCardWrapper
                title="Ponto de equilíbrio"
                goalValue={breakEven || 0}
                currentValue={totalRevenue || 0}
                className="bg-great text-primary h-full"
                onClick={() => setIsModalOpen(true)}
              />
            </div>

            {/* SMALL TILES - 4 KPIs secundários */}
            <div className="col-span-1 h-full">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs font-light opacity-70">Bruto</span>
                    <span className="text-xs font-medium">Lucro bruto</span>
                  </div>
                }
                value={
                  <span className="text-sm font-bold sm:text-base">
                    {typeof grossProfit === 'number' ? formatCurrency(grossProfit) : grossProfit}
                  </span>
                }
                type="custom"
                bgColor="bg-info"
                layout="vertical"
                className="h-full"
              />
            </div>

            <div className="col-span-1 h-full">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs font-light opacity-70">Variável</span>
                    <span className="text-xs font-medium">Custo Variável</span>
                  </div>
                }
                value={
                  <span className="text-sm font-bold sm:text-base">
                    {typeof totalVariableCost === 'number'
                      ? formatCurrency(totalVariableCost)
                      : totalVariableCost}
                  </span>
                }
                type="custom"
                bgColor="bg-warning"
                textColor="text-on-warning"
                layout="vertical"
                className="h-full"
              />
            </div>

            <div className="col-span-1 h-full">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs font-light opacity-70">Fixo</span>
                    <span className="text-xs font-medium">Custo fixo</span>
                  </div>
                }
                value={
                  <span className="text-sm font-bold sm:text-base">
                    {typeof totalFixedCost === 'number'
                      ? formatCurrency(totalFixedCost)
                      : totalFixedCost}
                  </span>
                }
                type="custom"
                bgColor="bg-muted"
                layout="vertical"
                className="h-full"
              />
            </div>

            <div className="col-span-1 h-full">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs font-light opacity-70">Margem</span>
                    <span className="text-xs font-medium">Lucro</span>
                  </div>
                }
                value={
                  <span className="text-sm font-bold sm:text-base">
                    {typeof margin === 'number' ? formatPercent(margin) : margin}
                  </span>
                }
                type="custom"
                bgColor="bg-primary/10"
                layout="vertical"
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza - 1/3 do espaço */}
        <div className="lg:col-span-1">
          <div className="bg-card h-full rounded-lg p-4 shadow-sm" style={{ minHeight: '280px' }}>
            <h4 className="text-card-foreground mb-3 text-sm font-medium">
              Distribuição Financeira
            </h4>
            <div className="h-[calc(100%-2rem)]">
              <FinancePieChart financialSummary={financialSummary} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Métricas Financeiras */}
      <FinancialMetricsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        financialSummary={financialSummary}
      />
    </div>
  );
}
