'use client';

import { useHydrated } from '@/hooks/ui/useHydrated';
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

// pages/dashboard.tsx
export default function DashboardContent() {
  const { state: settings } = useSettings();
  const { summary, trending, chartData, aggregatedData } = useDashboardMetrics();
  const hydrated = useHydrated();

  const { storeName } = settings.store;

  if (!hydrated) {
    return <p>Carregando ...</p>;
  }

  return (
    <main className="bg-surface flex min-h-screen flex-col gap-6 p-6">
      {/* Cabeçalho da página */}
      <header>
        <h1 className="text-primary text-hero font-bold">
          Bom dia, <strong className="text-primary">{storeName}</strong>
        </h1>
        <p className="text-foreground text-lg">O resumo diário do seu negocio</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-4">
        {/* Container dos cards, ocupando 3 das 4 colunas em telas grandes. */}
        <div className="lg:col-span-3">
          {/* Mobile Layout - Hierárquico */}
          <div className="space-y-4 lg:hidden">
            {/* KPIs Principais - Destaque */}
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(summary.netProfit || 0)}
                    </p>
                  </div>
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(summary.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs Secundários - Grid Compacto */}
            <div className="rounded-lg bg-gray-50 p-3">
              <h4 className="mb-3 text-sm font-medium text-gray-700">Detalhamento</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-white p-3">
                  <p className="truncate text-xs font-medium text-gray-500">Custo Variável</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(summary.totalVariableCost || 0)}
                  </p>
                </div>

                <div className="rounded-md bg-white p-3">
                  <p className="truncate text-xs font-medium text-gray-500">Margem de Lucro</p>
                  <p className="text-sm font-bold text-gray-900">
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
