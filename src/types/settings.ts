/**
 * Configurações básicas da loja
 */
export interface StoreSettings {
  storeName: string;
  segment: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
}

/**
 * Configurações de custos fixos
 */
export interface FixedCostSettings {
  /** ID único do custo fixo */
  id: string;
  /** Nome/descrição do custo */
  name: string;
  /** Valor do custo */
  amount: number;
  /** Recorrência do custo */
  recurrence: 'mensal' | 'semanal' | 'diario' | 'anual';
  /** Categoria do custo */
  category: 'aluguel' | 'energia' | 'agua' | 'internet' | 'funcionarios' | 'outros';
  /** Data de vencimento (opcional) */
  dueDate?: string;
  /** Observações adicionais */
  notes?: string;
}

/**
 * Configurações de custos variáveis
 */
export interface VariableCostSettings {
  /** ID único do custo variável */
  id: string;
  /** Nome/descrição do custo */
  name: string;
  /** Tipo de custo variável */
  type: 'ingredientes' | 'embalagens' | 'comissoes' | 'outros';
  /** Percentual sobre vendas (0-100) */
  percentage?: number;
  /** Valor fixo por unidade */
  fixedValue?: number;
  /** Categoria do custo */
  category: 'materia_prima' | 'operacional' | 'comercial' | 'outros';
  /** Observações adicionais */
  notes?: string;
}

/**
 * Configurações financeiras
 */
export interface FinancialSettings {
  /** Percentual de margem de lucro padrão */
  defaultProfitMargin: number;
  /** Percentual para reserva de emergência */
  emergencyReservePercentage: number;
  /** Meta de vendas mensal */
  monthlySalesGoal: number;
  /** Moeda utilizada */
  currency: 'BRL' | 'USD' | 'EUR';
  /** Formato de exibição de valores */
  currencyFormat: 'symbol' | 'code' | 'name';
}

/**
 * Configurações gerais do sistema
 */
export interface SystemSettings {
  /** Idioma do sistema */
  language: 'pt-BR' | 'en-US' | 'es-ES';
  /** Tema do sistema */
  theme: 'light' | 'dark' | 'auto';
  /** Notificações ativas */
  notifications: {
    lowStock: boolean;
    salesGoal: boolean;
    costAlerts: boolean;
    backupReminder: boolean;
  };
  /** Configurações de backup */
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    cloudBackup: boolean;
  };
}

/**
 * Interface completa das configurações
 */
export interface AppSettings {
  store: StoreSettings;
  fixedCosts: FixedCostSettings[];
  variableCosts: VariableCostSettings[];
  financial: FinancialSettings;
  system: SystemSettings;
}
