import React, { useState, useRef, useEffect } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { ProductState } from '@/types/products';
import { ProductCard, CompactModalContent, ExpandedProductModal } from './ProductCard';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';
import { X } from 'lucide-react';
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

  // Modal state for card-to-modal animation
  const [expandedProduct, setExpandedProduct] = useState<ProductState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    search,
    filteredItems: filteredProducts,
    setSearch,
    resetFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
  } = useProductFilter(state?.products || []);

  // Card-to-modal animation handler
  const handleCardClick = (product: ProductState) => {
    const card = cardRefs.current[product.uid || ''];
    if (!card) return;

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const rect = card.getBoundingClientRect();
    setCardRect(rect);
    setExpandedProduct(product);

    // Prevent scroll during animation
    document.body.style.overflow = 'hidden';

    // Start animation immediately for better synchronization
    setIsAnimating(true);
  };

  const handleCloseModal = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setIsAnimating(false);

    // Cleanup after animation completes - matching the 400ms transition duration
    animationTimeoutRef.current = setTimeout(() => {
      setExpandedProduct(null);
      setCardRect(null);
      document.body.style.overflow = 'auto';
    }, 400); // Match transition duration exactly
  };

  // Handle escape key and cleanup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedProduct) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [expandedProduct]);

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
            isExpanded={expandedProduct?.uid === product.uid}
          />
        )}
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3"
      />

      {/* Expanded Modal with Fluid Animation */}
      {expandedProduct && (
        <>
          {/* Backdrop with smooth fade */}
          <div
            className="fixed inset-0 z-40 bg-black transition-opacity duration-[400ms] ease-out"
            style={{
              opacity: isAnimating ? 0.5 : 0,
            }}
            onClick={handleCloseModal}
          />

          {/* Animated Modal Container */}
          <div
            className="bg-card fixed z-50 overflow-hidden rounded-xl shadow-2xl will-change-transform"
            style={{
              top: isAnimating ? '50%' : `${cardRect?.top}px`,
              left: isAnimating ? '50%' : `${cardRect?.left}px`,
              width: isAnimating ? 'min(90vw, 800px)' : `${cardRect?.width}px`,
              height: isAnimating ? 'min(90vh, 900px)' : `${cardRect?.height}px`,
              transform: isAnimating ? 'translate(-50%, -50%)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div className="flex h-full flex-col">
              {/* Header with smooth morphing */}
              <div
                className="from-primary to-accent relative flex-shrink-0 bg-gradient-to-r transition-all duration-[400ms] ease-out"
                style={{
                  padding: isAnimating ? '1.25rem 1.5rem' : '1rem 1.25rem',
                }}
              >
                {/* Close Button - fades in smoothly */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 absolute rounded-full p-2 transition-all duration-[400ms]"
                  style={{
                    top: '1rem',
                    right: '1rem',
                    opacity: isAnimating ? 1 : 0,
                    transform: isAnimating ? 'scale(1)' : 'scale(0.8)',
                    pointerEvents: isAnimating ? 'auto' : 'none',
                  }}
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Title with fluid size transition */}
                <h2
                  className="text-primary-foreground font-bold transition-all duration-[400ms] ease-out"
                  style={{
                    fontSize: isAnimating ? '1.5rem' : '1.125rem',
                    lineHeight: isAnimating ? '2rem' : '1.75rem',
                    marginBottom: '0.5rem',
                    paddingRight: isAnimating ? '3rem' : '0',
                  }}
                >
                  {expandedProduct.name}
                </h2>

                {/* Badges with smooth transition */}
                <div
                  className="flex flex-wrap transition-all duration-[400ms] ease-out"
                  style={{
                    gap: '0.5rem',
                  }}
                >
                  <span className="bg-primary-foreground/20 text-primary-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-[400ms]">
                    {expandedProduct.category}
                  </span>
                  <span className="bg-primary-foreground/20 text-primary-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-[400ms]">
                    {expandedProduct.production.mode === 'lote' ? 'Lote' : 'Unit.'}
                  </span>
                </div>
              </div>

              {/* Content with smooth crossfade */}
              <div className="relative flex-1 overflow-hidden">
                {/* Compact Content - visible initially, fades out */}
                <div
                  className="absolute inset-0 overflow-y-auto transition-all duration-200 ease-out"
                  style={{
                    padding: '1.25rem',
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating
                      ? 'scale(0.98) translateY(10px)'
                      : 'scale(1) translateY(0)',
                    pointerEvents: isAnimating ? 'none' : 'auto',
                    transitionDelay: isAnimating ? '0ms' : '200ms',
                  }}
                >
                  <CompactModalContent product={expandedProduct} />
                </div>

                {/* Expanded Content - fades in with delay */}
                <div
                  className="absolute inset-0 overflow-y-auto transition-all duration-200 ease-out"
                  style={{
                    padding: '1.5rem',
                    opacity: isAnimating ? 1 : 0,
                    transform: isAnimating
                      ? 'scale(1) translateY(0)'
                      : 'scale(0.98) translateY(-10px)',
                    pointerEvents: isAnimating ? 'auto' : 'none',
                    transitionDelay: isAnimating ? '200ms' : '0ms',
                  }}
                >
                  <ExpandedProductModal product={expandedProduct} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
