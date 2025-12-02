'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  AppSettings,
  StoreSettings,
  FixedCostSettings,
  VariableCostSettings,
  FinancialSettings,
  PaymentFeesSettings,
  SystemSettings,
} from '@/types/settings';

// Tipos de ações do reducer
type SettingsAction =
  | { type: 'UPDATE_STORE'; payload: Partial<StoreSettings> }
  | { type: 'ADD_FIXED_COST'; payload: FixedCostSettings }
  | { type: 'UPDATE_FIXED_COST'; payload: FixedCostSettings }
  | { type: 'REMOVE_FIXED_COST'; payload: string }
  | { type: 'ADD_VARIABLE_COST'; payload: VariableCostSettings }
  | { type: 'UPDATE_VARIABLE_COST'; payload: VariableCostSettings }
  | { type: 'REMOVE_VARIABLE_COST'; payload: string }
  | { type: 'UPDATE_FINANCIAL'; payload: Partial<FinancialSettings> }
  | { type: 'UPDATE_PAYMENT_FEES'; payload: Partial<PaymentFeesSettings> }
  | { type: 'UPDATE_SYSTEM'; payload: Partial<SystemSettings> }
  | { type: 'LOAD_SETTINGS'; payload: AppSettings }
  | { type: 'RESET_SETTINGS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Estado inicial das configurações
const defaultSettings: AppSettings = {
  store: {
    name: '',
    segment: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
  },
  fixedCosts: [],
  variableCosts: [],
  financial: {
    defaultProfitMargin: 33,
    emergencyReservePercentage: 0,
    monthlySalesGoal: 0,
    currency: 'BRL',
    currencyFormat: 'symbol',
  },
  paymentFees: {
    cash: 0,
    debit: 1.7,
    credit: 3.2,
    ifood: 12,
  },
  system: {
    language: 'pt-BR',
    theme: 'light',
    notifications: {
      lowStock: false,
      salesGoal: false,
      costAlerts: false,
      backupReminder: false,
    },
    backup: {
      autoBackup: false,
      backupFrequency: 'weekly',
      cloudBackup: false,
    },
  },
};

// Interface do estado interno do reducer
interface SettingsState extends AppSettings {
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  ...defaultSettings,
  isLoading: true,
  error: null,
};

// Reducer
function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_STORE':
      return { ...state, store: { ...state.store, ...action.payload }, error: null };

    case 'ADD_FIXED_COST':
      return { ...state, fixedCosts: [...state.fixedCosts, action.payload], error: null };

    case 'UPDATE_FIXED_COST':
      return {
        ...state,
        fixedCosts: state.fixedCosts.map(cost =>
          cost.id === action.payload.id ? action.payload : cost
        ),
        error: null,
      };

    case 'REMOVE_FIXED_COST':
      return {
        ...state,
        fixedCosts: state.fixedCosts.filter(cost => cost.id !== action.payload),
        error: null,
      };

    case 'ADD_VARIABLE_COST':
      return { ...state, variableCosts: [...state.variableCosts, action.payload], error: null };

    case 'UPDATE_VARIABLE_COST':
      return {
        ...state,
        variableCosts: state.variableCosts.map(cost =>
          cost.id === action.payload.id ? action.payload : cost
        ),
        error: null,
      };

    case 'REMOVE_VARIABLE_COST':
      return {
        ...state,
        variableCosts: state.variableCosts.filter(cost => cost.id !== action.payload),
        error: null,
      };

    case 'UPDATE_FINANCIAL':
      return { ...state, financial: { ...state.financial, ...action.payload }, error: null };

    case 'UPDATE_PAYMENT_FEES':
      return { ...state, paymentFees: { ...state.paymentFees, ...action.payload }, error: null };

    case 'UPDATE_SYSTEM':
      return { ...state, system: { ...state.system, ...action.payload }, error: null };

    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload, isLoading: false, error: null };

    case 'RESET_SETTINGS':
      return { ...defaultSettings, isLoading: false, error: null };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// Contexto
interface SettingsContextType {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  saveSettings: () => void;
  resetSettings: () => void;
  isLoading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // 1. CARREGAMENTO INICIAL (Load)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('dashboard-settings');
      if (item) {
        const parsedSettings = JSON.parse(item);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsedSettings });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Falha ao carregar configurações:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Não foi possível carregar suas configurações.' });
    }
  }, []);

  // 2. PERSISTÊNCIA (Save)
  useEffect(() => {
    if (state.isLoading) return;

    try {
      // Create a clean object without internal state properties like isLoading/error
      const settingsToSave: AppSettings = {
        store: state.store,
        fixedCosts: state.fixedCosts,
        variableCosts: state.variableCosts,
        financial: state.financial,
        paymentFees: state.paymentFees,
        system: state.system,
      };
      window.localStorage.setItem('dashboard-settings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Falha ao salvar configurações:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Memória cheia! Não foi possível salvar as configurações.',
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao salvar as configurações localmente.' });
      }
    }
  }, [state, state.isLoading]);

  // Stable functions that don't change on every render
  const saveSettings = React.useCallback(() => {
    // Trigger a save by updating state (though useEffect handles auto-save)
    // This might be redundant with auto-save but kept for API compatibility
  }, []);

  const resetSettings = React.useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
      saveSettings,
      resetSettings,
      isLoading: state.isLoading,
      error: state.error,
    }),
    [state, saveSettings, resetSettings]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

// Hook de acesso
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}

// Hook específico para paymentFees - OTIMIZADO
export function usePaymentFees() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('usePaymentFees deve ser usado dentro de um SettingsProvider');
  }

  const { state, dispatch } = context;

  const updatePaymentFees = React.useCallback(
    (payload: Partial<PaymentFeesSettings>) => {
      dispatch({ type: 'UPDATE_PAYMENT_FEES', payload });
    },
    [dispatch]
  );

  return React.useMemo(
    () => ({
      paymentFees: state.paymentFees,
      updatePaymentFees,
    }),
    [state.paymentFees, updatePaymentFees]
  );
}

// Hook específico para PDV que só lê as taxas - COMPLETAMENTE ISOLADO
export function usePaymentFeesReadOnly() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('usePaymentFeesReadOnly deve ser usado dentro de um SettingsProvider');
  }

  // Return a stable object that only changes when the actual values change
  return React.useMemo(
    () => ({
      cash: context.state.paymentFees.cash,
      debit: context.state.paymentFees.debit,
      credit: context.state.paymentFees.credit,
      ifood: context.state.paymentFees.ifood,
    }),
    [
      context.state.paymentFees.cash,
      context.state.paymentFees.debit,
      context.state.paymentFees.credit,
      context.state.paymentFees.ifood,
    ]
  );
}
