'use client';

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Ingredient } from '@/types/ingredients';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Estado inicial
interface IngredientState {
  ingredients: Ingredient[];
  ingredientToEdit: Ingredient | null;
  isModalOpen: boolean;
}

type IngredientAction =
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'DELETE_INGREDIENT'; payload: number }
  | { type: 'EDIT_INGREDIENT'; payload: Ingredient }
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'OPEN_EDIT_MODAL'; payload: Ingredient }
  | { type: 'CLOSE_EDIT_MODAL' };

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

interface IngredientContextType {
  state: IngredientState;
  dispatch: React.Dispatch<IngredientAction>;
}

export const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

export const IngredientProvider = ({ children }: { children: ReactNode }) => {
  const [storedIngredients, setStoredIngredients] = useLocalStorage<Ingredient[]>(
    'ingredients',
    []
  );

  const [state, dispatch] = useReducer(ingredientReducer, {
    ingredients: storedIngredients,
    ingredientToEdit: null,
    isModalOpen: false,
  });

  useEffect(() => {
    setStoredIngredients(state.ingredients);
  }, [state.ingredients]);

  return (
    <IngredientContext.Provider value={{ state, dispatch }}>{children}</IngredientContext.Provider>
  );
};

export const useIngredientContext = () => {
  const context = useContext(IngredientContext);
  if (!context) throw new Error('useIngredientContext deve ser usado dentro de IngredientProvider');
  return context;
};
