'use client';

import React, { useState, useRef } from 'react';
import { Button, Input } from '@/components/ui/base';
import { UnifiedDateFilterControls } from '@/components/ui/UnifiedDateFilterControls';
import { ExportButtons } from '@/components/dashboard/finance/ExportButtons';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { FinanceSummary } from '@/hooks/business/useSummaryFinance';
import { Sale } from '@/types/sale';
import { DateRange, UnifiedFilterState } from '@/hooks/ui/useUnifiedFilter';

interface CollapsibleFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  quickDateFilter: UnifiedFilterState['quickDateFilter'];
  setQuickDateFilter: (filter: UnifiedFilterState['quickDateFilter']) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  financialSummary: FinanceSummary;
  sales: Sale[];
}

export default function CollapsibleFilters({
  search,
  setSearch,
  dateRange,
  setDateRange,
  quickDateFilter,
  setQuickDateFilter,
  resetFilters,
  hasActiveFilters,
  financialSummary,
  sales,
}: CollapsibleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const scrollToCenter = () => {
    if (containerRef.current) {
      const element = containerRef.current;
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

      window.scrollTo({
        top: middle,
        behavior: 'smooth',
      });
    }
  };

  const toggleExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isExpanded) {
      // Expandindo - fazer scroll após um pequeno delay para permitir a animação começar
      setIsExpanded(true);
      setTimeout(() => {
        scrollToCenter();
      }, 100);
    } else {
      // Colapsando - apenas fechar
      setIsExpanded(false);
    }

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      ref={containerRef}
      className="bg-secondary rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Header compacto - sempre visível */}
      <div
        className={`flex cursor-pointer items-center justify-between p-3 transition-all duration-200 ${
          isExpanded ? 'bg-muted' : 'hover:bg-muted'
        } ${isAnimating ? 'pointer-events-none' : ''}`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <span className="text-foreground text-sm font-medium">Filtros</span>
          </div>

          {/* Indicadores de filtros ativos */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              {search && (
                <div className="bg-info text-on-info flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                  <Search className="h-3 w-3" />
                  <span className="max-w-20 truncate">{search}</span>
                </div>
              )}
              {(dateRange?.startDate || quickDateFilter !== 'all') && (
                <div className="bg-great text-on-great rounded-full px-2 py-1 text-xs">
                  Data filtrada
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de limpar filtros - sempre visível quando há filtros */}
          {hasActiveFilters && (
            <Button
              onClick={e => {
                e.stopPropagation();
                resetFilters();
              }}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Ícone de expansão com animação */}
          <div
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          >
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Conteúdo expandido com animação */}
      <div
        ref={contentRef}
        className={`bg-muted overflow-hidden border-t transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className={`p-4 transition-all duration-300 ${isExpanded ? 'translate-y-0' : '-translate-y-4'}`}
        >
          <div className="flex flex-col gap-4">
            {/* Campo de busca */}
            <div>
              <label
                htmlFor="search"
                className="text-muted-foreground mb-2 block text-sm font-medium"
              >
                Buscar Produto na Venda
              </label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ex: Bolo de chocolate"
                  className="w-full pl-10 lg:w-2/3"
                />
              </div>
            </div>

            {/* Controles de data e export */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Controles de Data */}
              <div className="flex-1">
                <UnifiedDateFilterControls
                  dateRange={dateRange}
                  quickDateFilter={quickDateFilter}
                  onDateRangeChange={setDateRange}
                  onQuickFilterChange={setQuickDateFilter}
                />
              </div>

              {/* Botões de Export */}
              <div className="flex-shrink-0">
                <ExportButtons financialSummary={financialSummary} sales={sales} />
              </div>
            </div>

            {/* Botão de limpar filtros expandido */}
            {hasActiveFilters && (
              <div className="border-t pt-2">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
