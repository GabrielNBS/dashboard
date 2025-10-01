'use client';

import React, { useMemo, useRef } from 'react';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useFinanceSummary } from '@/hooks/business/useSummaryFinance';
import { useFinanceActions } from '@/hooks/business/useFinanceActions';
import { Sale } from '@/types/sale';
import { ConfirmationDialog } from '@/components/ui/feedback';

import { useSalesFilter } from '@/hooks/ui/useUnifiedFilter';
import { UnifiedDateFilterControls } from '@/components/ui/UnifiedDateFilterControls';

import FinancialSummaryCards from '@/components/features/finance/FinancialSummaryCards';
import SalesTable from '@/components/features/finance/SalesTable';
import { Button } from '@/components/ui/base';
import { GoalCard } from './cards/RevenueGoalCard';
import { ExportButtons } from './ExportButtons';
import { useHydrated } from '@/hooks/ui/useHydrated';

// Enhanced sale type with searchable content for filtering
type SearchableSale = Sale & { searchableContent: string };

export default function Finance() {
  const { state: salesState } = useSalesContext();
  const { handleRemoveSale, confirmationState, hideConfirmation, handleConfirm } =
    useFinanceActions();
  const contentRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  // Create searchable sales data - memoized for performance
  const searchableSales = useMemo((): SearchableSale[] => {
    return salesState.sales.map(sale => ({
      ...sale,
      searchableContent: sale.items.map(item => item.product.name).join(' '),
    }));
  }, [salesState.sales]);

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
  } = useSalesFilter(searchableSales);

  const financialSummary = useFinanceSummary(filteredItems);
  const { breakEven, grossProfit } = financialSummary;

  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Filtros e Busca */}
      <div className="bg-primary rounded-lg p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <label htmlFor="search" className="text-secondary/60 mb-1 block text-sm font-medium">
              Buscar Produto na Venda
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ex: Bolo de chocolate"
              className="bg-muted focus:border-accent focus:ring-accent w-full rounded-md border-gray-300 p-2 shadow-sm sm:p-3 lg:w-2/4"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Controles de Data */}
            <div className="flex-1">
              <UnifiedDateFilterControls
                dateRange={dateRange}
                quickDateFilter={quickDateFilter}
                onDateRangeChange={setDateRange}
                onQuickFilterChange={setQuickDateFilter}
              />
            </div>

            {/* Botões de Export */}
            <div className="flex-shrink-0">
              <ExportButtons financialSummary={financialSummary} sales={filteredItems} />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 sm:mt-4">
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

      {/* Conteúdo Principal */}
      <div ref={contentRef} className="flex flex-col gap-4 sm:gap-6">
        {/* Card de Meta - Destaque especial */}
        <div className="rounded-xl bg-white p-1 shadow-sm">
          <GoalCard
            title="Ponto de equilíbrio"
            tooltipText="Indica o valor mínimo de receita para cobrir todos os custos."
            goalValue={breakEven || 0}
            currentValue={grossProfit || 0}
          />
        </div>

        {/* Cards de Resumo Financeiro */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 sm:text-base">Resumo Financeiro</h3>
          <FinancialSummaryCards financialSummary={financialSummary} />
        </div>

        {/* Tabela de Vendas */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 sm:text-base">Histórico de Vendas</h3>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <SalesTable sales={filteredItems} onRemoveSale={handleRemoveSale} />
          </div>
        </div>
      </div>

      {/* Dialog de confirmação */}
      {confirmationState && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          description={confirmationState.description}
          variant={confirmationState.variant}
          confirmText={confirmationState.confirmText}
          confirmButtonText={confirmationState.confirmButtonText}
          cancelButtonText={confirmationState.cancelButtonText}
        />
      )}
    </div>
  );
}
