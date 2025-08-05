// src/contexts/settings/SettingsContext.tsx
// Contexto para gerenciar configurações da aplicação

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  AppSettings,
  StoreSettings,
  FixedCostSettings,
  VariableCostSettings,
  FinancialSettings,
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
  | { type: 'UPDATE_SYSTEM'; payload: Partial<SystemSettings> }
  | { type: 'LOAD_SETTINGS'; payload: AppSettings }
  | { type: 'RESET_SETTINGS' };

// Estado inicial das configurações
const defaultSettings: AppSettings = {
  store: {
    storeName: 'Minha Loja',
    segment: 'Alimentação',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
  },
  fixedCosts: [
    {
      id: '1',
      name: 'Aluguel',
      amount: 1500,
      recurrence: 'mensal',
      category: 'aluguel',
      dueDate: '2024-01-05',
      notes: 'Aluguel do ponto comercial',
    },
  ],
  variableCosts: [
    {
      id: '1',
      name: 'Ingredientes',
      type: 'ingredientes',
      category: 'materia_prima',
      percentage: 60,
      notes: 'Custo com ingredientes por venda',
    },
  ],
  financial: {
    defaultProfitMargin: 30,
    emergencyReservePercentage: 10,
    monthlySalesGoal: 50000,
    currency: 'BRL',
    currencyFormat: 'symbol',
  },
  system: {
    language: 'pt-BR',
    theme: 'light',
    notifications: {
      lowStock: true,
      salesGoal: true,
      costAlerts: true,
      backupReminder: false,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'weekly',
      cloudBackup: false,
    },
  },
};

// Função reducer para gerenciar o estado
function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
  switch (action.type) {
    case 'UPDATE_STORE':
      return {
        ...state,
        store: { ...state.store, ...action.payload },
      };

    case 'ADD_FIXED_COST':
      return {
        ...state,
        fixedCosts: [...state.fixedCosts, action.payload],
      };

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
      return {
        ...state,
        variableCosts: [...state.variableCosts, action.payload],
      };

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
      return {
        ...state,
        financial: { ...state.financial, ...action.payload },
      };

    case 'UPDATE_SYSTEM':
      return {
        ...state,
        system: { ...state.system, ...action.payload },
      };

    case 'LOAD_SETTINGS':
      return action.payload;

    case 'RESET_SETTINGS':
      return defaultSettings;

    default:
      return state;
  }
}

// Interface do contexto
interface SettingsContextType {
  state: AppSettings;
  dispatch: React.Dispatch<SettingsAction>;
  saveSettings: () => void;
  loadSettings: () => void;
  resetSettings: () => void;
}

// Criação do contexto
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider do contexto
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettings);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboard-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsedSettings });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Salvar configurações no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('dashboard-settings', JSON.stringify(state));
  }, [state]);

  // Função para salvar configurações
  const saveSettings = () => {
    localStorage.setItem('dashboard-settings', JSON.stringify(state));
  };

  // Função para carregar configurações
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('dashboard-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsedSettings });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  };

  // Função para resetar configurações
  const resetSettings = () => {
    dispatch({ type: 'RESET_SETTINGS' });
  };

  const value: SettingsContextType = {
    state,
    dispatch,
    saveSettings,
    loadSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// Hook para usar o contexto
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
