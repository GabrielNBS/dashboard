'use client';

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/types/ProductProps';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Estado inicial
interface ProductState {
  products: Product[];
  productToEdit: Product | null;
  isModalOpen: boolean;
}

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: number }
  | { type: 'EDIT_PRODUCT'; payload: Product }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'OPEN_EDIT_MODAL'; payload: Product }
  | { type: 'CLOSE_EDIT_MODAL' };

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'EDIT_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'OPEN_EDIT_MODAL':
      return { ...state, isModalOpen: true, productToEdit: action.payload };
    case 'CLOSE_EDIT_MODAL':
      return { ...state, isModalOpen: false, productToEdit: null };
    default:
      return state;
  }
}

interface ProductContextType {
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [storedProducts, setStoredProducts] = useLocalStorage<Product[]>('products', []);

  const [state, dispatch] = useReducer(productReducer, {
    products: storedProducts,
    productToEdit: null,
    isModalOpen: false,
  });

  useEffect(() => {
    setStoredProducts(state.products);
  }, [state.products]);

  return <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductContext deve ser usado dentro de ProductProvider');
  return context;
};
