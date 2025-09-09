// ============================================================
// 🔹 Hook Extendido para Filtragem com Data
// ============================================================

import { useMemo, useState } from 'react';
import { FilterableItem, FilterConfig } from './useFilter'; // Import do seu hook original

// Tipos para filtro de data
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateFilterConfig<T extends FilterableItem> extends FilterConfig<T> {
  dateField: keyof T; // Campo que contém a data (ex: 'createdAt', 'saleDate', etc.)
  dateFormat?: 'iso' | 'timestamp' | 'string'; // Formato da data no objeto
}

export interface ExtendedFilterState {
  search: string;
  statusFilter: string;
  dateRange: DateRange;
  quickDateFilter: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year';
}

// Utilitários para trabalhar com datas
const dateUtils = {
  // Converte diferentes formatos de data para Date
  parseDate: (value: unknown, format: 'iso' | 'timestamp' | 'string' = 'iso'): Date | null => {
    if (!value) return null;

    try {
      switch (format) {
        case 'timestamp':
          return new Date(Number(value));
        case 'string':
          return new Date(String(value));
        case 'iso':
        default:
          return new Date(String(value));
      }
    } catch {
      return null;
    }
  },

  // Verifica se uma data está dentro de um intervalo
  isDateInRange: (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
    if (!startDate && !endDate) return true;

    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (startDate && endDate) {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      return targetDate >= start && targetDate <= end;
    }

    if (startDate) {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      return targetDate >= start;
    }

    if (endDate) {
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      return targetDate <= end;
    }

    return true;
  },

  // Gera intervalos de data pré-definidos
  getQuickDateRange: (type: string): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (type) {
      case 'today':
        return { startDate: today, endDate: today };

      case 'week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { startDate: startOfWeek, endDate: today };
      }

      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { startDate: startOfMonth, endDate: today };
      }

      case 'quarter': {
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return { startDate: quarterStart, endDate: today };
      }

      case 'year': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return { startDate: startOfYear, endDate: today };
      }

      default:
        return { startDate: null, endDate: null };
    }
  },
};

// Hook principal com filtro de data
export function useProductFilterWithDate<T extends FilterableItem>(
  items: T[],
  config: DateFilterConfig<T>,
  initialState: ExtendedFilterState = {
    search: '',
    statusFilter: 'all',
    dateRange: { startDate: null, endDate: null },
    quickDateFilter: 'all',
  }
) {
  const [search, setSearch] = useState(initialState.search);
  const [statusFilter, setStatusFilter] = useState(initialState.statusFilter);
  const [dateRange, setDateRange] = useState<DateRange>(initialState.dateRange);
  const [quickDateFilter, setQuickDateFilter] = useState(initialState.quickDateFilter);

  const filteredItems = useMemo(() => {
    const searchLower = search.toLowerCase();

    // Determina o intervalo de data a ser usado
    const effectiveDateRange =
      quickDateFilter !== 'all' ? dateUtils.getQuickDateRange(quickDateFilter) : dateRange;

    return items
      .filter(item => {
        // Filtro de busca em múltiplos campos
        const matchesSearch = config.searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(searchLower);
        });

        // Filtro de status (se configurado)
        const matchesStatus =
          !config.statusField ||
          statusFilter === 'all' ||
          item[config.statusField] === statusFilter;

        // Filtro de data
        const matchesDate = (() => {
          const dateValue = item[config.dateField];
          if (!dateValue) return true; // Se não tem data, não filtra

          const parsedDate = dateUtils.parseDate(dateValue, config.dateFormat);
          if (!parsedDate) return true; // Se não conseguir parsear, não filtra

          return dateUtils.isDateInRange(
            parsedDate,
            effectiveDateRange.startDate,
            effectiveDateRange.endDate
          );
        })();

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort(
        config.sortFn ||
          ((a, b) => {
            // Sort por data por padrão (mais recente primeiro)
            const dateA = dateUtils.parseDate(a[config.dateField], config.dateFormat);
            const dateB = dateUtils.parseDate(b[config.dateField], config.dateFormat);

            if (dateA && dateB) {
              return dateB.getTime() - dateA.getTime();
            }

            // Fallback para ID/UID
            const aKey = (a.id || a.uid || '') as string;
            const bKey = (b.id || b.uid || '') as string;
            return aKey.localeCompare(bKey);
          })
      );
  }, [items, search, statusFilter, dateRange, quickDateFilter, config]);

  // Handler para filtro rápido de data
  const setQuickDateFilterWithRange = (filter: ExtendedFilterState['quickDateFilter']) => {
    setQuickDateFilter(filter);
    if (filter !== 'all') {
      setDateRange({ startDate: null, endDate: null }); // Limpa range customizado
    }
  };

  // Handler para range customizado
  const setCustomDateRange = (range: DateRange) => {
    setDateRange(range);
    setQuickDateFilter('all'); // Limpa filtro rápido
  };

  return {
    // Estados
    search,
    statusFilter,
    dateRange,
    quickDateFilter,
    filteredItems,

    // Setters básicos
    setSearch,
    setStatusFilter,
    setDateRange: setCustomDateRange,
    setQuickDateFilter: setQuickDateFilterWithRange,

    // Utilitários
    resetFilters: () => {
      setSearch('');
      setStatusFilter('all');
      setDateRange({ startDate: null, endDate: null });
      setQuickDateFilter('all');
    },

    hasActiveFilters:
      search !== '' ||
      statusFilter !== 'all' ||
      quickDateFilter !== 'all' ||
      dateRange.startDate !== null ||
      dateRange.endDate !== null,

    totalItems: items.length,
    filteredCount: filteredItems.length,

    // Helpers específicos para data
    getEffectiveDateRange: () =>
      quickDateFilter !== 'all' ? dateUtils.getQuickDateRange(quickDateFilter) : dateRange,

    dateUtils, // Exporta utilitários para uso externo
  };
}

// ============================================================
// 🔹 Exemplo de Uso com Produtos
// ============================================================

// Tipo exemplo de produto
interface Product extends FilterableItem {
  uid: string;
  name: string;
  category: string;
  price: number;
  createdAt: string; // ISO date string
  status: 'active' | 'inactive';
}

// Hook especializado para produtos
export function useProductFilter(
  products: Product[],
  initialFilters?: Partial<ExtendedFilterState>
) {
  return useProductFilterWithDate(
    products,
    {
      searchFields: ['name', 'category'], // Campos para busca de texto
      statusField: 'status', // Campo para filtro de status
      dateField: 'createdAt', // Campo de data
      dateFormat: 'iso', // Formato da data
      sortFn: (a, b) => {
        // Ordena por data de criação (mais recente primeiro)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      },
    },
    {
      search: '',
      statusFilter: 'all',
      dateRange: { startDate: null, endDate: null },
      quickDateFilter: 'all',
      ...initialFilters,
    }
  );
}

// ============================================================
// 🔹 Componente de Filtros de Data
// ============================================================

interface DateFilterControlsProps {
  quickDateFilter: ExtendedFilterState['quickDateFilter'];
  dateRange: DateRange;
  onQuickFilterChange: (filter: ExtendedFilterState['quickDateFilter']) => void;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export function DateFilterControls({
  quickDateFilter,
  dateRange,
  onQuickFilterChange,
  onDateRangeChange,
  className = '',
}: DateFilterControlsProps) {
  const quickFilters = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Este Ano' },
  ] as const;

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateInputChange = (type: 'start' | 'end', value: string) => {
    const newDate = value ? new Date(value) : null;
    onDateRangeChange({
      ...dateRange,
      [type === 'start' ? 'startDate' : 'endDate']: newDate,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filtros rápidos */}
      <div>
        <label className="mb-2 block text-sm font-medium">Período</label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => onQuickFilterChange(filter.value)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                quickDateFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Range customizado */}
      <div>
        <label className="mb-2 block text-sm font-medium">Período Customizado</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={formatDateForInput(dateRange.startDate)}
            onChange={e => handleDateInputChange('start', e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
            placeholder="Data inicial"
          />
          <span className="text-gray-500">até</span>
          <input
            type="date"
            value={formatDateForInput(dateRange.endDate)}
            onChange={e => handleDateInputChange('end', e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
            placeholder="Data final"
          />
        </div>
      </div>
    </div>
  );
}
