// src/components/ui/feedback/BatchAlert.tsx
'use client';

import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface BatchAlertProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  details?: string[];
  showIcon?: boolean;
  className?: string;
}

export default function BatchAlert({
  type,
  title,
  message,
  details,
  showIcon = true,
  className = '',
}: BatchAlertProps) {
  const alertConfig = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      icon: Info,
    },
    warning: {
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600',
      icon: AlertTriangle,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      icon: XCircle,
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      icon: CheckCircle,
    },
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">
          <h4 className={`font-medium ${config.textColor}`}>{title}</h4>
          {message && <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>{message}</p>}
          {details && details.length > 0 && (
            <ul className={`mt-2 space-y-1 text-sm ${config.textColor} opacity-80`}>
              {details.map((detail, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-current" />
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente específico para alertas de lote
interface BatchValidationAlertProps {
  isValid: boolean;
  missingIngredients?: string[];
  maxAvailable: number;
  requestedQuantity: number;
  yieldQuantity: number;
}

export function BatchValidationAlert({
  isValid,
  missingIngredients = [],
  maxAvailable,
  requestedQuantity,
  yieldQuantity,
}: BatchValidationAlertProps) {
  if (isValid && requestedQuantity <= maxAvailable) {
    return (
      <BatchAlert
        type="success"
        title="Venda Autorizada"
        message={`Você pode vender ${requestedQuantity} unidades deste lote.`}
        details={[
          `Disponível: ${maxAvailable}/${yieldQuantity} unidades`,
          `Restará: ${maxAvailable - requestedQuantity} unidades`,
        ]}
      />
    );
  }

  if (requestedQuantity > maxAvailable) {
    return (
      <BatchAlert
        type="error"
        title="Quantidade Indisponível"
        message={`Você está tentando vender ${requestedQuantity} unidades, mas apenas ${maxAvailable} estão disponíveis.`}
        details={[
          `Máximo disponível: ${maxAvailable} unidades`,
          `Total do lote: ${yieldQuantity} unidades`,
          'Ajuste a quantidade para continuar',
        ]}
      />
    );
  }

  if (!isValid && missingIngredients.length > 0) {
    return (
      <BatchAlert
        type="error"
        title="Ingredientes Insuficientes"
        message="Não há ingredientes suficientes para produzir esta quantidade."
        details={[
          `Ingredientes em falta: ${missingIngredients.join(', ')}`,
          'Verifique o estoque de ingredientes',
          'Considere reabastecer antes de continuar',
        ]}
      />
    );
  }

  return (
    <BatchAlert
      type="warning"
      title="Validação Pendente"
      message="Verifique os dados antes de continuar."
    />
  );
}
