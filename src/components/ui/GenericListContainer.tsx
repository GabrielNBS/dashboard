// ============================================================
// 🔹 Generic List Container Component
// ============================================================
// Reusable list container that eliminates duplication between
// ProductsList, IngredientList, and other similar list components

import React from 'react';
import { Package, Plus } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import SearchInput from '@/components/ui/forms/SearchInput';
import { FilterableItem } from '@/hooks/ui/useUnifiedFilter';

// Empty state configuration
export interface EmptyStateConfig {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

// Search configuration
export interface SearchConfig {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Filter statistics configuration
export interface FilterStatsConfig {
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onClearFilters?: () => void;
  itemName: string; // e.g., "produto", "ingrediente"
  itemNamePlural: string; // e.g., "produtos", "ingredientes"
}

// Main list container props
export interface GenericListContainerProps<T extends FilterableItem> {
  // Data
  items: T[];
  isLoading?: boolean;

  // Search functionality
  search?: SearchConfig;

  // Filter statistics
  filterStats?: FilterStatsConfig;

  // Empty state
  emptyState?: EmptyStateConfig;

  // Item rendering
  renderItem: (item: T, index: number) => React.ReactNode;

  // Layout configuration
  gridCols?: string;
  className?: string;

  // Header content (additional filters, buttons, etc.)
  headerContent?: React.ReactNode;

  // Summary content (category summaries, etc.)
  summaryContent?: React.ReactNode;
}

/**
 * Generic list container component
 * Handles loading states, empty states, search, filtering, and item rendering
 * Eliminates duplication across different list implementations
 *
 * @param items - Array of items to display
 * @param isLoading - Loading state
 * @param search - Search configuration
 * @param filterStats - Filter statistics configuration
 * @param emptyState - Empty state configuration
 * @param renderItem - Function to render each item
 * @param gridCols - CSS grid column classes
 * @param className - Additional CSS classes
 * @param headerContent - Additional header content
 * @param summaryContent - Summary content to show after items
 */
export function GenericListContainer<T extends FilterableItem>({
  items,
  isLoading = false,
  search,
  filterStats,
  emptyState,
  renderItem,
  gridCols = 'sm:grid-cols-2',
  className = '',
  headerContent,
  summaryContent,
}: GenericListContainerProps<T>) {
  // Default empty state configuration
  const defaultEmptyState: EmptyStateConfig = {
    icon: <Package className="text-muted-foreground mb-4 h-12 w-12" />,
    title: 'Nenhum item encontrado',
    description: 'Tente ajustar sua busca ou filtros',
  };

  const finalEmptyState = { ...defaultEmptyState, ...emptyState };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <div className="flex flex-col items-center space-y-2">
          <div className="border-muted-foreground border-t-accent h-8 w-8 animate-spin rounded-full border-2"></div>
          <p className="text-muted text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* Statistics Row */}
        {filterStats && (
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              {filterStats.totalCount}{' '}
              {filterStats.totalCount === 1 ? filterStats.itemName : filterStats.itemNamePlural}{' '}
              cadastrado
              {filterStats.totalCount !== 1 ? 's' : ''}
            </span>
            {filterStats.hasActiveFilters && (
              <span className="text-accent text-sm">
                • {filterStats.filteredCount} encontrado
                {filterStats.filteredCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Filters and Search Row */}
        <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Additional header content (filters) */}
          {headerContent}

          {/* Search input */}
          {search && (
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <SearchInput
                placeholder={search.placeholder}
                value={search.value}
                onChange={search.onChange}
                className={search.className || 'w-full sm:w-80'}
              />
            </div>
          )}
        </div>

        {/* Filter statistics with clear button */}
        {filterStats?.hasActiveFilters && (
          <div className="bg-accent/50 flex flex-col gap-2 rounded-lg p-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-primary">
              Mostrando <strong>{filterStats.filteredCount}</strong> de{' '}
              <strong>{filterStats.totalCount}</strong> {filterStats.itemNamePlural}
            </span>
            {filterStats.onClearFilters && (
              <Button
                onClick={filterStats.onClearFilters}
                variant="link"
                size="sm"
                className="text-primary hover:text-primary/80 cursor-pointer text-left font-medium sm:text-right"
                type="button"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      {items.length === 0 ? (
        // Empty state
        <div className="bg-muted flex flex-col items-center justify-center gap-4 rounded-lg px-4 py-8 sm:py-12">
          {finalEmptyState.icon}
          <h3 className="text-center text-lg font-medium">{finalEmptyState.title}</h3>
          <p className="text-muted-foreground text-center text-sm sm:text-base">
            {finalEmptyState.description}
          </p>
          {finalEmptyState.action && (
            <div className="mt-2 sm:mt-4">
              <Button onClick={finalEmptyState.action.onClick} className="flex items-center gap-2">
                {finalEmptyState.action.icon || <Plus className="h-4 w-4" />}
                {finalEmptyState.action.label}
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Items grid
        <div className={`grid gap-4 ${gridCols}`}>
          {items.map((item, index) => {
            const key = (item.id || item.uid || `item-${index}`) as string;
            return <div key={key}>{renderItem(item, index)}</div>;
          })}
        </div>
      )}

      {/* Summary content (category summaries, etc.) */}
      {summaryContent && items.length > 0 && summaryContent}
    </div>
  );
}

// ============================================================
// 🔹 Utility functions for common list configurations
// ============================================================

/**
 * Create search configuration for common use cases
 */
export function createSearchConfig(
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
  className?: string
): SearchConfig {
  return {
    placeholder,
    value,
    onChange,
    className,
  };
}

/**
 * Create filter statistics configuration
 */
export function createFilterStatsConfig(
  totalCount: number,
  filteredCount: number,
  hasActiveFilters: boolean,
  itemName: string,
  itemNamePlural: string,
  onClearFilters?: () => void
): FilterStatsConfig {
  return {
    totalCount,
    filteredCount,
    hasActiveFilters,
    onClearFilters,
    itemName,
    itemNamePlural,
  };
}

/**
 * Create empty state configuration for adding new items
 */
export function createAddItemEmptyState(
  itemName: string,
  onAdd: () => void,
  hasSearch = false,
  searchTerm = ''
): EmptyStateConfig {
  return {
    icon: <Package className="text-muted-foreground mb-4 h-16 w-16" />,
    title:
      hasSearch && searchTerm ? `Nenhum ${itemName} encontrado` : `Nenhum ${itemName} cadastrado`,
    description:
      hasSearch && searchTerm
        ? `Não encontramos ${itemName}s que contenham "${searchTerm}". Tente ajustar sua busca.`
        : `Comece adicionando seu primeiro ${itemName} à lista.`,
    action: {
      label: hasSearch && searchTerm ? `Adicionar ${itemName}` : `Adicionar Primeiro ${itemName}`,
      onClick: onAdd,
      icon: <Plus className="h-4 w-4" />,
    },
  };
}
