'use client';

import React, { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { FinalProductState } from '@/types/finalProduct';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FinalProductListState {
  products: FinalProductState[];
  productToEdit?: FinalProductState | null;
  isEditMode: boolean;
  isFormVisible?: boolean;
}

type finalProductAction =
  | { type: 'ADD_FINAL_PRODUCT'; payload: FinalProductState }
  | { type: 'SET_PRODUCTS'; payload: FinalProductState[] }
  | { type: 'REMOVE_FINAL_PRODUCT'; payload: string }
  | { type: 'EDIT_FINAL_PRODUCT'; payload: FinalProductState }
  | { type: 'SET_PRODUCT_TO_EDIT'; payload: FinalProductState }
  | { type: 'CLEAR_PRODUCT_TO_EDIT' }
  | { type: 'TOGGLE_FORM_VISIBILITY' };

const initialState: FinalProductListState = {
  products: [],
  productToEdit: null,
  isEditMode: false,
  isFormVisible: false,
};

function reducer(state: FinalProductListState, action: finalProductAction): FinalProductListState {
  switch (action.type) {
    case 'ADD_FINAL_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'REMOVE_FINAL_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.uid !== action.payload),
      };
    case 'EDIT_FINAL_PRODUCT':
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

export const FinalProductListContext = createContext<
  | {
      state: FinalProductListState;
      dispatch: React.Dispatch<finalProductAction>;
    }
  | undefined
>(undefined);

export const FinalProductProvider = ({ children }: { children: ReactNode }) => {
  const [storedProducts, setStoredProducts] = useLocalStorage<FinalProductState[]>(
    'finalProducts',
    []
  );

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    products: storedProducts,
  });

  useEffect(() => {
    setStoredProducts(state.products);
  }, [state.products]);

  return (
    <FinalProductListContext.Provider value={{ state, dispatch }}>
      {children}
    </FinalProductListContext.Provider>
  );
};

export const useFinalProductContext = () => {
  const context = useContext(FinalProductListContext);
  if (!context)
    throw new Error('useFinalProductContext deve ser usado dentro de FinalProductProvider');
  return context;
};
