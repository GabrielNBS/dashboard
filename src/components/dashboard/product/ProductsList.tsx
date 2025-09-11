import React, { useMemo } from 'react';
import Button from '@/components/ui/base/Button';
import { useProductContext } from '@/contexts/products/ProductContext';
import { ProductState } from '@/types/products';
import { ProductCard } from './ProductCard';
import { Package, Plus, SearchIcon } from 'lucide-react';
import SearchInput from '@/components/ui/forms/SearchInput';

// Importações dos componentes reutilizáveis
import { useItemFilter, SearchResultsContainer, FilterStats } from '@/hooks/ui/useFilter';

// Componente principal ProductsList
const ProductsList: React.FC = () => {
  const { state, dispatch } = useProductContext();

  // Configurar filtro reutilizável para produtos
  const filterConfig = useMemo(
    () => ({
      searchFields: ['name', 'category'] as (keyof ProductState)[],
      sortFn: (a: ProductState, b: ProductState) => {
        // Ordenar por categoria primeiro, depois por nome
        const categoryCompare = a.category.localeCompare(b.category);
        return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
      },
    }),
    []
  );

  const {
    search,
    filteredItems: filteredProducts,
    setSearch,
    resetFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
  } = useItemFilter(state?.products || [], filterConfig);

  // Loading state
  if (!state) {
    return <SearchResultsContainer items={[]} isLoading={true} renderItem={() => null} />;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            {totalItems} {totalItems === 1 ? 'produto' : 'produtos'} cadastrado
            {totalItems !== 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <span className="text-accent text-sm">
              • {filteredCount} encontrado{filteredCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchIcon />
          <SearchInput
            placeholder="Buscar produtos..."
            value={search}
            onChange={setSearch}
            className="sm:w-64"
          />
        </div>
      </div>

      {/* Estatísticas do filtro */}
      <FilterStats
        totalCount={totalItems}
        filteredCount={filteredCount}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={resetFilters}
      />

      {/* Container de resultados */}
      <SearchResultsContainer
        items={filteredProducts}
        emptyState={{
          icon: <Package className="text-muted-foreground mb-4 h-16 w-16" />,
          title: search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado',
          description: search
            ? `Não encontramos produtos que contenham "${search}". Tente ajustar sua busca.`
            : 'Comece adicionando seu primeiro produto à lista.',
          action: (
            <Button onClick={handleAddProduct} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {search ? 'Adicionar Produto' : 'Adicionar Primeiro Produto'}
            </Button>
          ),
        }}
        renderItem={product => (
          <ProductCard
            product={product}
            onEdit={handleSetProductToEdit}
            onRemove={handleRemoveProduct}
          />
        )}
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3"
      />

      {/* Resumo por categoria (quando há produtos) */}
      {filteredProducts.length > 0 && <CategorySummary products={filteredProducts} />}
    </div>
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
