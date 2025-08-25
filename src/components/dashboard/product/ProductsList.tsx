import React from 'react';
import Button from '@/components/ui/Button';
import { useProductContext } from '@/contexts/products/ProductContext';
import { ProductState } from '@/types/products';
import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';

// Componente principal ProductsList
const ProductsList: React.FC = () => {
  const { state, dispatch } = useProductContext();

  if (!state) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (state.products.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-medium">Nenhum produto cadastrado</h3>
        <p className="text-muted-foreground mb-4">
          Comece adicionando seu primeiro produto à lista.
        </p>
        <Button onClick={() => dispatch({ type: 'TOGGLE_FORM_VISIBILITY' })}>
          Adicionar Produto
        </Button>
      </div>
    );
  }

  const handleRemoveProduct = (productId: string): void => {
    const product = state.products.find(p => p.uid === productId);
    if (product) {
      const confirm = window.confirm(`Tem certeza que deseja remover o produto ${product.name}?`);
      if (confirm) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-self-end">
        <span className="text-muted-foreground">
          {state.products.length} {state.products.length === 1 ? 'produto' : 'produtos'}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
        {state.products.map(product => (
          <li key={product.uid} className="list-none">
            <ProductCard
              product={product}
              onEdit={handleSetProductToEdit}
              onRemove={handleRemoveProduct}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
