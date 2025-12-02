'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Sale } from '@/types/sale';

interface SalesState {
  sales: Sale[];
  error: string | null;
  isLoading: boolean;
}

type SalesAction =
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'REMOVE_SALE'; payload: string }
  | { type: 'SET_ERROR'; payload: string } // Aciona um erro
  | { type: 'CLEAR_ERROR' } // Limpa o erro
  | { type: 'SET_LOADING'; payload: boolean }; // Controla carregamento

const initialState: SalesState = {
  sales: [],
  error: null,
  isLoading: true, // Começa carregando
};

// --- REDUCER ---

function salesReducer(state: SalesState, action: SalesAction): SalesState {
  switch (action.type) {
    case 'ADD_SALE':
      return {
        ...state,
        sales: [...state.sales, action.payload],
        error: null, // Limpa erros antigos ao tentar nova ação
      };

    case 'SET_SALES':
      return {
        ...state,
        sales: action.payload,
        isLoading: false,
        error: null,
      };

    case 'REMOVE_SALE':
      return {
        ...state,
        sales: state.sales.filter(sale => sale.id !== action.payload),
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

// --- CONTEXTO ---

interface SalesContextType {
  state: SalesState;
  dispatch: React.Dispatch<SalesAction>;
}

export const SalesContext = createContext<SalesContextType | undefined>(undefined);

// --- PROVIDER ---

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(salesReducer, initialState);

  // 1. CARREGAMENTO INICIAL (Load)
  // Isso roda apenas no cliente, resolvendo o erro de hidratação
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('sales');
      if (item) {
        const parsedSales = JSON.parse(item);
        dispatch({ type: 'SET_SALES', payload: parsedSales });
      } else {
        // Se não tem nada, apenas tira o loading
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Falha ao carregar vendas:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Não foi possível carregar seus dados salvos.' });
    }
  }, []);

  // 2. PERSISTÊNCIA (Save)
  // Toda vez que state.sales mudar, tentamos salvar
  useEffect(() => {
    // Evita salvar enquanto ainda está carregando a primeira vez (evita sobrescrever com array vazio)
    if (state.isLoading) return;

    try {
      window.localStorage.setItem('sales', JSON.stringify(state.sales));
    } catch (error) {
      console.error('Falha ao salvar vendas:', error);

      // Tratamento específico para quota excedida (localStorage cheio)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        dispatch({
          type: 'SET_ERROR',
          payload:
            'Memória cheia! Não foi possível salvar a nova venda. Tente limpar dados antigos.',
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao salvar os dados localmente.' });
      }
    }
  }, [state.sales, state.isLoading]);

  return <SalesContext.Provider value={{ state, dispatch }}>{children}</SalesContext.Provider>;
};
