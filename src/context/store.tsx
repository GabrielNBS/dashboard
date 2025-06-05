'use client';

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/types/ProductProps';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Estado inicial
interface ProductState {
  products: Product[];
}

// Ações para manipular o estado
type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'EDIT_PRODUCT'; payload: Product }
  | { type: 'SET_PRODUCTS'; payload: Product[] };

// Reducer para gerenciar o estado dos produtos
function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { products: [...state.products, action.payload] };
    case 'DELETE_PRODUCT':
      return { products: state.products.filter(p => p.id !== action.payload) };
    case 'EDIT_PRODUCT':
      return {
        products: state.products.map(p => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'SET_PRODUCTS':
      return { products: action.payload };
    default:
      return state;
  }
}

// Context
interface ProductContextType {
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [storedProducts, setStoredProducts] = useLocalStorage<Product[]>('products', []);

  const [state, dispatch] = useReducer(productReducer, { products: storedProducts });

  // Sincroniza com localStorage sempre que o estado mudar
  useEffect(() => {
    setStoredProducts(state.products);
  }, [state.products, setStoredProducts]);

  return <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>;
};
