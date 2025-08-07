'use client';

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { FinalProductState } from '@/types/finalProduct';
import { Ingredient } from '@/types/ingredients';
import { v4 as uuid } from 'uuid';

/**
 * Ações possíveis para o reducer de construção de produtos
 */
type ProductBuilderAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'RESET_PRODUCT' }
  | { type: 'SET_PRODUCTION_MODE'; payload: 'individual' | 'lote' }
  | { type: 'SET_YIELD_QUANTITY'; payload: number }
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] };

/**
 * Estado inicial para construção de produtos
 */
const initialState: FinalProductState = {
  uid: uuid(),
  name: '',
  category: '',
  ingredients: [],
  productionMode: 'individual',
  yieldQuantity: 1,
};

/**
 * Reducer para gerenciar o estado de construção de produtos
 *
 * @param state - Estado atual do produto sendo construído
 * @param action - Ação a ser executada
 * @returns Novo estado do produto
 */
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
        uid: uuid(), // Gera novo uid ao resetar para evitar conflitos
      };

    case 'SET_PRODUCTION_MODE':
      return { ...state, productionMode: action.payload };

    case 'SET_YIELD_QUANTITY':
      return { ...state, yieldQuantity: action.payload };

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
  state: FinalProductState;
  dispatch: React.Dispatch<ProductBuilderAction>;
}

/**
 * Contexto para gerenciar estado de construção de produtos
 */
const ProductBuilderContext = createContext<ProductBuilderContextType | undefined>(undefined);

/**
 * Provider do contexto de construção de produtos
 *
 * Gerencia o estado de produtos sendo construídos, permitindo
 * adicionar ingredientes, definir categorias e modos de produção.
 *
 * @param children - Componentes filhos que terão acesso ao contexto
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
 * Hook customizado para usar o contexto de construção de produtos
 *
 * @returns Contexto de construção de produtos
 * @throws Error se usado fora do ProductBuilderProvider
 *
 * @example
 * const { state, dispatch } = useProductBuilderContext();
 * dispatch({ type: 'SET_NAME', payload: 'Novo Produto' });
 */
export const useProductBuilderContext = () => {
  const context = useContext(ProductBuilderContext);
  if (!context) {
    throw new Error('useProductBuilderContext deve ser usado dentro de ProductBuilderProvider');
  }
  return context;
};
