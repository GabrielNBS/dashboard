'use client';

import { useSettings } from '@/contexts/settings/SettingsContext';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';
import { Suspense, useMemo, useState, useEffect } from 'react';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import TopSellingItems from '@/components/dashboard/home/TopSellingItems';
import FinancialChart from '@/components/dashboard/home/FinancialChartWrapper';
import MetricsIntegrationDemo from '@/components/dashboard/home/MetricsIntegrationDemo';

import { ChartBarIcon, PercentIcon, DollarSign, ShoppingBagIcon } from 'lucide-react';
import { getHowHours } from '@/utils/utils';
import { formatCurrency } from '@/utils/UnifiedUtils';
import { Header } from '@/components/ui/Header';

export default function DashboardContent() {
  const { state: settings } = useSettings();
  const { summary, trending, chartData, aggregatedData } = useDashboardMetrics();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { storeName } = settings.store;
  const title = useMemo(
    () => (
      <>
        {getHowHours()}, <strong>{storeName}</strong>
      </>
    ),
    [storeName]
  );
  const subtitle = 'o resumo diário do seu dia';

  return (
    <main className="bg-surface flex min-h-screen flex-col gap-6 p-6">
      <Header title={title} subtitle={subtitle} />

      <section aria-labelledby="kpi-title" className="lresg:grid-cols-4 grid gap-6">
        <h2 id="kpi-title" className="sr-only">
          Indicadores Chave de Performance
        </h2>

        <div className="lg:col-span-3">
          <div className="space-y-4 lg:hidden">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-background rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Lucro Líquido</p>
                    <p className="text-primary text-xl font-bold">
                      {isClient ? formatCurrency(summary.netProfit) : '—'}
                    </p>
                  </div>
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <DollarSign className="text-background h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Receita Total</p>
                    <p className="text-primary text-xl font-bold">
                      {isClient ? formatCurrency(summary.totalRevenue) : '—'}
                    </p>
                  </div>
                  <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                    <ChartBarIcon className="text-background h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <h3 className="text-accent-foreground mb-3 text-sm font-medium">Detalhamento</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-md p-3">
                  <p className="text-muted-foreground truncate text-xs font-medium">
                    Custo Variável
                  </p>
                  <p className="text-primary text-sm font-bold">
                    {isClient ? formatCurrency(summary.totalVariableCost) : '—'}
                  </p>
                </div>

                <div className="bg-background rounded-md p-3">
                  <p className="text-muted-foreground truncate text-xs font-medium">
                    Margem de Lucro
                  </p>
                  <p className="text-primary text-sm font-bold">
                    {isClient ? `${((summary.margin || 0) * 100).toFixed(1)}%` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-4 gap-6 lg:grid">
            <NetProfitCard
              summary={summary}
              bgColor="bg-primary"
              textColor="text-secondary"
              icon={<DollarSign aria-hidden="true" />}
              trending={trending.netProfit}
              trendingColors={{
                positive: {
                  text: 'text-great',
                  icon: 'bg-great',
                  period: 'text-secondary/70',
                },
                negative: {
                  text: 'text-bad',
                  icon: 'text-secondary',
                  period: 'text-secondary/70',
                },
              }}
            />
            <RevenueCard
              summary={summary}
              icon={<ChartBarIcon aria-hidden="true" />}
              trending={trending.revenue}
            />
            <VariableCostCard
              summary={summary}
              icon={<ShoppingBagIcon aria-hidden="true" />}
              trending={trending.variableCost}
            />
            <ProfitMarginCard
              summary={summary}
              icon={<PercentIcon aria-hidden="true" />}
              trending={trending.margin}
            />
          </div>

          <section aria-labelledby="charts-title" className="mt-6 flex flex-col gap-6">
            <h2 id="charts-title" className="sr-only">
              Gráficos e Métricas
            </h2>
            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-200" />}>
              <FinancialChart chartData={chartData} aggregatedData={aggregatedData} />
            </Suspense>
            <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-gray-200" />}>
              <MetricsIntegrationDemo />
            </Suspense>
          </section>
        </div>

        <section aria-labelledby="top-selling-title">
          <h2 id="top-selling-title" className="sr-only">
            Itens Mais Vendidos
          </h2>
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-200" />}>
            <TopSellingItems />
          </Suspense>
        </section>
      </section>
    </main>
  );
}
