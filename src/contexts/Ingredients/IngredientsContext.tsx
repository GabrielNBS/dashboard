'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Ingredient } from '@/types/ingredients';
import { useLocalStorage } from '@/hooks/useLocalStorage';

/**
 * Estado do contexto de ingredientes
 */
interface IngredientState {
  ingredients: Ingredient[];
  ingredientToEdit: Ingredient | null;
  isModalOpen: boolean;
}

/**
 * Ações possíveis para o reducer de ingredientes
 */
type IngredientAction =
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'EDIT_INGREDIENT'; payload: Ingredient }
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'OPEN_EDIT_MODAL'; payload: Ingredient }
  | { type: 'CLOSE_EDIT_MODAL' };

/**
 * Reducer para gerenciar o estado dos ingredientes
 *
 * @param state - Estado atual
 * @param action - Ação a ser executada
 * @returns Novo estado
 */
function ingredientReducer(state: IngredientState, action: IngredientAction): IngredientState {
  switch (action.type) {
    case 'ADD_INGREDIENT':
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case 'DELETE_INGREDIENT':
      return {
        ...state,
        ingredients: state.ingredients.filter(i => i.id !== action.payload),
      };

    case 'EDIT_INGREDIENT':
      return {
        ...state,
        ingredients: state.ingredients.map(i => (i.id === action.payload.id ? action.payload : i)),
      };

    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.payload };

    case 'OPEN_EDIT_MODAL':
      return { ...state, isModalOpen: true, ingredientToEdit: action.payload };

    case 'CLOSE_EDIT_MODAL':
      return { ...state, isModalOpen: false, ingredientToEdit: null };

    default:
      return state;
  }
}

/**
 * Tipo do contexto de ingredientes
 */
interface IngredientContextType {
  state: IngredientState;
  dispatch: React.Dispatch<IngredientAction>;
}

/**
 * Contexto para gerenciar estado global dos ingredientes
 */
export const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

/**
 * Provider do contexto de ingredientes
 *
 * Gerencia o estado dos ingredientes com persistência no localStorage
 * e sincronização automática entre componentes.
 *
 * @param children - Componentes filhos que terão acesso ao contexto
 */
export const IngredientProvider = ({ children }: { children: ReactNode }) => {
  // Hook para persistir ingredientes no localStorage
  const [storedIngredients, setStoredIngredients] = useLocalStorage<Ingredient[]>(
    'ingredients',
    []
  );

  // Estado inicial do reducer
  const [state, dispatch] = useReducer(ingredientReducer, {
    ingredients: storedIngredients,
    ingredientToEdit: null,
    isModalOpen: false,
  });

  // Sincroniza mudanças do estado com o localStorage
  useEffect(() => {
    setStoredIngredients(state.ingredients);
  }, [state.ingredients, setStoredIngredients]);

  return (
    <IngredientContext.Provider value={{ state, dispatch }}>{children}</IngredientContext.Provider>
  );
};
