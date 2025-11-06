// src/components/ui/feedback/BatchBadge.tsx
'use client';

import React from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface BatchBadgeProps {
  yieldQuantity: number;
  availableQuantity: number;
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
}

export default function BatchBadge({
  yieldQuantity,
  availableQuantity,
  variant = 'default',
  showIcon = true,
}: BatchBadgeProps) {
  const percentage = (availableQuantity / yieldQuantity) * 100;

  // Determina o status baseado na disponibilidade
  const getStatus = () => {
    if (availableQuantity === 0) return 'unavailable';
    if (percentage < 25) return 'critical';
    if (percentage < 50) return 'warning';
    if (percentage < 100) return 'partial';
    return 'full';
  };

  const status = getStatus();

  const statusConfig = {
    full: {
      color: 'bg-great text-on-great',
      icon: CheckCircle,
      label: 'Lote Completo',
    },
    partial: {
      color: 'bg-primary text-secondary',
      icon: Package,
      label: 'Parcialmente Disponível',
    },
    warning: {
      color: 'bg-warning text-on-warning',
      icon: AlertTriangle,
      label: 'Estoque Baixo',
    },
    critical: {
      color: 'bg-bad text-on-bad ',
      icon: AlertTriangle,
      label: 'Estoque Crítico',
    },
    unavailable: {
      color: 'bg-muted-foreground text-muted',
      icon: XCircle,
      label: 'Indisponível',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${config.color}`}
      >
        {showIcon && <Icon className="h-3 w-3" />}
        <span>
          {availableQuantity}/{yieldQuantity}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`rounded-lg border p-3 ${config.color}`}>
        <div className="mb-2 flex items-center gap-2">
          {showIcon && <Icon className="h-4 w-4" />}
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Disponível:</span>
            <span className="font-medium">{availableQuantity} unidades</span>
          </div>
          <div className="flex justify-between">
            <span>Total do lote:</span>
            <span className="font-medium">{yieldQuantity} unidades</span>
          </div>
          <div className="flex justify-between">
            <span>Percentual:</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="h-2 overflow-hidden rounded-full bg-white/50">
            <div
              className={`h-full transition-all duration-300 ${
                status === 'full'
                  ? 'bg-green-600'
                  : status === 'partial'
                    ? 'bg-blue-600'
                    : status === 'warning'
                      ? 'bg-orange-600'
                      : status === 'critical'
                        ? 'bg-red-600'
                        : 'bg-gray-400'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`border-muted inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium ${config.color}`}
    >
      {showIcon && <Icon className="h-4 w-4" />}
      <span>
        Lote: {availableQuantity}/{yieldQuantity}
      </span>
    </div>
  );
}
