export const RECURRENCE_OPTIONS = ['mensal', 'semanal', 'diario', 'anual'] as const;

export const FIXED_COST_CATEGORIES = [
  'aluguel',
  'energia',
  'agua',
  'internet',
  'funcionarios',
  'outros',
] as const;

export const VARIABLE_COST_TYPES = ['ingredientes', 'embalagens', 'comissoes', 'outros'] as const;

export const VARIABLE_COST_CATEGORIES = [
  'materia_prima',
  'operacional',
  'comercial',
  'outros',
] as const;

export const CURRENCIES = ['BRL', 'USD', 'EUR'] as const;
export const CURRENCY_FORMATS = ['symbol', 'code', 'name'] as const;

export const LANGUAGES = ['pt-BR', 'en-US', 'es-ES'] as const;
export const THEMES = ['light', 'dark', 'auto'] as const;
export const BACKUP_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;

export type RecurrenceType = (typeof RECURRENCE_OPTIONS)[number];
export type FixedCostCategory = (typeof FIXED_COST_CATEGORIES)[number];
export type VariableCostType = (typeof VARIABLE_COST_TYPES)[number];
export type VariableCostCategory = (typeof VARIABLE_COST_CATEGORIES)[number];
export type CurrencyType = (typeof CURRENCIES)[number];
export type CurrencyFormat = (typeof CURRENCY_FORMATS)[number];
export type LanguageType = (typeof LANGUAGES)[number];
export type ThemeType = (typeof THEMES)[number];
export type BackupFrequency = (typeof BACKUP_FREQUENCIES)[number];

export interface StoreSettings {
  name: string;
  segment: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
}

export interface FixedCostSettings {
  id: string;
  name: string;
  amount: number;
  recurrence: RecurrenceType;
  category: FixedCostCategory;
  dueDate?: string;
  notes?: string;
}

export interface VariableCostSettings {
  id: string;
  name: string;
  type: VariableCostType;
  percentage?: number;
  fixedValue?: number;
  category: VariableCostCategory;
  notes?: string;
}

export interface PaymentFeesSettings {
  cash: number;
  debit: number;
  credit: number;
  ifood: number;
}

export interface FinancialSettings {
  defaultProfitMargin: number;
  emergencyReservePercentage: number;
  monthlySalesGoal: number;
  currency: CurrencyType;
  currencyFormat: CurrencyFormat;
}

export interface SystemSettings {
  language: LanguageType;
  theme: ThemeType;
  notifications: {
    lowStock: boolean;
    salesGoal: boolean;
    costAlerts: boolean;
    backupReminder: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: BackupFrequency;
    cloudBackup: boolean;
  };
}

export interface AppSettings {
  store: StoreSettings;
  fixedCosts: FixedCostSettings[];
  variableCosts: VariableCostSettings[];
  financial: FinancialSettings;
  paymentFees: PaymentFeesSettings;
  system: SystemSettings;
}
