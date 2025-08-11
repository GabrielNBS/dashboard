'use client';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import ProfitMarginCard from '@/components/dashboard/finance/cards/ProfitMarginCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useFinanceSummary } from '@/hooks/useSummaryFinance';
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
    <main className="min-h-screen flex-1 bg-gray-50 p-6">
      {/* Cabeçalho */}
      <header className="mb-6">
        <h1 className="text-primary text-hero font-bold">
          Bom dia, <strong className="text-accent">{storeName}</strong>
        </h1>
        <p className="text-lg text-gray-500">Resumo das métricas e atividades recentes.</p>
      </header>

      {/* Grade de Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <NetProfitCard summary={netProfit} bgColor="bg-inflow" icon={<DollarSign />} />
        <RevenueCard summary={revenue} icon={<ChartBarIcon />} />
        <VariableCostCard summary={variableCost} icon={<CoinsIcon />} />
        <ProfitMarginCard summary={margin} icon={<PercentIcon />} />
      </section>

      {/* Grid maior para gráficos e listas */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico grande */}
        <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">Vendas por Mês</h2>
          <div className="mt-4 flex h-64 items-center justify-center text-gray-400">
            {/* Aqui vai o componente de gráfico */}
            Gráfico Placeholder
          </div>
        </div>

        {/* Lista lateral */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Últimas Transações</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex justify-between text-sm text-gray-600">
              <span>Venda #1023</span>
              <span className="font-medium text-green-600">+ R$ 75,00</span>
            </li>
            <li className="flex justify-between text-sm text-gray-600">
              <span>Venda #1022</span>
              <span className="font-medium text-green-600">+ R$ 120,00</span>
            </li>
            <li className="flex justify-between text-sm text-gray-600">
              <span>Compra de Estoque</span>
              <span className="font-medium text-red-600">- R$ 340,00</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
