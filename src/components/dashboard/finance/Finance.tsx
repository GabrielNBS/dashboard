'use client';

import React, { useMemo } from 'react'; // Adicionado useMemo

// Hooks existentes e tipos
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useFinanceSummary } from '@/lib/hooks/business/useSummaryFinance';
import { useFinanceActions } from '@/lib/hooks/business/useFinanceActions';
import { Sale } from '@/types/sale'; // Supondo que o tipo Sale venha daqui
import {
  useProductFilterWithDate,
  DateFilterConfig,
  DateFilterControls,
} from '@/lib/hooks/ui/useDataFilter';

// Componentes de UI existentes
import FinancialSummaryCards from '@/components/features/finance/FinancialSummaryCards';
import SalesTable from '@/components/features/finance/SalesTable';

// Estendemos o tipo Sale localmente para incluir nossa propriedade de busca
type SearchableSale = Sale & { searchableContent: string };

export default function Finance() {
  const { state: salesState } = useSalesContext();
  const { handleRemoveSale } = useFinanceActions();

  // 2. PREPARA OS DADOS PARA O HOOK GENÉRICO
  // Usamos useMemo para performance, evitando recalcular a cada renderização
  const searchableSales = useMemo((): SearchableSale[] => {
    return salesState.sales.map(sale => ({
      ...sale,
      // Criamos um campo único com todos os nomes de produtos para a busca
      searchableContent: sale.items.map(item => item.product.name).join(' '),
    }));
  }, [salesState.sales]);

  // 3. DEFINE A CONFIGURAÇÃO PARA O HOOK
  // Dizemos ao hook como ele deve filtrar e ordenar os dados de 'Sale'
  const salesFilterConfig: DateFilterConfig<SearchableSale> = {
    dateField: 'date', // O campo de data é 'date'
    searchFields: ['searchableContent'], // A busca deve ser feita no nosso novo campo
    dateFormat: 'iso', // O formato da data é ISO string
  };

  // 4. CHAMA O HOOK GENÉRICO
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
  } = useProductFilterWithDate(
    searchableSales, // Passa os dados preparados
    salesFilterConfig // Passa o objeto de configuração
  );

  // O resumo financeiro continua usando a lista filtrada
  const financialSummary = useFinanceSummary(filteredItems);

  // O restante do componente permanece exatamente igual
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
              className="focus:border-accent focus:ring-accent w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>
          <DateFilterControls
            dateRange={dateRange}
            quickDateFilter={quickDateFilter}
            onDateRangeChange={setDateRange}
            onQuickFilterChange={setQuickDateFilter}
            className="flex flex-wrap items-center gap-2"
          />
        </div>
        {hasActiveFilters && (
          <div className="mt-4">
            <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
      <FinancialSummaryCards financialSummary={financialSummary} />

      <SalesTable sales={filteredItems} onRemoveSale={handleRemoveSale} />
    </div>
  );
}
