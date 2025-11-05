'use client';

import React, { useMemo, useRef } from 'react';

import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useFinanceSummary } from '@/hooks/business/useSummaryFinance';
import { useFinanceActions } from '@/hooks/business/useFinanceActions';
import { Sale } from '@/types/sale';
import { ConfirmationDialog } from '@/components/ui/feedback';

import { useSalesFilter } from '@/hooks/ui/useUnifiedFilter';

import MetroTilesKPIs from '@/components/features/finance/MetroTilesKPIs';
import SalesTable from '@/components/features/finance/SalesTable';
import CollapsibleFilters from '@/components/features/finance/CollapsibleFilters';

// Enhanced sale type with searchable content for filtering
type SearchableSale = Sale & { searchableContent: string };

export default function Finance() {
  const { state: salesState } = useSalesContext();
  const { handleRemoveSale, confirmationState, hideConfirmation, handleConfirm } =
    useFinanceActions();
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Conteúdo Principal */}
      <div ref={contentRef} className="flex flex-col gap-4 sm:gap-6">
        {/* KPIs em Metro Tiles */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 sm:text-base">Resumo Financeiro</h3>
          <p className="text-muted-foreground text-xs">
            Clique no card &quot;Ponto de equilíbrio&quot; para ver análise detalhada
          </p>
          <MetroTilesKPIs financialSummary={financialSummary} />
        </div>

        {/* Filtros Colapsáveis */}
        <CollapsibleFilters
          search={search}
          setSearch={setSearch}
          dateRange={dateRange}
          setDateRange={setDateRange}
          quickDateFilter={quickDateFilter}
          setQuickDateFilter={setQuickDateFilter}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          financialSummary={financialSummary}
          sales={filteredItems}
        />

        <div className="flex flex-col gap-4 sm:gap-6">
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
    </>
  );
}
