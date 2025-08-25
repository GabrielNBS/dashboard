// ============================================================
// 🔹 Hook para Filtragem Reutilizável
// ============================================================

import { useMemo, useState } from 'react';
import { Package } from 'lucide-react';

// Tipos genéricos para filtragem
export interface FilterableItem {
  id?: string;
  uid?: string;
}

// Constraint type para garantir compatibilidade
export type FilterableItemConstraint<T = Record<string, unknown>> = T & FilterableItem;

export interface FilterConfig<T extends FilterableItem> {
  searchFields: (keyof T)[];
  statusField?: keyof T;
  sortFn?: (a: T, b: T) => number;
}

export interface FilterState {
  search: string;
  statusFilter: string;
}

// Hook reutilizável para filtragem
export function useItemFilter<T extends FilterableItem>(
  items: T[],
  config: FilterConfig<T>,
  initialState: FilterState = { search: '', statusFilter: 'all' }
) {
  const [search, setSearch] = useState(initialState.search);
  const [statusFilter, setStatusFilter] = useState(initialState.statusFilter);

  const filteredItems = useMemo(() => {
    const searchLower = search.toLowerCase();

    return items
      .filter(item => {
        // Filtro de busca em múltiplos campos
        const matchesSearch = config.searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(searchLower);
        });

        // Filtro de status (se configurado)
        const matchesStatus =
          !config.statusField ||
          statusFilter === 'all' ||
          item[config.statusField] === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        config.sortFn ||
          ((a, b) => {
            const aKey = (a.id || a.uid || '') as string;
            const bKey = (b.id || b.uid || '') as string;
            return aKey.localeCompare(bKey);
          })
      );
  }, [items, search, statusFilter, config]);

  return {
    // Estados
    search,
    statusFilter,
    filteredItems,

    // Setters
    setSearch,
    setStatusFilter,

    // Utilitários
    resetFilters: () => {
      setSearch('');
      setStatusFilter('all');
    },
    hasActiveFilters: search !== '' || statusFilter !== 'all',
    totalItems: items.length,
    filteredCount: filteredItems.length,
  };
}

// ============================================================
// 🔹 Componente para Container de Resultados
// ============================================================

interface SearchResultsContainerProps<T extends FilterableItem> {
  items: T[];
  isLoading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  renderItem: (item: T, index: number) => React.ReactNode;
  gridCols?: string; // Classes do grid (ex: "sm:grid-cols-2 lg:grid-cols-3")
  className?: string;
}

export function SearchResultsContainer<T extends FilterableItem>({
  items,
  isLoading = false,
  emptyState,
  renderItem,
  gridCols = 'sm:grid-cols-2',
  className = '',
}: SearchResultsContainerProps<T>) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    const defaultEmptyState = {
      icon: <Package className="text-muted-foreground mb-4 h-12 w-12" />,
      title: 'Nenhum item encontrado',
      description: 'Tente ajustar sua busca ou filtros',
    };

    const finalEmptyState = { ...defaultEmptyState, ...emptyState };

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-12">
        {finalEmptyState.icon}
        <h3 className="text-lg font-medium">{finalEmptyState.title}</h3>
        <p className="text-muted-foreground max-w-md text-center">{finalEmptyState.description}</p>
        {finalEmptyState.action && <div className="mt-4">{finalEmptyState.action}</div>}
      </div>
    );
  }

  // Results grid
  return (
    <div className={`grid gap-4 ${gridCols} ${className}`}>
      {items.map((item, index) => {
        const key = (item.id || item.uid || `item-${index}`) as string;
        return <div key={key}>{renderItem(item, index)}</div>;
      })}
    </div>
  );
}

// ============================================================
// 🔹 Componente para Estatísticas de Filtro
// ============================================================

interface FilterStatsProps {
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export function FilterStats({
  totalCount,
  filteredCount,
  hasActiveFilters,
  onClearFilters,
  className = '',
}: FilterStatsProps) {
  if (!hasActiveFilters) return null;

  return (
    <div
      className={`flex items-center justify-between rounded-lg bg-blue-50 p-3 text-sm ${className}`}
    >
      <span className="text-blue-800">
        Mostrando <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> itens
      </span>
      {onClearFilters && (
        <button onClick={onClearFilters} className="font-medium text-blue-600 hover:text-blue-800">
          Limpar filtros
        </button>
      )}
    </div>
  );
}
