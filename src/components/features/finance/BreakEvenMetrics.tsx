'use client';

import React from 'react';
import { Target, Package, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import type { BreakEvenProjection } from '@/utils/calculations/finance';
import { cn } from '@/utils/utils';

interface BreakEvenMetricsProps {
  breakEvenUnits: number;
  averageSellingPrice: number;
  contributionMarginPercentage: number;
  breakEvenProjection: BreakEvenProjection | null;
  className?: string;
}

export default function BreakEvenMetrics({
  breakEvenUnits,
  averageSellingPrice,
  contributionMarginPercentage,
  breakEvenProjection,
  className,
}: BreakEvenMetricsProps) {
  const isInfinite = !isFinite(breakEvenUnits) || breakEvenUnits === Infinity;

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Ponto de Equilíbrio em Unidades */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <Target className="text-primary h-5 w-5" />
          <h4 className="text-foreground text-sm font-medium">Ponto de Equilíbrio</h4>
        </div>
        <p className="text-foreground text-2xl font-bold">{isInfinite ? '∞' : breakEvenUnits}</p>
        <p className="text-muted-foreground text-xs">
          {isInfinite ? 'Negócio não é viável' : 'unidades necessárias'}
        </p>
      </div>

      {/* Preço Médio de Venda */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <Package className="text-accent h-5 w-5" />
          <h4 className="text-foreground text-sm font-medium">Preço Médio</h4>
        </div>
        <p className="text-foreground text-2xl font-bold">{formatCurrency(averageSellingPrice)}</p>
        <p className="text-muted-foreground text-xs">por unidade vendida</p>
      </div>

      {/* Margem de Contribuição */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="text-great h-5 w-5" />
          <h4 className="text-foreground text-sm font-medium">Margem de Contribuição</h4>
        </div>
        <p className="text-foreground text-2xl font-bold">
          {contributionMarginPercentage.toFixed(1)}%
        </p>
        <p className="text-muted-foreground text-xs">lucro antes dos custos fixos</p>
      </div>

      {/* Projeção de Equilíbrio */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <Calendar className="text-info h-5 w-5" />
          <h4 className="text-foreground text-sm font-medium">Projeção</h4>
        </div>
        {breakEvenProjection ? (
          <>
            <p className="text-foreground text-2xl font-bold">
              {breakEvenProjection.daysToBreakEven}
            </p>
            <p className="text-muted-foreground text-xs">dias para atingir o ponto de equilíbrio</p>
          </>
        ) : (
          <>
            <p className="text-great text-2xl font-bold">✓</p>
            <p className="text-muted-foreground text-xs">Ponto de equilíbrio atingido</p>
          </>
        )}
      </div>
    </div>
  );
}
