'use client';

import { useSettings } from '@/contexts/settings/SettingsContext';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';
import dynamic from 'next/dynamic';
import { ChartBarIcon, PercentIcon, DollarSign, ShoppingBagIcon } from 'lucide-react';
import { getGreetingByHour } from '@/utils/helpers/dateTime'; // ✅ nome corrigido
import { Header } from '@/components/ui/Header';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import TopSellingItems from '@/components/dashboard/home/TopSellingItems';
import { DashboardSkeleton } from '@/components/ui/skeletons';

const FinancialChart = dynamic(() => import('@/components/dashboard/home/FinancialChartWrapper'), {
  loading: () => <div className="h-96 animate-pulse rounded-lg bg-gray-200" />,
});

const METRIC_CARDS = [
  {
    Component: NetProfitCard,
    key: 'netProfit' as const,
    icon: DollarSign,
    extraProps: { bgColor: 'bg-primary', textColor: 'text-secondary' },
  },
  { Component: RevenueCard, key: 'revenue' as const, icon: ChartBarIcon },
  { Component: VariableCostCard, key: 'variableCost' as const, icon: ShoppingBagIcon },
  { Component: ProfitMarginCard, key: 'margin' as const, icon: PercentIcon },
];

export default function DashboardContent() {
  const { state: storeSettings } = useSettings();

  const { summary, trending, chartData, aggregatedData, isLoading, error } = useDashboardMetrics();

  if (error) throw error;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const greeting = getGreetingByHour();
  const storeName = storeSettings.store.name || 'Visitante';

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <Header
        title={
          <>
            {greeting}, <strong>{storeName}</strong>
          </>
        }
        subtitle="Acompanhe seus dados em tempo real"
      />

      <main role="main" aria-label="Painel de controle">
        <section aria-labelledby="kpi-section">
          <h2 id="kpi-section" className="sr-only">
            Indicadores chave de desempenho
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
            {METRIC_CARDS.map(({ Component, key, icon: Icon, extraProps = {} }) => (
              <Component
                key={key}
                summary={summary}
                icon={<Icon aria-hidden="true" />}
                trending={trending[key]}
                {...extraProps}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="charts-section" className="mt-6 flex flex-col gap-6 lg:flex-row">
          <h2 id="charts-section" className="sr-only">
            Gráficos e análises
          </h2>

          <div className="w-full lg:w-3/4">
            <FinancialChart chartData={chartData} aggregatedData={aggregatedData} />
          </div>

          <aside className="w-full lg:w-1/4" aria-label="Itens mais vendidos">
            <TopSellingItems />
          </aside>
        </section>
      </main>
    </div>
  );
}
