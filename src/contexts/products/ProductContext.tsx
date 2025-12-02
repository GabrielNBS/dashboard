'use client';

import React, { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { ProductState } from '@/types/products';

interface ProductListState {
  products: ProductState[];
  productToEdit?: ProductState | null;
  isEditMode: boolean;
  isFormVisible?: boolean;
  isLoading: boolean;
  error: string | null;
}

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: ProductState }
  | { type: 'SET_PRODUCTS'; payload: ProductState[] }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'EDIT_PRODUCT'; payload: ProductState }
  | { type: 'SET_PRODUCT_TO_EDIT'; payload: ProductState }
  | { type: 'CLEAR_PRODUCT_TO_EDIT' }
  | { type: 'TOGGLE_FORM_VISIBILITY' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: ProductListState = {
  products: [],
  productToEdit: null,
  isEditMode: false,
  isFormVisible: false,
  isLoading: true,
  error: null,
};

function reducer(state: ProductListState, action: ProductAction): ProductListState {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload], error: null };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, isLoading: false, error: null };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.uid !== action.payload),
        error: null,
      };
    case 'EDIT_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.uid === action.payload.uid ? action.payload : product
        ),
        error: null,
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
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
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1. CARREGAMENTO INICIAL (Load)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('finalProducts');
      if (item) {
        const parsedProducts = JSON.parse(item);
        dispatch({ type: 'SET_PRODUCTS', payload: parsedProducts });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Falha ao carregar produtos:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Não foi possível carregar seus produtos.' });
    }
  }, []);

  // 2. PERSISTÊNCIA (Save)
  useEffect(() => {
    if (state.isLoading) return;

    try {
      window.localStorage.setItem('finalProducts', JSON.stringify(state.products));
    } catch (error) {
      console.error('Falha ao salvar produtos:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Memória cheia! Não foi possível salvar o produto.',
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao salvar os produtos localmente.' });
      }
    }
  }, [state.products, state.isLoading]);

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
