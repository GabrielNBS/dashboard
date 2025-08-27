'use client';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import { FinancialLineChart } from '@/components/dashboard/home/KpiMetrics';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useFinanceSummary } from '@/lib/hooks/business/useSummaryFinance';
import { ChartBarIcon, PercentIcon, DollarSign, CoinsIcon } from 'lucide-react';

// pages/dashboard.tsx
export default function DashboardContent() {
  const { state: settings } = useSettings();
  const { state: salesState } = useSalesContext();

  const revenue = useFinanceSummary(salesState.sales);
  const netProfit = useFinanceSummary(salesState.sales);
  const variableCost = useFinanceSummary(salesState.sales);
  const margin = useFinanceSummary(salesState.sales);

  const { storeName } = settings.store;

  return (
    <main className="bg-surface grid min-h-screen flex-1 grid-rows-1 gap-6 p-6 lg:grid-rows-[15%_20%_50%_15%]">
      {/* Cabeçalho */}
      <header className="grid-cols-1">
        <h1 className="text-primary text-hero font-bold">
          Bom dia, <strong className="text-primary">{storeName}</strong>
        </h1>
        <p className="text-foreground text-lg">Resumo das métricas e atividades recentes.</p>
      </header>

      {/* Grade de Cards */}
      <section className="bg-surface grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <NetProfitCard summary={netProfit} bgColor="bg-accent" icon={<DollarSign />} />
        <RevenueCard summary={revenue} icon={<ChartBarIcon />} />
        <VariableCostCard summary={variableCost} icon={<CoinsIcon />} />
        <ProfitMarginCard summary={margin} icon={<PercentIcon />} />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 gap-6">
        <FinancialLineChart />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 gap-6">
        <h2>teste</h2>
      </section>
    </main>
  );
}
