// ============================================================
// 🚨 DEPRECATED - Use useUnifiedFilter.tsx instead
// ============================================================
// This file has been deprecated in favor of the new unified filtering system.
//
// Migration Guide:
// - Replace `useItemFilter` with `useUnifiedFilter`
// - Replace `SearchResultsContainer` with `GenericListContainer`
// - Replace `FilterStats` with the new filter stats configuration
//
// New imports:
// import { useUnifiedFilter, useProductFilter, useIngredientFilter } from '@/hooks/ui/useUnifiedFilter';
// import { GenericListContainer } from '@/components/ui/GenericListContainer';
//
// This file will be removed in a future version.

export * from './useFilter';

console.warn('⚠️  DEPRECATED: useFilter.tsx is deprecated. Please migrate to useUnifiedFilter.tsx');
