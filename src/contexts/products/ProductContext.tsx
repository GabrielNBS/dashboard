'use client';

import React, { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { ProductState } from '@/types/products';
import { useLocalStorage } from '@/lib/hooks/ui/useLocalStorage';

interface ProductListState {
  products: ProductState[];
  productToEdit?: ProductState | null;
  isEditMode: boolean;
  isFormVisible?: boolean;
}

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: ProductState }
  | { type: 'SET_PRODUCTS'; payload: ProductState[] }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'EDIT_PRODUCT'; payload: ProductState }
  | { type: 'SET_PRODUCT_TO_EDIT'; payload: ProductState }
  | { type: 'CLEAR_PRODUCT_TO_EDIT' }
  | { type: 'TOGGLE_FORM_VISIBILITY' };

const initialState: ProductListState = {
  products: [],
  productToEdit: null,
  isEditMode: false,
  isFormVisible: false,
};

function reducer(state: ProductListState, action: ProductAction): ProductListState {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.uid !== action.payload),
      };
    case 'EDIT_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.uid === action.payload.uid ? action.payload : product
        ),
      };
    case 'SET_PRODUCT_TO_EDIT':
      return {
        ...state,
        productToEdit: action.payload,
        isEditMode: true,
      };
    case 'CLEAR_PRODUCT_TO_EDIT':
      return {
        ...state,
        productToEdit: null,
        isEditMode: false,
      };
    case 'TOGGLE_FORM_VISIBILITY':
      return { ...state, isFormVisible: !state.isFormVisible };
    default:
      return state;
  }
}

export const ProductListContext = createContext<
  | {
      state: ProductListState;
      dispatch: React.Dispatch<ProductAction>;
    }
  | undefined
>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [storedProducts, setStoredProducts] = useLocalStorage<ProductState[]>('finalProducts', []);

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    products: storedProducts,
  });

  useEffect(() => {
    setStoredProducts(state.products);
  }, [state.products]);

  return (
    <ProductListContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductListContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductListContext);
  if (!context) throw new Error('useProductContext deve ser usado dentro de ProductProvider');
  return context;
};
