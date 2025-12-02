'use client';

import { useSettings } from '@/contexts/settings/SettingsContext';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';
import dynamic from 'next/dynamic';
import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';

import { ChartBarIcon, PercentIcon, DollarSign, ShoppingBagIcon } from 'lucide-react';
import { getHowHours } from '@/utils/utils';
import { Header } from '@/components/ui/Header';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import TopSellingItems from '@/components/dashboard/home/TopSellingItems';
const FinancialChart = dynamic(() => import('@/components/dashboard/home/FinancialChartWrapper'), {
  loading: () => <div className="h-96 animate-pulse rounded-lg bg-gray-200" />,
});

export default function DashboardContent() {
  const { state: storeSettings } = useSettings();

  const { summary, trending, chartData, aggregatedData } = useDashboardMetrics();

  const { name } = storeSettings.store;

  const greeting = getHowHours();

  const title = (
    <>
      {greeting}, <strong>{name || 'Visitante'}</strong>
    </>
  );

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <Header title={title} subtitle="Acompanhe seus dados em tempo real" />

      <main role="main" aria-label="Dashboard content">
        <section aria-labelledby="kpi-title" className="grid gap-6">
          <h2 id="kpi-title" className="sr-only">
            KPIs
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
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

          <section className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-3/4">
              <FinancialChart chartData={chartData} aggregatedData={aggregatedData} />
            </div>
            <div className="w-full lg:w-1/4">
              <TopSellingItems />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
