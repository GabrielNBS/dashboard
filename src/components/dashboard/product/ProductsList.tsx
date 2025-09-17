// ============================================================
// 🔹 Updated ProductsList Component - Using Unified Components
// ============================================================
// This component has been refactored to use the new unified
// list container and filtering system

import React, { useMemo } from 'react';
import Button from '@/components/ui/base/Button';
import { useProductContext } from '@/contexts/products/ProductContext';
import { ProductState } from '@/types/products';
import { ProductCard } from './ProductCard';
import { Package, Plus } from 'lucide-react';

// New unified components - replacing old duplicated logic
import { useProductFilter } from '@/hooks/ui/useUnifiedFilter';
import {
  GenericListContainer,
  createSearchConfig,
  createFilterStatsConfig,
  createAddItemEmptyState,
} from '@/components/ui/GenericListContainer';

// Main ProductsList component - now using unified filtering and list container
const ProductsList: React.FC = () => {
  const { state, dispatch } = useProductContext();

  // Use the new unified product filter hook
  const {
    search,
    filteredItems: filteredProducts,
    setSearch,
    resetFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
  } = useProductFilter(state?.products || []);

  // Loading state handled by GenericListContainer
  if (!state) {
    return <GenericListContainer items={[]} isLoading={true} renderItem={() => null} />;
  }

  // Ações dos produtos
  const handleRemoveProduct = (productId: string): void => {
    const product = state.products.find(p => p.uid === productId);
    if (product) {
      const confirmDelete = window.confirm(
        `Tem certeza que deseja remover o produto ${product.name}?`
      );
      if (confirmDelete) {
        dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
      }
    }
  };

  const handleSetProductToEdit = (product: ProductState): void => {
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
    setTimeout(() => {
      dispatch({ type: 'SET_PRODUCT_TO_EDIT', payload: product });
    }, 0);
  };

  const handleAddProduct = () => {
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  // Create configuration objects for the unified list container
  const searchConfig = createSearchConfig('Buscar produtos...', search, setSearch, 'sm:w-64');

  const filterStatsConfig = createFilterStatsConfig(
    totalItems,
    filteredCount,
    hasActiveFilters,
    'produto',
    'produtos',
    resetFilters
  );

  const emptyStateConfig = createAddItemEmptyState('produto', handleAddProduct, !!search, search);

  return (
    <GenericListContainer
      items={filteredProducts}
      search={searchConfig}
      filterStats={filterStatsConfig}
      emptyState={emptyStateConfig}
      renderItem={product => (
        <ProductCard
          product={product}
          onEdit={handleSetProductToEdit}
          onRemove={handleRemoveProduct}
        />
      )}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3"
      summaryContent={
        filteredProducts.length > 0 ? <CategorySummary products={filteredProducts} /> : undefined
      }
    />
  );
};

// Componente adicional para resumo por categoria
interface CategorySummaryProps {
  products: ProductState[];
}

const CategorySummary: React.FC<CategorySummaryProps> = ({ products }) => {
  const categorySummary = useMemo(() => {
    const summary = products.reduce(
      (acc, product) => {
        const category = product.category || 'Sem categoria';
        if (!acc[category]) {
          acc[category] = {
            count: 0,
            totalValue: 0,
            avgMargin: 0,
          };
        }
        acc[category].count += 1;
        acc[category].totalValue += product.production.sellingPrice || 0;
        acc[category].avgMargin += product.production.profitMargin || 0;
        return acc;
      },
      {} as Record<string, { count: number; totalValue: number; avgMargin: number }>
    );

    // Calcular média das margens
    Object.keys(summary).forEach(category => {
      summary[category].avgMargin = summary[category].avgMargin / summary[category].count;
    });

    return summary;
  }, [products]);

  if (Object.keys(categorySummary).length <= 1) return null;

  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700">Resumo por Categoria</h4>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(categorySummary).map(([category, data]) => (
          <div key={category} className="rounded bg-white p-3 text-sm">
            <div className="font-medium text-gray-900">{category}</div>
            <div className="mt-1 space-y-1 text-xs text-gray-600">
              <div>
                {data.count} produto{data.count !== 1 ? 's' : ''}
              </div>
              <div>Margem média: {data.avgMargin.toFixed(1)}%</div>
              <div>Valor total: R$ {data.totalValue.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
