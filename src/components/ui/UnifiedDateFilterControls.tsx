// ============================================================
// 🔹 Unified Date Filter Controls Component
// ============================================================
// Reusable component for date filtering across the application
// Replaces duplicate date filter implementations

import React from 'react';
import { DateRange, UnifiedFilterState } from '@/hooks/ui/useUnifiedFilter';

interface UnifiedDateFilterControlsProps {
  quickDateFilter: UnifiedFilterState['quickDateFilter'];
  dateRange: DateRange;
  onQuickFilterChange: (filter: UnifiedFilterState['quickDateFilter']) => void;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
  showCustomRange?: boolean; // Option to hide custom date inputs
}

/**
 * Unified date filter controls component
 * Provides both quick filters and custom date range selection
 *
 * @param quickDateFilter - Currently selected quick filter
 * @param dateRange - Current custom date range
 * @param onQuickFilterChange - Handler for quick filter changes
 * @param onDateRangeChange - Handler for custom date range changes
 * @param className - Additional CSS classes
 * @param showCustomRange - Whether to show custom date range inputs
 */
export function UnifiedDateFilterControls({
  quickDateFilter,
  dateRange,
  onQuickFilterChange,
  onDateRangeChange,
  className = '',
  showCustomRange = true,
}: UnifiedDateFilterControlsProps) {
  // Predefined quick filter options
  const quickFilters = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Este Ano' },
  ] as const;

  // Format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Handle date input changes
  const handleDateInputChange = (type: 'start' | 'end', value: string) => {
    const newDate = value ? new Date(value) : null;
    onDateRangeChange({
      ...dateRange,
      [type === 'start' ? 'startDate' : 'endDate']: newDate,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick date filter buttons */}
      <div>
        <label className="text-primary mb-2 block text-sm font-medium">Período</label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => onQuickFilterChange(filter.value)}
              className={`cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                quickDateFilter === filter.value
                  ? 'bg-accent text-surface'
                  : 'bg-gray-muted hover:bg-muted/90 text-primary'
              }`}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range inputs */}
      {showCustomRange && (
        <div>
          <label className="text-primary mb-2 block text-sm font-medium">Período Customizado</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={formatDateForInput(dateRange.startDate)}
              onChange={e => handleDateInputChange('start', e.target.value)}
              className="text-primary rounded-md border border-gray-300 px-3 py-2"
              placeholder="Data inicial"
            />
            <span className="text-primary/60">até</span>
            <input
              type="date"
              value={formatDateForInput(dateRange.endDate)}
              onChange={e => handleDateInputChange('end', e.target.value)}
              className="text-primary rounded-md border border-gray-300 px-3 py-2"
              placeholder="Data final"
            />
          </div>
        </div>
      )}
    </div>
  );
}
