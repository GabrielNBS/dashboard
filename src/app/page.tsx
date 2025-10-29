'use client';

import { useSettings } from '@/contexts/settings/SettingsContext';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import TopSellingItems from '@/components/dashboard/home/TopSellingItems';
import FinancialChart from '@/components/dashboard/home/KpiMetrics';
import MetricsIntegrationDemo from '@/components/dashboard/home/MetricsIntegrationDemo';

import { ChartBarIcon, PercentIcon, DollarSign, ShoppingBagIcon } from 'lucide-react';
import { getHowHours } from '@/utils/utils';
import { formatCurrency } from '@/utils/UnifiedUtils';

// pages/dashboard.tsx
export default function DashboardContent() {
  const { state: settings } = useSettings();
  const { summary, trending, chartData, aggregatedData } = useDashboardMetrics();

  const { storeName } = settings.store;

  return (
    <main className="bg-surface flex min-h-screen flex-col gap-6 p-6">
      {/* Cabeçalho da página */}
      <header>
        <h1 className="text-primary text-xl font-bold">
          {getHowHours()}, <strong className="text-primary">{storeName}</strong>
        </h1>
        <p className="text-muted-foreground text-lg">O resumo diário do seu negocio</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-4">
        {/* Container dos cards, ocupando 3 das 4 colunas em telas grandes. */}
        <div className="lg:col-span-3">
          {/* Mobile Layout - Hierárquico */}
          <div className="space-y-4 lg:hidden">
            {/* KPIs Principais - Destaque */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-background rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Lucro Líquido</p>
                    <p className="text-primary text-xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(summary.netProfit || 0)}
                    </p>
                  </div>
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <DollarSign className="text-background h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Receita Total</p>
                    <p className="text-primary text-xl font-bold">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                    <ChartBarIcon className="text-background h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs Secundários - Grid Compacto */}
            <div className="bg-muted rounded-lg p-3">
              <h4 className="text-accent-foreground mb-3 text-sm font-medium">Detalhamento</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-md p-3">
                  <p className="text-muted-foreground truncate text-xs font-medium">
                    Custo Variável
                  </p>
                  <p className="text-primary text-sm font-bold">
                    {formatCurrency(summary.totalVariableCost)}
                  </p>
                </div>

                <div className="bg-background rounded-md p-3">
                  <p className="text-muted-foreground truncate text-xs font-medium">
                    Margem de Lucro
                  </p>
                  <p className="text-primary text-sm font-bold">
                    {((summary.margin || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original */}
          <div className="hidden grid-cols-1 gap-6 md:grid-cols-2 lg:grid lg:grid-cols-4">
            <NetProfitCard
              summary={summary}
              bgColor="bg-primary"
              textColor="text-secondary"
              icon={<DollarSign />}
              trending={trending.netProfit}
            />
            <RevenueCard summary={summary} icon={<ChartBarIcon />} trending={trending.revenue} />
            <VariableCostCard
              summary={summary}
              icon={<ShoppingBagIcon />}
              trending={trending.variableCost}
            />
            <ProfitMarginCard summary={summary} icon={<PercentIcon />} trending={trending.margin} />
          </div>

          {/* Charts Section */}
          <section className="mt-6 flex flex-col gap-6">
            <FinancialChart chartData={chartData} aggregatedData={aggregatedData} />
            <MetricsIntegrationDemo />
          </section>
        </div>
        <TopSellingItems />
      </section>
    </main>
  );
}
