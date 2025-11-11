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
import { Sale } from '@/types/sale';
import { useRevenueMonthlyTrending } from '@/hooks/business/useRevenueMonthlyTrending';

interface MetroTilesKPIsProps {
  financialSummary: FinanceSummary;
  sales: Sale[];
}

export default function MetroTilesKPIs({ financialSummary, sales }: MetroTilesKPIsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcular trending dinâmico baseado nas vendas
  const revenueTrending = useRevenueMonthlyTrending(sales);

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
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            style={{ gridTemplateRows: 'repeat(3, minmax(80px, 1fr))' }}
          >
            {/* LARGE TILE - Lucro Líquido (Principal KPI) */}
            <CardWrapper
              title={
                <span className="text-sm font-semibold sm:text-base md:text-lg">
                  Lucro Líquido
                </span>
              }
              className="relative col-span-2 row-span-2 items-center justify-center"
              value={
                <span className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
                  {typeof netProfit === 'number' ? formatCurrency(netProfit) : netProfit}
                </span>
              }
              type="custom"
              bgColor="bg-primary"
              textColor="text-secondary"
              layout="vertical"
              trending={revenueTrending || false}
              icon={totalRevenueIcon}
            />

            {/* MEDIUM TILE - Receita Total */}
            <div className="col-span-2 h-full">
              <CardWrapper
                title={
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-medium sm:text-sm md:text-base">
                      Receita total
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-transparent sm:h-8 sm:w-8">
                      <DollarSign className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                }
                value={
                  <span className="text-lg font-bold sm:text-xl md:text-2xl">
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
                    <span className="mb-0.5 block text-[10px] font-light opacity-70 sm:text-xs">
                      Bruto
                    </span>
                    <span className="text-[10px] font-medium sm:text-xs">Lucro bruto</span>
                  </div>
                }
                value={
                  <span className="text-xs font-bold sm:text-sm md:text-base">
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
                    <span className="mb-0.5 block text-[10px] font-light opacity-70 sm:text-xs">
                      Variável
                    </span>
                    <span className="text-[10px] font-medium sm:text-xs">Custo Variável</span>
                  </div>
                }
                value={
                  <span className="text-xs font-bold sm:text-sm md:text-base">
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
                    <span className="mb-0.5 block text-[10px] font-light opacity-70 sm:text-xs">
                      Fixo
                    </span>
                    <span className="text-[10px] font-medium sm:text-xs">Custo fixo</span>
                  </div>
                }
                value={
                  <span className="text-xs font-bold sm:text-sm md:text-base">
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
                    <span className="mb-0.5 block text-[10px] font-light opacity-70 sm:text-xs">
                      Margem
                    </span>
                    <span className="text-[10px] font-medium sm:text-xs">Lucro</span>
                  </div>
                }
                value={
                  <span className="text-xs font-bold sm:text-sm md:text-base">
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
