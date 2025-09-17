// ============================================================
// 🔹 Generic Context Factory
// ============================================================
// Factory function to create standardized contexts with CRUD operations
// Eliminates duplication between ProductContext, IngredientsContext, etc.

import React, { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { useLocalStorage } from '@/hooks/ui/useLocalStorage';

// Base interface for entities managed by contexts
export interface BaseEntity {
  id?: string;
  uid?: string;
}

// Generic state interface
export interface GenericState<T extends BaseEntity> {
  items: T[];
  itemToEdit?: T | null;
  isEditMode: boolean;
  isFormVisible?: boolean;
  isModalOpen?: boolean;
}

// Generic action types
export type GenericAction<T extends BaseEntity> =
  | { type: 'ADD_ITEM'; payload: T }
  | { type: 'SET_ITEMS'; payload: T[] }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'EDIT_ITEM'; payload: T }
  | { type: 'SET_ITEM_TO_EDIT'; payload: T }
  | { type: 'CLEAR_ITEM_TO_EDIT' }
  | { type: 'TOGGLE_FORM_VISIBILITY' }
  | { type: 'OPEN_EDIT_MODAL'; payload: T }
  | { type: 'CLOSE_EDIT_MODAL' };

// Context configuration
export interface ContextConfig<T extends BaseEntity> {
  storageKey: string;
  contextName: string;
  initialItems?: T[];
  customActions?: Record<string, (state: GenericState<T>, payload?: any) => GenericState<T>>;
}

// Context type definition
export interface GenericContextType<T extends BaseEntity> {
  state: GenericState<T>;
  dispatch: React.Dispatch<GenericAction<T>>;
  // Utility functions
  getItemById: (id: string) => T | undefined;
  addItem: (item: T) => void;
  updateItem: (item: T) => void;
  removeItem: (id: string) => void;
  setItemToEdit: (item: T) => void;
  clearItemToEdit: () => void;
  toggleFormVisibility: () => void;
}

/**
 * Generic reducer factory
 * Creates a reducer with standard CRUD operations
 *
 * @param customActions - Additional custom actions specific to the entity type
 * @returns Reducer function for the entity type
 */
function createGenericReducer<T extends BaseEntity>(
  customActions?: Record<string, (state: GenericState<T>, payload?: any) => GenericState<T>>
) {
  return function reducer(state: GenericState<T>, action: GenericAction<T>): GenericState<T> {
    switch (action.type) {
      case 'ADD_ITEM':
        return { ...state, items: [...state.items, action.payload] };

      case 'SET_ITEMS':
        return { ...state, items: action.payload };

      case 'REMOVE_ITEM':
        return {
          ...state,
          items: state.items.filter(item => (item.id || item.uid) !== action.payload),
        };

      case 'EDIT_ITEM':
        return {
          ...state,
          items: state.items.map(item =>
            (item.id || item.uid) === (action.payload.id || action.payload.uid)
              ? action.payload
              : item
          ),
        };

      case 'SET_ITEM_TO_EDIT':
        return {
          ...state,
          itemToEdit: action.payload,
          isEditMode: true,
        };

      case 'CLEAR_ITEM_TO_EDIT':
        return {
          ...state,
          itemToEdit: null,
          isEditMode: false,
        };

      case 'TOGGLE_FORM_VISIBILITY':
        return { ...state, isFormVisible: !state.isFormVisible };

      case 'OPEN_EDIT_MODAL':
        return { ...state, isModalOpen: true, itemToEdit: action.payload };

      case 'CLOSE_EDIT_MODAL':
        return { ...state, isModalOpen: false, itemToEdit: null };

      default:
        // Handle custom actions if provided
        if (customActions && action.type in customActions) {
          return customActions[action.type](state, (action as any).payload);
        }
        return state;
    }
  };
}

/**
 * Generic context factory function
 * Creates a complete context setup with provider and hook
 *
 * @param config - Configuration object for the context
 * @returns Object containing Context, Provider, and useContext hook
 */
export function createGenericContext<T extends BaseEntity>(config: ContextConfig<T>) {
  const { storageKey, contextName, initialItems = [], customActions } = config;

  // Create the context
  const Context = createContext<GenericContextType<T> | undefined>(undefined);

  // Create the reducer
  const reducer = createGenericReducer<T>(customActions);

  // Initial state
  const initialState: GenericState<T> = {
    items: initialItems,
    itemToEdit: null,
    isEditMode: false,
    isFormVisible: false,
    isModalOpen: false,
  };

  // Provider component
  const Provider = ({ children }: { children: ReactNode }) => {
    const [storedItems, setStoredItems] = useLocalStorage<T[]>(storageKey, initialItems);

    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      items: storedItems,
    });

    // Sync state changes to localStorage
    useEffect(() => {
      setStoredItems(state.items);
    }, [state.items, setStoredItems]);

    // Utility functions
    const getItemById = (id: string): T | undefined => {
      return state.items.find(item => (item.id || item.uid) === id);
    };

    const addItem = (item: T) => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const updateItem = (item: T) => {
      dispatch({ type: 'EDIT_ITEM', payload: item });
    };

    const removeItem = (id: string) => {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const setItemToEdit = (item: T) => {
      dispatch({ type: 'SET_ITEM_TO_EDIT', payload: item });
    };

    const clearItemToEdit = () => {
      dispatch({ type: 'CLEAR_ITEM_TO_EDIT' });
    };

    const toggleFormVisibility = () => {
      dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
    };

    return (
      <Context.Provider
        value={{
          state,
          dispatch,
          getItemById,
          addItem,
          updateItem,
          removeItem,
          setItemToEdit,
          clearItemToEdit,
          toggleFormVisibility,
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  // Custom hook to use the context
  const useContext = () => {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }
    return context;
  };

  return {
    Context,
    Provider,
    useContext,
  };
}

// ============================================================
// 🔹 Specialized context creators for common use cases
// ============================================================

/**
 * Create a product context with standard product operations
 */
export function createProductContext<T extends BaseEntity & { name: string; category: string }>() {
  return createGenericContext<T>({
    storageKey: 'finalProducts',
    contextName: 'ProductContext',
    initialItems: [],
  });
}

/**
 * Create an ingredient context with standard ingredient operations
 */
export function createIngredientContext<T extends BaseEntity & { name: string }>() {
  return createGenericContext<T>({
    storageKey: 'ingredients',
    contextName: 'IngredientContext',
    initialItems: [],
  });
}

/**
 * Create a sales context with standard sales operations
 */
export function createSalesContext<T extends BaseEntity & { date: string }>() {
  return createGenericContext<T>({
    storageKey: 'sales',
    contextName: 'SalesContext',
    initialItems: [],
  });
}
