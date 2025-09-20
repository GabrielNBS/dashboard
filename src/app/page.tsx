'use client';

import { useHydrated } from '@/hooks/ui/useHydrated';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import TopSellingItems from '@/components/dashboard/home/BestSellingProducts';
import FinancialChart from '@/components/dashboard/home/KpiMetrics';
import MetricsIntegrationDemo from '@/components/dashboard/home/MetricsIntegrationDemo';

import { ChartBarIcon, PercentIcon, DollarSign, ShoppingBagIcon } from 'lucide-react';
import IngredientCostBreakdownCard from '@/components/dashboard/finance/cards/IngredientCostBreakdownCard';

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
    <main className="bg-surface grid min-h-screen flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[3fr_1fr]">
      {/* Coluna principal */}
      <section className="flex flex-col gap-6">
        {/* Cabeçalho */}
        <header>
          <h1 className="text-primary text-hero font-bold">
            Bom dia, <strong className="text-primary">{storeName}</strong>
          </h1>
          <p className="text-foreground text-lg">O resumo diário do seu negocio</p>
        </header>

        {/* Grade de Cards */}
        <section className="bg-surface grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <NetProfitCard
            summary={summary}
            bgColor="bg-great"
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
          <IngredientCostBreakdownCard />
        </section>

        {/* Gráficos */}
        <section className="grid grid-cols-1 gap-6">
          <FinancialChart chartData={chartData} aggregatedData={aggregatedData} />
          <MetricsIntegrationDemo />
        </section>
      </section>

      {/* Coluna lateral (25%) */}
      <aside className="bg-muted rounded-2xl">
        <TopSellingItems />
      </aside>
    </main>
  );
}
