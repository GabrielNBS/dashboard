// ============================================================
// 🔹 Unified Filter Hook - Consolidates all filtering logic
// ============================================================
// This hook replaces both useFilter.tsx and useDataFilter.tsx
// Provides comprehensive filtering with search, status, date ranges, and sorting

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';

// Base interface that all filterable items must implement
export interface FilterableItem {
  id?: string;
  uid?: string;
}

// Date range configuration for temporal filtering
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

// Comprehensive filter configuration
export interface UnifiedFilterConfig<T extends FilterableItem> {
  // Text search configuration
  searchFields: (keyof T)[];

  // Status/category filtering
  statusField?: keyof T;

  // Date filtering configuration
  dateField?: keyof T;
  dateFormat?: 'iso' | 'timestamp' | 'string';

  // Custom sorting function
  sortFn?: (a: T, b: T) => number;
}

// Complete filter state
export interface UnifiedFilterState {
  search: string;
  statusFilter: string;
  dateRange: DateRange;
  quickDateFilter: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year';
}

// Date utility functions - centralized date handling logic
const dateUtils = {
  // Parse different date formats into Date objects
  parseDate: (value: unknown, format: 'iso' | 'timestamp' | 'string' = 'iso'): Date | null => {
    if (!value) return null;

    try {
      switch (format) {
        case 'timestamp':
          return new Date(Number(value));
        case 'string':
          return new Date(String(value));
        case 'iso':
        default:
          return new Date(String(value));
      }
    } catch {
      return null;
    }
  },

  // Check if date falls within specified range
  isDateInRange: (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
    if (!startDate && !endDate) return true;

    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (startDate && endDate) {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      return targetDate >= start && targetDate <= end;
    }

    if (startDate) {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      return targetDate >= start;
    }

    if (endDate) {
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      return targetDate <= end;
    }

    return true;
  },

  // Generate predefined date ranges for quick filtering
  getQuickDateRange: (type: string): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (type) {
      case 'today':
        return { startDate: today, endDate: today };
      case 'week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { startDate: startOfWeek, endDate: today };
      }
      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { startDate: startOfMonth, endDate: today };
      }
      case 'quarter': {
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return { startDate: quarterStart, endDate: today };
      }
      case 'year': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return { startDate: startOfYear, endDate: today };
      }
      default:
        return { startDate: null, endDate: null };
    }
  },
};

/**
 * Unified filter hook that handles all types of filtering
 * Replaces both useFilter and useDataFilter hooks
 *
 * @param items - Array of items to filter
 * @param config - Filter configuration object
 * @param initialState - Initial filter state
 * @returns Comprehensive filter state and controls
 */
export function useUnifiedFilter<T extends FilterableItem>(
  items: T[],
  config: UnifiedFilterConfig<T>,
  initialState: Partial<UnifiedFilterState> = {}
) {
  // Initialize state with defaults
  const defaultState: UnifiedFilterState = {
    search: '',
    statusFilter: 'all',
    dateRange: { startDate: null, endDate: null },
    quickDateFilter: 'all',
    ...initialState,
  };

  const [search, setSearch] = useState(defaultState.search);
  const [statusFilter, setStatusFilter] = useState(defaultState.statusFilter);
  const [dateRange, setDateRange] = useState<DateRange>(defaultState.dateRange);
  const [quickDateFilter, setQuickDateFilter] = useState(defaultState.quickDateFilter);

  // Debounce search para evitar re-renders excessivos
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 150); // 150ms de debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Stable setters para evitar re-renders desnecessários
  const stableSetSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const stableSetStatusFilter = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const stableResetFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setDateRange({ startDate: null, endDate: null });
    setQuickDateFilter('all');
  }, []);

  // Main filtering logic - memoized for performance
  const filteredItems = useMemo(() => {
    const searchLower = debouncedSearch.toLowerCase();

    // Determine effective date range (quick filter takes precedence)
    const effectiveDateRange =
      quickDateFilter !== 'all' ? dateUtils.getQuickDateRange(quickDateFilter) : dateRange;

    return items
      .filter(item => {
        // Text search across multiple fields
        const matchesSearch = config.searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(searchLower);
        });

        // Status/category filtering
        const matchesStatus =
          !config.statusField ||
          statusFilter === 'all' ||
          item[config.statusField] === statusFilter;

        // Date range filtering
        const matchesDate = (() => {
          if (!config.dateField) return true;

          const dateValue = item[config.dateField];
          if (!dateValue) return true;

          const parsedDate = dateUtils.parseDate(dateValue, config.dateFormat);
          if (!parsedDate) return true;

          return dateUtils.isDateInRange(
            parsedDate,
            effectiveDateRange.startDate,
            effectiveDateRange.endDate
          );
        })();

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort(
        config.sortFn ||
          ((a, b) => {
            // Default sorting: by date (newest first) or by ID
            if (config.dateField) {
              const dateA = dateUtils.parseDate(a[config.dateField], config.dateFormat);
              const dateB = dateUtils.parseDate(b[config.dateField], config.dateFormat);

              if (dateA && dateB) {
                return dateB.getTime() - dateA.getTime();
              }
            }

            // Fallback to ID/UID sorting
            const aKey = (a.id || a.uid || '') as string;
            const bKey = (b.id || b.uid || '') as string;
            return aKey.localeCompare(bKey);
          })
      );
  }, [items, debouncedSearch, statusFilter, dateRange, quickDateFilter, config]);

  // Enhanced date filter handlers
  const setQuickDateFilterWithRange = useCallback(
    (filter: UnifiedFilterState['quickDateFilter']) => {
      setQuickDateFilter(filter);
      if (filter !== 'all') {
        setDateRange({ startDate: null, endDate: null }); // Clear custom range
      }
    },
    []
  );

  const setCustomDateRange = useCallback((range: DateRange) => {
    setDateRange(range);
    setQuickDateFilter('all'); // Clear quick filter
  }, []);

  // Check if any filters are currently active
  const hasActiveFilters = useMemo(
    () =>
      search !== '' ||
      statusFilter !== 'all' ||
      quickDateFilter !== 'all' ||
      dateRange.startDate !== null ||
      dateRange.endDate !== null,
    [search, statusFilter, quickDateFilter, dateRange]
  );

  return {
    // Current filter state
    search,
    statusFilter,
    dateRange,
    quickDateFilter,
    filteredItems,

    // State setters (stable references)
    setSearch: stableSetSearch,
    setStatusFilter: stableSetStatusFilter,
    setDateRange: setCustomDateRange,
    setQuickDateFilter: setQuickDateFilterWithRange,

    // Utility functions
    resetFilters: stableResetFilters,
    hasActiveFilters,

    // Statistics
    totalItems: items.length,
    filteredCount: filteredItems.length,

    // Advanced utilities
    getEffectiveDateRange: useCallback(
      () => (quickDateFilter !== 'all' ? dateUtils.getQuickDateRange(quickDateFilter) : dateRange),
      [quickDateFilter, dateRange]
    ),
    dateUtils, // Export for external use
  };
}

// ============================================================
// 🔹 Specialized hooks for common use cases
// ============================================================

/**
 * Specialized hook for product filtering
 * Pre-configured for common product filtering scenarios
 */
export function useProductFilter<
  T extends FilterableItem & { name: string; category: string; createdAt?: string },
>(products: T[], initialFilters?: Partial<UnifiedFilterState>) {
  return useUnifiedFilter(
    products,
    {
      searchFields: ['name', 'category'],
      statusField: 'status' as keyof T,
      dateField: 'createdAt' as keyof T,
      dateFormat: 'iso',
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    initialFilters
  );
}

/**
 * Specialized hook for ingredient filtering
 * Pre-configured for ingredient management scenarios
 */
export function useIngredientFilter<T extends FilterableItem & { name: string; status?: string }>(
  ingredients: T[],
  initialFilters?: Partial<UnifiedFilterState>
) {
  return useUnifiedFilter(
    ingredients,
    {
      searchFields: ['name'],
      statusField: 'status' as keyof T,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    initialFilters
  );
}

/**
 * Specialized hook for sales filtering (like in Finance component)
 * Pre-configured for financial data filtering
 */
export function useSalesFilter<
  T extends FilterableItem & { date: string; searchableContent?: string },
>(sales: T[], initialFilters?: Partial<UnifiedFilterState>) {
  return useUnifiedFilter(
    sales,
    {
      searchFields: ['searchableContent'] as (keyof T)[],
      dateField: 'date',
      dateFormat: 'iso',
      sortFn: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    initialFilters
  );
}
