'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
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
  | { type: 'RESET_SETTINGS' };

// Estado inicial das configurações
const defaultSettings: AppSettings = {
  store: {
    storeName: '',
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
    defaultProfitMargin: 0,
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

// Reducer
function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
  switch (action.type) {
    case 'UPDATE_STORE':
      return { ...state, store: { ...state.store, ...action.payload } };

    case 'ADD_FIXED_COST':
      return { ...state, fixedCosts: [...state.fixedCosts, action.payload] };

    case 'UPDATE_FIXED_COST':
      return {
        ...state,
        fixedCosts: state.fixedCosts.map(cost =>
          cost.id === action.payload.id ? action.payload : cost
        ),
      };

    case 'REMOVE_FIXED_COST':
      return {
        ...state,
        fixedCosts: state.fixedCosts.filter(cost => cost.id !== action.payload),
      };

    case 'ADD_VARIABLE_COST':
      return { ...state, variableCosts: [...state.variableCosts, action.payload] };

    case 'UPDATE_VARIABLE_COST':
      return {
        ...state,
        variableCosts: state.variableCosts.map(cost =>
          cost.id === action.payload.id ? action.payload : cost
        ),
      };

    case 'REMOVE_VARIABLE_COST':
      return {
        ...state,
        variableCosts: state.variableCosts.filter(cost => cost.id !== action.payload),
      };

    case 'UPDATE_FINANCIAL':
      return { ...state, financial: { ...state.financial, ...action.payload } };

    case 'UPDATE_PAYMENT_FEES':
      return { ...state, paymentFees: { ...state.paymentFees, ...action.payload } };

    case 'UPDATE_SYSTEM':
      return { ...state, system: { ...state.system, ...action.payload } };

    case 'LOAD_SETTINGS':
      return action.payload;

    case 'RESET_SETTINGS':
      return defaultSettings;

    default:
      return state;
  }
}

// Contexto
interface SettingsContextType {
  state: AppSettings;
  dispatch: React.Dispatch<SettingsAction>;
  saveSettings: () => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage on mount - ONLY ONCE
  const [initialState] = React.useState<AppSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;

    try {
      const stored = localStorage.getItem('dashboard-settings');
      if (!stored) return defaultSettings;

      const parsed = JSON.parse(stored);
      return {
        ...defaultSettings,
        ...parsed,
        paymentFees: {
          ...defaultSettings.paymentFees,
          ...parsed?.paymentFees,
        },
      };
    } catch {
      return defaultSettings;
    }
  });

  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedState = useRef<string>('');

  // Save to localStorage with proper debouncing and change detection
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastSavedState.current = JSON.stringify(state);
      return;
    }

    const currentStateString = JSON.stringify(state);

    // Only proceed if state actually changed
    if (currentStateString === lastSavedState.current) {
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for saving
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('dashboard-settings', currentStateString);
        lastSavedState.current = currentStateString;
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
      }
    }, 1000); // 1 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state]);

  // Stable functions that don't change on every render
  const saveSettings = React.useCallback(() => {
    try {
      const stateString = JSON.stringify(state);
      localStorage.setItem('dashboard-settings', stateString);
      lastSavedState.current = stateString;
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [state]);

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
