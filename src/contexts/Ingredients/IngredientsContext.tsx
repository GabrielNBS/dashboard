'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Ingredient, PurchaseBatch } from '@/types/ingredients';
import { useLocalStorage } from '@/hooks/ui/useLocalStorage';

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
  | { type: 'ADD_BATCH'; payload: { ingredientId: string; batch: PurchaseBatch } }
  | { type: 'CONSUME_INGREDIENT'; payload: { ingredientId: string; quantity: number } }
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'EDIT_INGREDIENT'; payload: Ingredient }
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'OPEN_EDIT_MODAL'; payload: Ingredient }
  | { type: 'CLOSE_EDIT_MODAL' };

/**
 * Utilitários para cálculos com batches
 */
const calculateAverageUnitPrice = (batches: PurchaseBatch[]): number => {
  const totalValue = batches.reduce(
    (sum, batch) => sum + batch.currentQuantity * batch.unitPrice,
    0
  );
  const totalQuantity = batches.reduce((sum, batch) => sum + batch.currentQuantity, 0);

  return totalQuantity > 0 ? totalValue / totalQuantity : 0;
};

const calculateTotalQuantity = (batches: PurchaseBatch[]): number => {
  return batches.reduce((sum, batch) => sum + batch.currentQuantity, 0);
};

/**
 * Consome quantidade usando FIFO (primeiro que entra, primeiro que sai)
 */
const consumeQuantityFIFO = (
  batches: PurchaseBatch[],
  quantityToConsume: number
): PurchaseBatch[] => {
  let remainingToConsume = quantityToConsume;

  return batches
    .map(batch => {
      if (remainingToConsume <= 0) return batch;

      const consumeFromThisBatch = Math.min(batch.currentQuantity, remainingToConsume);
      remainingToConsume -= consumeFromThisBatch;

      return {
        ...batch,
        currentQuantity: batch.currentQuantity - consumeFromThisBatch,
      };
    })
    .filter(batch => batch.currentQuantity > 0); // Remove batches vazios
};

/**
 * Reducer para gerenciar o estado dos ingredientes
 */
function ingredientReducer(state: IngredientState, action: IngredientAction): IngredientState {
  switch (action.type) {
    case 'ADD_INGREDIENT':
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case 'ADD_BATCH': {
      const { ingredientId, batch } = action.payload;

      return {
        ...state,
        ingredients: state.ingredients.map(ingredient => {
          if (ingredient.id !== ingredientId) return ingredient;

          const updatedBatches = [...ingredient.batches, batch];

          return {
            ...ingredient,
            batches: updatedBatches,
            totalQuantity: calculateTotalQuantity(updatedBatches),
            averageUnitPrice: calculateAverageUnitPrice(updatedBatches),
          };
        }),
      };
    }

    case 'CONSUME_INGREDIENT': {
      const { ingredientId, quantity } = action.payload;

      return {
        ...state,
        ingredients: state.ingredients.map(ingredient => {
          if (ingredient.id !== ingredientId) return ingredient;

          const updatedBatches = consumeQuantityFIFO(ingredient.batches, quantity);

          return {
            ...ingredient,
            batches: updatedBatches,
            totalQuantity: calculateTotalQuantity(updatedBatches),
            averageUnitPrice: calculateAverageUnitPrice(updatedBatches),
          };
        }),
      };
    }

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
  // Funções auxiliares para facilitar o uso
  addBatch: (ingredientId: string, batch: Omit<PurchaseBatch, 'id'>) => void;
  consumeIngredient: (ingredientId: string, quantity: number) => void;
  getIngredientById: (id: string) => Ingredient | undefined;
}

/**
 * Contexto para gerenciar estado global dos ingredientes
 */
export const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

/**
 * Provider do contexto de ingredientes
 */
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

  // Sincroniza mudanças do estado com o localStorage
  useEffect(() => {
    setStoredIngredients(state.ingredients);
  }, [state.ingredients, setStoredIngredients]);

  // Funções auxiliares
  const addBatch = (ingredientId: string, batchData: Omit<PurchaseBatch, 'id'>) => {
    const batch: PurchaseBatch = {
      ...batchData,
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    dispatch({ type: 'ADD_BATCH', payload: { ingredientId, batch } });
  };

  const consumeIngredient = (ingredientId: string, quantity: number) => {
    dispatch({ type: 'CONSUME_INGREDIENT', payload: { ingredientId, quantity } });
  };

  const getIngredientById = (id: string): Ingredient | undefined => {
    return state.ingredients.find(ingredient => ingredient.id === id);
  };

  return (
    <IngredientContext.Provider
      value={{
        state,
        dispatch,
        addBatch,
        consumeIngredient,
        getIngredientById,
      }}
    >
      {children}
    </IngredientContext.Provider>
  );
};
