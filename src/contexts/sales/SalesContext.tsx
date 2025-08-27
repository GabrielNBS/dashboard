'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '@/lib/hooks/ui/useLocalStorage';
import { Sale } from '@/types/sale';

/**
 * Estado do contexto de vendas
 */
interface SalesState {
  sales: Sale[];
}

/**
 * Ações possíveis para o reducer de vendas
 */
type SalesAction =
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'REMOVE_SALE'; payload: string };

/**
 * Estado inicial do contexto de vendas
 */
const initialState: SalesState = {
  sales: [],
};

/**
 * Reducer para gerenciar o estado das vendas
 *
 * @param state - Estado atual
 * @param action - Ação a ser executada
 * @returns Novo estado
 */
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

/**
 * Tipo do contexto de vendas
 */
interface SalesContextType {
  state: SalesState;
  dispatch: React.Dispatch<SalesAction>;
}

/**
 * Contexto para gerenciar estado global das vendas
 */
export const SalesContext = createContext<SalesContextType | undefined>(undefined);

/**
 * Provider do contexto de vendas
 *
 * Gerencia o estado das vendas com persistência no localStorage
 * e sincronização automática entre componentes.
 *
 * @param children - Componentes filhos que terão acesso ao contexto
 */
export const SalesProvider = ({ children }: { children: ReactNode }) => {
  // Hook para persistir vendas no localStorage
  const [storedSales, setStoredSales] = useLocalStorage<Sale[]>('sales', []);

  // Estado inicial do reducer com dados do localStorage
  const [state, dispatch] = useReducer(salesReducer, {
    ...initialState,
    sales: storedSales,
  });

  // Sincroniza mudanças do estado com o localStorage
  useEffect(() => {
    setStoredSales(state.sales);
  }, [state.sales, setStoredSales]);

  return <SalesContext.Provider value={{ state, dispatch }}>{children}</SalesContext.Provider>;
};
