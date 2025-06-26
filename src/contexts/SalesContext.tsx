'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sale } from '@/types/sale';

// Estado e ações do contexto
interface SalesState {
  sales: Sale[];
}

type SalesAction =
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'REMOVE_SALE'; payload: string };

const initialState: SalesState = {
  sales: [],
};

function salesReducer(state: SalesState, action: SalesAction): SalesState {
  switch (action.type) {
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    case 'REMOVE_SALE':
      return { ...state, sales: state.sales.filter(sale => sale.id !== action.payload) };
    default:
      return state;
  }
}

export const SalesContext = createContext<
  | {
      state: SalesState;
      dispatch: React.Dispatch<SalesAction>;
    }
  | undefined
>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [storedSales, setStoredSales] = useLocalStorage<Sale[]>('sales', []);

  const [state, dispatch] = useReducer(salesReducer, {
    ...initialState,
    sales: storedSales,
  });

  useEffect(() => {
    setStoredSales(state.sales);
  }, [state.sales]);

  return <SalesContext.Provider value={{ state, dispatch }}>{children}</SalesContext.Provider>;
};
