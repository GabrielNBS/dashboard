// ============================================================
// 🚨 DEPRECATED - Use useUnifiedFilter.tsx instead
// ============================================================
// This file has been deprecated in favor of the new unified filtering system.
//
// Migration Guide:
// - Replace `useProductFilterWithDate` with `useSalesFilter` or `useUnifiedFilter`
// - Replace `DateFilterControls` with `UnifiedDateFilterControls`
//
// New imports:
// import { useUnifiedFilter, useSalesFilter } from '@/hooks/ui/useUnifiedFilter';
// import { UnifiedDateFilterControls } from '@/components/ui/UnifiedDateFilterControls';
//
// This file will be removed in a future version.

export * from './useDataFilter';

console.warn(
  '⚠️  DEPRECATED: useDataFilter.tsx is deprecated. Please migrate to useUnifiedFilter.tsx'
);
