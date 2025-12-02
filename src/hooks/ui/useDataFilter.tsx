// ============================================================
// 🔹 Hook Extendido para Filtragem com Data
// ============================================================

import {
  endOfDay,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { FilterableItem, FilterConfig } from './useFilter'; // Import do seu hook original
import Input from '@/components/ui/base/Input';
import { Label } from '@/components/ui/base/label';
import Button from '@/components/ui/base/Button';

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
      const parsed =
        format === 'timestamp'
          ? new Date(Number(value))
          : format === 'string'
            ? new Date(String(value))
            : parseISO(String(value));

      if (!isValid(parsed)) return null;

      return parsed;
    } catch {
      return null;
    }
  },

  // Verifica se uma data está dentro de um intervalo
  isDateInRange: (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
    if (!startDate && !endDate) return true;

    const targetDate = startOfDay(date);

    if (startDate && endDate) {
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);
      return targetDate >= start && targetDate <= end;
    }

    if (startDate) {
      const start = startOfDay(startDate);
      return targetDate >= start;
    }

    if (endDate) {
      const end = endOfDay(endDate);
      return targetDate <= end;
    }

    return true;
  },

  // Gera intervalos de data pré-definidos
  getQuickDateRange: (type: string): DateRange => {
    const today = startOfDay(new Date());

    switch (type) {
      case 'today':
        return { startDate: today, endDate: today };

      case 'week': {
        const weekStart = startOfWeek(today);
        return { startDate: weekStart, endDate: today };
      }

      case 'month': {
        const monthStart = startOfMonth(today);
        return { startDate: monthStart, endDate: today };
      }

      case 'quarter': {
        const quarterStart = startOfQuarter(today);
        return { startDate: quarterStart, endDate: today };
      }

      case 'year': {
        const yearStart = startOfYear(today);
        return { startDate: yearStart, endDate: today };
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
        <Label className="mb-2 block text-sm font-medium">Período</Label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(filter => (
            <Button
              key={filter.value}
              onClick={() => onQuickFilterChange(filter.value)}
              variant={quickDateFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              className="cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Range customizado */}
      <div>
        <Label className="mb-2 block text-sm font-medium">Período Customizado</Label>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={formatDateForInput(dateRange.startDate)}
            onChange={e => handleDateInputChange('start', e.target.value)}
            className="border-border rounded-md border px-3 py-2"
            placeholder="Data inicial"
          />
          <span className="text-muted-foreground">até</span>
          <Input
            type="date"
            value={formatDateForInput(dateRange.endDate)}
            onChange={e => handleDateInputChange('end', e.target.value)}
            className="border-border rounded-md border px-3 py-2"
            placeholder="Data final"
          />
        </div>
      </div>
    </div>
  );
}
