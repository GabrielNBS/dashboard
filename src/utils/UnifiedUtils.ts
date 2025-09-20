// ============================================================
// 🔹 Unified Utility Functions
// ============================================================
// Consolidated utility functions to eliminate duplication across
// formatting, calculation, and validation utilities

// Re-export existing utilities for centralized access
export { formatCurrency, formatPercent } from './formatting/formatCurrency';
export {
  normalizeQuantity,
  denormalizeQuantity,
  calculateUnitCost,
  formatQuantity,
  getBaseUnit,
} from './helpers/normalizeQuantity';
export {
  getTotalRevenue,
  getTotalVariableCost,
  getIntegratedVariableCost,
  getRealIngredientsCost,
  getTotalFixedCost,
  getGrossProfit,
  getNetProfit,
  getProfitMargin,
  getValueToSave,
  getBreakEven,
  getTotalUnitsSold,
} from './calculations/finance';
export {
  calculateIngredientTotalByUnitPrice,
  calculateSuggestedPrice,
  calculateRealProfitMargin,
  calculateUnitCost as calculateProductUnitCost,
  calculateSellingResume,
  getStockStatus,
} from './calculations/calcSale';

// ============================================================
// 🔹 Enhanced Formatting Functions
// ============================================================

/**
 * Format any numeric value with proper validation
 * Centralized number formatting with fallback handling
 */
export function formatNumber(
  value: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string {
  // Handle null/undefined/invalid values
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    console.warn('formatNumber: invalid value provided, returning 0');
    return '0';
  }

  try {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(numValue);
  } catch (error) {
    console.error('Error formatting number:', error);
    return numValue.toFixed(2);
  }
}

/**
 * Format percentage with consistent styling
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (!numValue || isNaN(numValue)) {
    return '0,0%';
  }

  return `${numValue.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Format date consistently across the application
 */
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// ============================================================
// 🔹 Enhanced Validation Functions
// ============================================================

/**
 * Comprehensive validation for required fields
 */
export function validateRequired(value: any, fieldName: string = 'Campo'): string | null {
  if (value === null || value === undefined) {
    return `${fieldName} é obrigatório`;
  }

  if (typeof value === 'string' && !value.trim()) {
    return `${fieldName} é obrigatório`;
  }

  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} deve ter pelo menos um item`;
  }

  return null;
}

/**
 * Enhanced number validation with range checking
 */
export function validateNumber(
  value: any,
  options: {
    min?: number;
    max?: number;
    allowZero?: boolean;
    fieldName?: string;
  } = {}
): string | null {
  const { min, max, allowZero = false, fieldName = 'Valor' } = options;

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return `${fieldName} deve ser um número válido`;
  }

  if (!allowZero && numValue === 0) {
    return `${fieldName} deve ser maior que zero`;
  }

  if (min !== undefined && numValue < min) {
    return `${fieldName} deve ser maior ou igual a ${min}`;
  }

  if (max !== undefined && numValue > max) {
    return `${fieldName} deve ser menor ou igual a ${max}`;
  }

  return null;
}

/**
 * Enhanced email validation
 */
export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email é obrigatório';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Email deve ter um formato válido';
  }

  return null;
}

// ============================================================
// 🔹 Enhanced Calculation Helpers
// ============================================================

/**
 * Safe division with fallback
 */
export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) {
    return fallback;
  }
  return numerator / denominator;
}

/**
 * Calculate percentage with safe division
 */
export function calculatePercentage(value: number, total: number, fallback: number = 0): number {
  return safeDivide(value * 100, total, fallback);
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============================================================
// 🔹 Array and Object Utilities
// ============================================================

/**
 * Group array items by a specified key
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = String(keyFn(item));
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sum array values by a specified key
 */
export function sumBy<T>(array: T[], keyFn: (item: T) => number): number {
  return array.reduce((sum, item) => sum + (keyFn(item) || 0), 0);
}

/**
 * Find unique values in array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Sort array by multiple criteria
 */
export function sortBy<T>(array: T[], ...sortFns: Array<(item: T) => string | number>): T[] {
  return [...array].sort((a, b) => {
    for (const sortFn of sortFns) {
      const aVal = sortFn(a);
      const bVal = sortFn(b);

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

// ============================================================
// 🔹 String Utilities
// ============================================================

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
    .trim();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

// ============================================================
// 🔹 Local Storage Utilities
// ============================================================

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// ============================================================
// 🔹 Debounce and Throttle Utilities
// ============================================================

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
