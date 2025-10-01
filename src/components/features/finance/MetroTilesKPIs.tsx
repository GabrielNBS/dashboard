'use client';

import React from 'react';
import { FinanceSummary } from '@/hooks/business/useSummaryFinance';
import CardWrapper from '@/components/dashboard/finance/cards/CardWrapper';
import FinancePieChart from './FinancePieChart';
import GoalCardWrapper from './GoalCardWrapper';
import { DollarSign } from 'lucide-react';

interface MetroTilesKPIsProps {
  financialSummary: FinanceSummary;
}

export default function MetroTilesKPIs({ financialSummary }: MetroTilesKPIsProps) {
  const {
    totalRevenue,
    totalVariableCost,
    totalFixedCost,
    grossProfit,
    netProfit,
    margin,
    breakEven,
  } = financialSummary;

  return (
    <div className="space-y-3">
      {/* Container principal com Metro Tiles, GoalCard e Gráfico */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Metro Tiles Grid - 2/3 do espaço */}
        <div className="lg:col-span-2">
          <div
            className="grid grid-cols-4 gap-3 sm:gap-4"
            style={{ gridTemplateRows: 'repeat(4, minmax(70px, 1fr))' }}
          >
            {/* LARGE TILE - Lucro Líquido (Principal KPI) */}
            <CardWrapper
              title="Lucro Líquido"
              className="col-span-2 row-span-2"
              value={netProfit}
              type="currency"
              bgColor="bg-great"
              layout="vertical"
              trending
            />

            {/* MEDIUM TILE - Receita Total */}
            <div className="col-span-2">
              <CardWrapper
                title={
                  <div className="flex w-full items-center justify-between">
                    <span>Receita Total</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-200">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                }
                value={totalRevenue}
                type="currency"
                bgColor="bg-surface"
                layout="vertical"
              />
            </div>

            {/* SMALL TILES - 4 KPIs secundários */}
            <div className="col-span-1">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs opacity-80">Variável</span>
                    <span className="text-xs">Custo Variável</span>
                  </div>
                }
                value={totalVariableCost}
                type="currency"
                bgColor="bg-warning"
                textColor="text-on-warning"
                layout="vertical"
              />
            </div>

            <div className="col-span-1">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs opacity-80">Fixo</span>
                    <span className="text-xs">Custo Fixo</span>
                  </div>
                }
                value={totalFixedCost}
                type="currency"
                bgColor="bg-muted"
                layout="vertical"
              />
            </div>

            <div className="col-span-1">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs opacity-80">Margem</span>
                    <span className="text-xs">Lucro</span>
                  </div>
                }
                value={margin}
                type="percentage"
                bgColor="bg-purple-100"
                layout="vertical"
              />
            </div>

            <div className="col-span-1">
              <CardWrapper
                title={
                  <div>
                    <span className="mb-1 block text-xs opacity-80">Bruto</span>
                    <span className="text-xs">Lucro Bruto</span>
                  </div>
                }
                value={grossProfit}
                type="currency"
                bgColor="bg-blue-100"
                layout="vertical"
              />
            </div>

            {/* GOAL CARD - Ponto de Equilíbrio */}
            <div className="col-span-2">
              <GoalCardWrapper
                title="Ponto de equilíbrio"
                goalValue={breakEven || 0}
                currentValue={grossProfit || 0}
              />
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza - 1/3 do espaço */}
        <div className="lg:col-span-1">
          <div className="h-full min-h-[240px] rounded-lg bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-medium text-gray-700">Distribuição Financeira</h4>
            <FinancePieChart financialSummary={financialSummary} />
          </div>
        </div>
      </div>

      {/* Status Bar Compacto */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-gray-600">
            <div className="bg-great h-2 w-2 rounded-sm"></div>
            Principal
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <div className="h-2 w-2 rounded-sm bg-blue-500"></div>
            Receita
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <div className="h-2 w-2 rounded-sm bg-purple-500"></div>
            Performance
          </span>
        </div>
        <span className="font-medium text-gray-500">KPIs Financeiros</span>
      </div>
    </div>
  );
}
