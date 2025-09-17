'use client';

import React, { useMemo, useRef } from 'react';

// Hooks existentes e tipos
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useFinanceSummary } from '@/hooks/business/useSummaryFinance';
import { useFinanceActions } from '@/hooks/business/useFinanceActions';
import { Sale } from '@/types/sale';
import {
  useProductFilterWithDate,
  DateFilterConfig,
  DateFilterControls,
} from '@/hooks/ui/useDataFilter';

// Componentes de UI existentes
import FinancialSummaryCards from '@/components/features/finance/FinancialSummaryCards';
import SalesTable from '@/components/features/finance/SalesTable';
import { Button } from '@/components/ui/base';
import { GoalCard } from './cards/RevenueGoalCard';
import { ExportButtons } from './ExportButtons';
import { useHydrated } from '@/hooks/ui/useHydrated';

type SearchableSale = Sale & { searchableContent: string };

export default function Finance() {
  const { state: salesState } = useSalesContext();
  const { handleRemoveSale } = useFinanceActions();
  const contentRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  const searchableSales = useMemo((): SearchableSale[] => {
    return salesState.sales.map(sale => ({
      ...sale,
      searchableContent: sale.items.map(item => item.product.name).join(' '),
    }));
  }, [salesState.sales]);

  const salesFilterConfig: DateFilterConfig<SearchableSale> = {
    dateField: 'date',
    searchFields: ['searchableContent'],
    dateFormat: 'iso',
  };

  const {
    filteredItems,
    search,
    setSearch,
    dateRange,
    setDateRange,
    quickDateFilter,
    setQuickDateFilter,
    resetFilters,
    hasActiveFilters,
  } = useProductFilterWithDate(searchableSales, salesFilterConfig);

  const financialSummary = useFinanceSummary(filteredItems);
  const { breakEven, grossProfit } = financialSummary;

  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border bg-gray-50 p-4">
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="search"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Buscar Produto na Venda
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ex: Bolo de chocolate"
              className="focus:border-accent focus:ring-accent rounded-md border-gray-300 p-2 shadow-sm lg:w-2/4"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DateFilterControls
              dateRange={dateRange}
              quickDateFilter={quickDateFilter}
              onDateRangeChange={setDateRange}
              onQuickFilterChange={setQuickDateFilter}
            />
            <ExportButtons financialSummary={financialSummary} sales={filteredItems} />
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4">
            <Button
              onClick={resetFilters}
              variant="link"
              className="text-accent text-sm hover:underline"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      <div ref={contentRef} className="flex flex-col gap-6">
        <GoalCard
          title="Ponto de equilíbrio"
          tooltipText="Indica o valor mínimo de receita para cobrir todos os custos."
          goalValue={breakEven || 0}
          currentValue={grossProfit || 0}
        />

        <FinancialSummaryCards financialSummary={financialSummary} />

        <SalesTable sales={filteredItems} onRemoveSale={handleRemoveSale} />
      </div>
    </div>
  );
}
