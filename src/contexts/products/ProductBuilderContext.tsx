'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { ProductState, ProductionMode } from '@/types/products';
import { Ingredient } from '@/types/ingredients';
import { v4 as uuid } from 'uuid';

/**
 * Ações possíveis para o reducer de construção de produtos
 */
export type ProductBuilderAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'RESET_PRODUCT' }
  | { type: 'SET_PRODUCTION_MODE'; payload: ProductionMode }
  | { type: 'SET_YIELD_QUANTITY'; payload: number }
  | { type: 'SET_TOTAL_COST'; payload: number }
  | { type: 'SET_UNIT_COST'; payload: number }
  | { type: 'SET_UNIT_SELLING_PRICE'; payload: number }
  | { type: 'SET_UNIT_MARGIN'; payload: number }
  | { type: 'SET_SELLING_PRICE'; payload: number }
  | { type: 'SET_PROFIT_MARGIN'; payload: number }
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] };

/**
 * Estado inicial do produto
 */
const initialState: ProductState = {
  uid: uuid(),
  name: '',
  category: '',
  ingredients: [],
  production: {
    mode: 'individual',
    yieldQuantity: 1,
    totalCost: 0,
    unitCost: 0,
    unitSellingPrice: 0,
    unitMargin: 0,
    sellingPrice: 0,
    profitMargin: 0,
  },
};

/**
 * Reducer para gerenciar estado de construção de produtos
 */
function finalProductReducer(state: ProductState, action: ProductBuilderAction): ProductState {
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
      return { ...initialState, uid: uuid() };

    case 'SET_PRODUCTION_MODE':
      return { ...state, production: { ...state.production, mode: action.payload } };

    case 'SET_YIELD_QUANTITY':
      return { ...state, production: { ...state.production, yieldQuantity: action.payload } };

    case 'SET_TOTAL_COST':
      return { ...state, production: { ...state.production, totalCost: action.payload } };

    case 'SET_UNIT_COST':
      return { ...state, production: { ...state.production, unitCost: action.payload } };

    case 'SET_UNIT_SELLING_PRICE':
      return { ...state, production: { ...state.production, unitSellingPrice: action.payload } };

    case 'SET_UNIT_MARGIN':
      return { ...state, production: { ...state.production, unitMargin: action.payload } };

    case 'SET_SELLING_PRICE':
      return { ...state, production: { ...state.production, sellingPrice: action.payload } };

    case 'SET_PROFIT_MARGIN':
      return { ...state, production: { ...state.production, profitMargin: action.payload } };

    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.payload };

    default:
      return state;
  }
}

/**
 * Tipo do contexto de construção de produtos
 */
interface ProductBuilderContextType {
  state: ProductState;
  dispatch: React.Dispatch<ProductBuilderAction>;
}

/**
 * Contexto de construção de produtos
 */
const ProductBuilderContext = createContext<ProductBuilderContextType | undefined>(undefined);

/**
 * Provider do contexto
 */
export const ProductBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(finalProductReducer, initialState);

  return (
    <ProductBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductBuilderContext.Provider>
  );
};

/**
 * Hook customizado para usar o contexto
 */
export const useProductBuilderContext = () => {
  const context = useContext(ProductBuilderContext);
  if (!context) {
    throw new Error('useProductBuilderContext deve ser usado dentro de ProductBuilderProvider');
  }
  return context;
};
