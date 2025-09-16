# Dashboard Project Refactoring Plan

## Current Analysis

### Issues Identified:

1. **Large components**: RegisterSaleForm (454 lines), Finance (126 lines), FinancialSettingsSection (248 lines)
2. **Mixed UI components**: Basic UI components mixed with business-specific components
3. **Inconsistent component organization**: Some components are domain-specific, others are generic
4. **Potential code duplication**: Similar patterns across components

## New Folder Structure

```
src/
├── app/                          # Next.js 15 app directory (unchanged)
│   ├── (dashboard)/              # Route groups for better organization
│   │   ├── dashboard/
│   │   ├── store/
│   │   ├── product/
│   │   ├── pdv/
│   │   ├── finance/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                       # Generic reusable UI components
│   │   ├── base/                 # Basic components (Button, Input, etc.)
│   │   ├── forms/                # Form-specific components
│   │   ├── feedback/             # Toast, modals, alerts
│   │   └── layout/               # Layout helpers
│   ├── business/                 # Domain-specific reusable components
│   │   ├── finance/              # Financial components
│   │   ├── inventory/            # Inventory management
│   │   ├── products/             # Product management
│   │   └── sales/                # Sales-related components
│   ├── features/                 # Feature-specific components (organized by domain)
│   │   ├── dashboard/
│   │   │   ├── MetricsCards/
│   │   │   ├── Charts/
│   │   │   └── Summary/
│   │   ├── pdv/
│   │   │   ├── Cart/
│   │   │   ├── ProductCatalog/
│   │   │   ├── Payment/
│   │   │   └── SaleProcess/
│   │   ├── finance/
│   │   │   ├── Reports/
│   │   │   ├── Cards/
│   │   │   └── Tables/
│   │   ├── inventory/
│   │   │   ├── IngredientManagement/
│   │   │   └── StockControl/
│   │   ├── products/
│   │   │   ├── ProductBuilder/
│   │   │   ├── ProductList/
│   │   │   └── ProductForm/
│   │   └── settings/
│   │       ├── StoreSettings/
│   │       ├── FinancialSettings/
│   │       ├── SystemSettings/
│   │       └── CostSettings/
│   └── layout/                   # Layout-specific components
│       ├── Navigation/
│       └── Headers/
├── lib/
│   ├── utils/                    # Core utilities
│   │   ├── calculations/         # Mathematical calculations
│   │   ├── formatting/           # Data formatting
│   │   ├── validation/           # Data validation
│   │   └── helpers/              # General helpers
│   ├── hooks/                    # Custom React hooks
│   │   ├── business/             # Business logic hooks
│   │   └── ui/                   # UI-related hooks
│   └── constants/                # Application constants
├── types/                        # TypeScript type definitions (unchanged)
├── contexts/                     # React contexts (unchanged structure)
├── styles/                       # Styling (unchanged)
└── schemas/                      # Zod schemas (unchanged)
```

## Refactoring Strategy

### Phase 1: Break Down Large Components

1. **RegisterSaleForm** → Split into:

   - ProductCatalog component
   - Cart component
   - PaymentConfiguration component
   - SaleProcess hook

2. **Finance** → Split into:

   - FinancialSummaryCards component
   - SalesTable component
   - FinancialActions component

3. **FinancialSettingsSection** → Split into:
   - ProfitMarginSettings component
   - ReserveSettings component
   - SalesGoalSettings component
   - CurrencySettings component

### Phase 2: Create Reusable Business Components

1. Extract common card patterns
2. Create reusable table components
3. Build consistent form patterns
4. Standardize modal/drawer patterns

### Phase 3: Organize Utilities

1. Group calculation functions by domain
2. Create formatting utilities
3. Extract validation patterns
4. Build helper functions library

### Phase 4: Improve Type Safety

1. Create more specific type definitions
2. Add generic types for reusable components
3. Improve error handling types

## Benefits

1. **Better Maintainability**: Smaller, focused components are easier to understand and modify
2. **Improved Reusability**: Business components can be reused across features
3. **Easier Testing**: Smaller components are easier to unit test
4. **Better Code Organization**: Clear separation between UI, business logic, and utilities
5. **Scalability**: New features can be added following established patterns
6. **Developer Experience**: Easier to find and modify code

## Implementation Order

1. ✅ Create folder structure
2. ✅ Break down RegisterSaleForm component
3. ✅ Refactor Finance component
4. ✅ Refactor Settings components
5. ✅ Move and organize utility functions
6. ✅ Create reusable business components
7. ✅ Update imports throughout the project
8. ✅ Verify all functionality works
9. ✅ Clean up unused code
