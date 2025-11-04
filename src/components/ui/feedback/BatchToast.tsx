// src/components/ui/feedback/BatchToast.tsx
'use client';

import React from 'react';
import { Package, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { toast } from '@/components/ui/feedback/use-toast';

interface BatchToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  batchInfo?: {
    productName: string;
    soldQuantity: number;
    yieldQuantity: number;
    remainingQuantity: number;
  };
}

export function showBatchToast({
  title,
  description,
  type = 'info',
  batchInfo,
}: BatchToastOptions) {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  };

  const variants = {
    success: 'accept' as const,
    warning: 'default' as const,
    error: 'destructive' as const,
    info: 'default' as const,
  };

  const Icon = icons[type];

  let enhancedDescription = description;

  if (batchInfo) {
    const percentage = (batchInfo.soldQuantity / batchInfo.yieldQuantity) * 100;
    enhancedDescription = `${description || ''}\n📦 ${batchInfo.productName}\n🔢 Vendido: ${batchInfo.soldQuantity}/${batchInfo.yieldQuantity} unidades (${percentage.toFixed(1)}%)\n📋 Restante: ${batchInfo.remainingQuantity} unidades`;
  }

  toast({
    title: (
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        <span>{title}</span>
      </div>
    ),
    description: enhancedDescription,
    variant: variants[type],
  });
}

// Toasts específicos para operações de lote
export const BatchToasts = {
  saleSuccess: (productName: string, soldQuantity: number, yieldQuantity: number) => {
    showBatchToast({
      title: 'Venda de Lote Realizada! 🎉',
      type: 'success',
      batchInfo: {
        productName,
        soldQuantity,
        yieldQuantity,
        remainingQuantity: yieldQuantity - soldQuantity,
      },
    });
  },

  insufficientStock: (productName: string, requested: number, available: number) => {
    showBatchToast({
      title: 'Quantidade Indisponível',
      description: `Você tentou vender ${requested} unidades, mas apenas ${available} estão disponíveis.`,
      type: 'error',
    });
  },

  missingIngredients: (productName: string, missingIngredients: string[]) => {
    showBatchToast({
      title: 'Ingredientes Insuficientes',
      description: `Não é possível produzir "${productName}". Ingredientes em falta: ${missingIngredients.join(', ')}`,
      type: 'error',
    });
  },

  lowStock: (productName: string, available: number, yieldQuantity: number) => {
    const percentage = (available / yieldQuantity) * 100;
    showBatchToast({
      title: 'Estoque Baixo',
      description: `O produto "${productName}" está com estoque baixo (${percentage.toFixed(1)}% disponível).`,
      type: 'warning',
    });
  },

  batchComplete: (productName: string, yieldQuantity: number) => {
    showBatchToast({
      title: 'Lote Completo Disponível',
      description: `O produto "${productName}" está com lote completo (${yieldQuantity} unidades).`,
      type: 'success',
    });
  },

  partialSaleInfo: (productName: string, soldQuantity: number, yieldQuantity: number) => {
    const percentage = (soldQuantity / yieldQuantity) * 100;
    showBatchToast({
      title: 'Venda Parcial de Lote',
      description: `Vendendo ${percentage.toFixed(1)}% do lote de "${productName}".`,
      type: 'info',
      batchInfo: {
        productName,
        soldQuantity,
        yieldQuantity,
        remainingQuantity: yieldQuantity - soldQuantity,
      },
    });
  },
};
