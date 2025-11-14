import React from 'react';
import { Package, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const GenericListSkeleton = React.lazy(() => import('./skeletons/GenericListSkeleton'));
    return (
      <React.Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="flex flex-col items-center space-y-2">
              <div className="border-muted-foreground border-t-accent h-8 w-8 animate-spin rounded-full border-2"></div>
              <p className="text-muted-foreground text-sm">Carregando...</p>
            </div>
          </div>
        }
      >
        <GenericListSkeleton gridCols={gridCols} />
      </React.Suspense>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* Filters and Search Row */}
        <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* QuickFilters (headerContent) */}
          <AnimatePresence mode="wait">
            {headerContent && (
              <motion.div
                key="quick-filters"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap items-center gap-3"
              >
                {headerContent}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={false}
            animate={{
              opacity: filterStats?.hasActiveFilters ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className={`lg:flex-1 lg:px-3 ${filterStats?.hasActiveFilters ? '' : 'pointer-events-none'}`}
          >
            <div className="bg-accent/50 flex flex-col gap-2 rounded-lg p-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <span className="text-primary">
                Mostrando <strong>{filterStats?.filteredCount || 0}</strong> de{' '}
                <strong>{filterStats?.totalCount || 0}</strong>{' '}
                {filterStats?.itemNamePlural || 'itens'}
              </span>
              {filterStats?.onClearFilters && (
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
          </motion.div>

          {/* Search input */}
          {search && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full lg:w-auto lg:flex-shrink-0"
            >
              <SearchInput
                placeholder={search.placeholder}
                value={search.value}
                onChange={search.onChange}
                className={search.className || 'w-full sm:w-80'}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          // Empty state
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/50 flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg px-4 py-8"
          >
            {finalEmptyState.icon}
            <h3 className="text-center text-lg font-medium">{finalEmptyState.title}</h3>
            <p className="text-muted-foreground text-center text-sm sm:text-base">
              {finalEmptyState.description}
            </p>
            {finalEmptyState.action && (
              <div className="mt-2 sm:mt-4">
                <Button
                  onClick={finalEmptyState.action.onClick}
                  className="flex items-center gap-2"
                >
                  {finalEmptyState.action.icon || <Plus className="h-4 w-4" />}
                  {finalEmptyState.action.label}
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          // Items grid
          <motion.div
            key="items-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-4 ${gridCols}`}
          >
            {items.map((item, index) => {
              const key = (item.id || item.uid || `item-${index}`) as string;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {renderItem(item, index)}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary content (category summaries, etc.) */}
      {summaryContent && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {summaryContent}
        </motion.div>
      )}
    </div>
  );
}

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
