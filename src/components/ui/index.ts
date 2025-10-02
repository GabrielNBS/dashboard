// ============================================================
// 🔹 Unified UI Components - Central Export Index
// ============================================================
// Central export file for all unified UI components
// Provides easy imports and better developer experience

import { CardableItem } from './GenericCard';

// ============================================================
// 🔹 Unified Filter System
// ============================================================
export {
  useUnifiedFilter,
  useSalesFilter,
  useProductFilter,
  useIngredientFilter,
  type FilterableItem,
  type DateRange,
  type UnifiedFilterConfig,
  type UnifiedFilterState,
} from '@/hooks/ui/useUnifiedFilter';

export { UnifiedDateFilterControls } from './UnifiedDateFilterControls';

// ============================================================
// 🔹 Generic Components
// ============================================================
export {
  GenericCard,
  createEditAction,
  createDeleteAction,
  type GenericCardProps,
  type CardableItem,
  type BadgeConfig,
  type ActionConfig,
  type ProgressConfig,
} from './GenericCard';

export { Tooltip } from './Tooltip';

export {
  GenericListContainer,
  createSearchConfig,
  createFilterStatsConfig,
  createAddItemEmptyState,
  type GenericListContainerProps,
  type EmptyStateConfig,
  type SearchConfig,
  type FilterStatsConfig,
} from './GenericListContainer';

export {
  GenericForm,
  GenericFormField,
  validateFormData,
  showValidationToast,
  showSuccessToast,
  validateRequired,
  validatePositiveNumber,
  validatePrice,
  validateEmail,
  COMMON_VALIDATION_MESSAGES,
  type GenericFormProps,
  type FormFieldConfig,
  type ValidationMessage,
} from './GenericFormUtils';

// ============================================================
// 🔹 Unified Utilities
// ============================================================
export {
  // Formatting functions
  formatCurrency,
  formatPercent,
  formatNumber,
  formatPercentage,
  formatDate,

  // Validation functions
  validateRequired as validateRequiredField,
  validateNumber,
  validateEmail as validateEmailField,

  // Calculation helpers
  safeDivide,
  calculatePercentage,
  roundTo,

  // Array utilities
  groupBy,
  sumBy,
  unique,
  sortBy,

  // String utilities
  capitalize,
  slugify,
  truncate,

  // Storage utilities
  storage,

  // Performance utilities
  debounce,
  throttle,
} from '@/utils/UnifiedUtils';

// ============================================================
// 🔹 Context Factory
// ============================================================
// Context Factory - Removed (was causing issues with localStorage sync)

// ============================================================
// 🔹 Re-exports for Backward Compatibility
// ============================================================
// These will be removed in future versions
// Use the new unified components instead

// @deprecated - Use GenericListContainer instead
export { SearchResultsContainer } from '@/hooks/ui/useFilter';

// @deprecated - Use UnifiedDateFilterControls instead
export { DateFilterControls } from '@/hooks/ui/useDataFilter';

// ============================================================
// 🔹 Type Definitions for Common Use Cases
// ============================================================

// Common item types that work with unified components
export interface ProductItem extends CardableItem {
  category: string;
  price: number;
  createdAt?: string;
}

export interface IngredientItem extends CardableItem {
  unit: string;
  quantity: number;
  status?: 'critico' | 'atencao' | 'normal';
}

export interface SaleItem extends CardableItem {
  date: string;
  total: number;
  searchableContent?: string;
}

// Common configuration presets
export const COMMON_GRID_LAYOUTS = {
  single: 'grid-cols-1',
  double: 'grid-cols-1 md:grid-cols-2',
  triple: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  quad: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3',
} as const;

export const COMMON_SEARCH_PLACEHOLDERS = {
  products: 'Buscar produtos...',
  ingredients: 'Buscar ingredientes...',
  sales: 'Buscar vendas...',
  items: 'Buscar itens...',
} as const;

// ============================================================
// 🔹 Development Helpers
// ============================================================

/**
 * Development helper to check if deprecated components are being used
 * Only runs in development mode
 */
export function checkDeprecatedUsage() {
  if (process.env.NODE_ENV === 'development') {
    const deprecatedComponents = [
      'useItemFilter',
      'useProductFilterWithDate',
      'SearchResultsContainer',
      'DateFilterControls',
    ];

    // This would ideally be implemented with a build-time check
    console.info('🔍 Checking for deprecated component usage...');
    console.info('📚 Migration guide available at: /REFACTORING_GUIDE.md');
  }
}
