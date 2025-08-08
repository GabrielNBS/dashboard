'use client';

import NetProfitCard from '@/components/dashboard/finance/cards/NetProfitCard';
import RevenueCard from '@/components/dashboard/finance/cards/RevenueCard';
import VariableCostCard from '@/components/dashboard/finance/cards/VariableCostCard';
import BestSellingProducts from '@/components/dashboard/home/BestSellingProducts';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useFinanceSummary } from '@/hooks/useSummaryFinance';

export default function Dashboard() {
  const { state: settings } = useSettings();
  const { state: salesState } = useSalesContext();

  const revenue = useFinanceSummary(salesState.sales);
  const netProfit = useFinanceSummary(salesState.sales);
  const variableCost = useFinanceSummary(salesState.sales);

  // Dados mockados para produtos mais vendidos
  const bestSellingProducts = [
    { id: '1', name: 'Produto 1', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '2', name: 'Produto 2', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '3', name: 'Produto 3', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '4', name: 'Produto 4', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '5', name: 'Produto 5', quantity: 10, price: 100, image: 'https://placehold.co/150' },
  ];

  return (
    <>
      {/* Header da página com título e card financeiro */}
      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-hero self-start font-bold">
          Seja bem vindo, <strong className="text-accent">{settings.store.storeName}</strong>!
        </h1>
        <div className="centralize gap-default">
          <NetProfitCard summary={netProfit} />
          <RevenueCard summary={revenue} />
          <VariableCostCard summary={variableCost} />
        </div>
      </div>

      {/* Grid principal com gráfico e cards de produtos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65%_auto]">
        {/* Área do gráfico */}
        <div className="h-[300px] rounded-lg bg-red-100 p-4 sm:h-[400px] md:h-[500px]">
          <canvas id="myChart" className="h-full w-full"></canvas>
        </div>

        {/* Cards de produtos mais vendidos e estoque crítico */}
        <div className="flex flex-col gap-4">
          {/* Card de produtos mais vendidos */}
          <div className="rounded-lg bg-blue-100 p-4">
            <BestSellingProducts products={bestSellingProducts} title="Top Vendas" />
          </div>

          {/* Card de produtos com estoque crítico */}
          <div className="rounded-lg bg-blue-100 p-4">
            <BestSellingProducts
              products={bestSellingProducts}
              title="Produtos com estoque crítico"
            />
          </div>
        </div>
      </div>
    </>
  );
}
