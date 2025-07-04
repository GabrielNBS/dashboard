'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { FinalProductState } from '@/types/finalProduct';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FinalProductListState {
  products: FinalProductState[];
}

type finalProductAction =
  | { type: 'ADD_FINAL_PRODUCT'; payload: FinalProductState }
  | { type: 'SET_PRODUCTS'; payload: FinalProductState[] }
  | { type: 'REMOVE_FINAL_PRODUCT'; payload: string }
  | { type: 'EDIT_FINAL_PRODUCT'; payload: FinalProductState };

const initialState: FinalProductListState = {
  products: [],
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
