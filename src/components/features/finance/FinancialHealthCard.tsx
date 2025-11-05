'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';
import type { FinancialHealthIndicators } from '@/utils/calculations/finance';
import { cn } from '@/utils/utils';

interface FinancialHealthCardProps {
  healthIndicators: FinancialHealthIndicators;
  className?: string;
}

export default function FinancialHealthCard({
  healthIndicators,
  className,
}: FinancialHealthCardProps) {
  const { status, alerts, recommendations } = healthIndicators;

  const getStatusConfig = () => {
    switch (status) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-critical/10',
          borderColor: 'border-critical',
          iconColor: 'text-critical',
          title: 'Situação Crítica',
          titleColor: 'text-critical',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          iconColor: 'text-warning',
          title: 'Atenção Necessária',
          titleColor: 'text-warning',
        };
      case 'healthy':
        return {
          icon: CheckCircle,
          bgColor: 'bg-great/10',
          borderColor: 'border-great',
          iconColor: 'text-great',
          title: 'Situação Saudável',
          titleColor: 'text-great',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 transition-all duration-300',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className={cn('rounded-full p-2', config.bgColor)}>
          <StatusIcon className={cn('h-6 w-6', config.iconColor)} />
        </div>
        <div>
          <h3 className={cn('text-lg font-semibold', config.titleColor)}>{config.title}</h3>
          <p className="text-muted-foreground text-sm">Análise Financeira</p>
        </div>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="text-muted-foreground h-4 w-4" />
            <h4 className="text-foreground text-sm font-medium">Indicadores</h4>
          </div>
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="text-muted-foreground flex items-start gap-2 text-sm">
                <span className="mt-1">•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="text-accent h-4 w-4" />
            <h4 className="text-foreground text-sm font-medium">Recomendações</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-muted-foreground flex items-start gap-2 text-sm">
                <span className="mt-1">→</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
