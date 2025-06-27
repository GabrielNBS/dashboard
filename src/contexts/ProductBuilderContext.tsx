'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Ingredient } from '@/types/ingredients';
import { FinalProductState } from '@/types/finalProduct';

type ProductBuilderAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: number }
  | { type: 'RESET_PRODUCT' };

const initialState: FinalProductState = {
  id: '',
  name: '',
  category: '',
  ingredients: [],
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
      return { ...state, ingredients: state.ingredients.filter(i => i.id !== action.payload) };
    case 'RESET_PRODUCT':
      return initialState;
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
  if (!context)
    throw new Error('useProductBuilderContext deve ser usado dentro de ProductBuilderProvider');
  return context;
};
