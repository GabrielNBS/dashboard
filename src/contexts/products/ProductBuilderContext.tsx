'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { FinalProductState } from '@/types/finalProduct';
import { Ingredient } from '@/types/ingredients';
import { v4 as uuid } from 'uuid';

type ProductBuilderAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'RESET_PRODUCT' }
  | { type: 'SET_PRODUCTION_MODE'; payload: 'individual' | 'lote' }
  | { type: 'SET_YIELD_QUANTITY'; payload: number };

const initialState: FinalProductState = {
  uid: uuid(),
  id: '',
  name: '',
  category: '',
  ingredients: [],
  productionMode: 'individual',
  yieldQuantity: 1,
};

function finalProductReducer(
  state: FinalProductState,
  action: ProductBuilderAction
): FinalProductState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };

    case 'SET_CATEGORY':
      return { ...state, category: action.payload };

    case 'ADD_INGREDIENT':
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case 'REMOVE_INGREDIENT':
      return {
        ...state,
        ingredients: state.ingredients.filter(i => i.id !== action.payload),
      };

    case 'RESET_PRODUCT':
      return {
        ...initialState,
        uid: uuid(), // gera novo uid ao resetar
      };

    case 'SET_PRODUCTION_MODE':
      return { ...state, productionMode: action.payload };

    case 'SET_YIELD_QUANTITY':
      return { ...state, yieldQuantity: action.payload };

    default:
      return state;
  }
}

const ProductBuilderContext = createContext<
  | {
      state: FinalProductState;
      dispatch: React.Dispatch<ProductBuilderAction>;
    }
  | undefined
>(undefined);

export const ProductBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(finalProductReducer, initialState);

  return (
    <ProductBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductBuilderContext.Provider>
  );
};

export const useProductBuilderContext = () => {
  const context = useContext(ProductBuilderContext);
  if (!context) {
    throw new Error('useProductBuilderContext deve ser usado dentro de ProductBuilderProvider');
  }
  return context;
};
