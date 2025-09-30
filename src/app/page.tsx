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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
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
          <section className="col-span-4 flex flex-col gap-6">
            <FinancialChart chartData={chartData} aggregatedData={aggregatedData} />
            <MetricsIntegrationDemo />
          </section>
        </div>
        <TopSellingItems />
      </section>
    </main>
  );
}
