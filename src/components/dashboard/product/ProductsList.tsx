import React, { useState, useRef } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { ProductState } from '@/types/products';
import { ProductCard, ProductModal } from './ProductCard';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';
import { useProductFilter } from '@/hooks/ui/useUnifiedFilter';
import {
  GenericListContainer,
  createSearchConfig,
  createFilterStatsConfig,
  createAddItemEmptyState,
} from '@/components/ui/GenericListContainer';
import ProductsListSkeleton from '@/components/ui/skeletons/ProductsListSkeleton';

const ProductsList: React.FC = () => {
  const { state, dispatch } = useProductContext();
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  // Modal state - simplified with Framer Motion
  const [selectedProduct, setSelectedProduct] = useState<ProductState | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    search,
    filteredItems: filteredProducts,
    setSearch,
    resetFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
  } = useProductFilter(state?.products || []);

  // Card click handler - simplified
  const handleCardClick = (product: ProductState) => {
    setSelectedProduct(product);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (!state) {
    return <ProductsListSkeleton />;
  }

  const handleRemoveProduct = (productId: string): void => {
    const product = state.products.find(p => p.uid === productId);
    if (product) {
      showConfirmation(
        {
          title: 'Excluir Produto',
          description: `Tem certeza que deseja remover o produto "${product.name}"? Esta ação não pode ser desfeita.`,
          variant: 'destructive',
        },
        () => {
          dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
        }
      );
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
    <>
      <GenericListContainer
        items={filteredProducts}
        search={searchConfig}
        filterStats={filterStatsConfig}
        emptyState={emptyStateConfig}
        renderItem={product => (
          <ProductCard
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[product.uid || ''] = el;
            }}
            product={product}
            onEdit={handleSetProductToEdit}
            onRemove={handleRemoveProduct}
            onClick={handleCardClick}
            isExpanded={selectedProduct?.uid === product.uid}
          />
        )}
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3"
      />

      {/* Product Modal with Framer Motion */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
      />

      {/* Dialog de confirmação */}
      {confirmationState && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          description={confirmationState.description}
          variant={confirmationState.variant}
          confirmText={confirmationState.confirmText}
          confirmButtonText={confirmationState.confirmButtonText}
          cancelButtonText={confirmationState.cancelButtonText}
        />
      )}
    </>
  );
};

export default ProductsList;
