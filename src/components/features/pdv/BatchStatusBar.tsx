// src/components/features/pdv/BatchStatusBar.tsx
'use client';

import React from 'react';
import { Package, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';
import { calculateMaxSellableQuantity } from '@/utils/calculations/batchSale';

interface BatchStatusBarProps {
  products: ProductState[];
  availableIngredients: Ingredient[];
  cartItemsCount: number;
}

export default function BatchStatusBar({
  products,
  availableIngredients,
  cartItemsCount,
}: BatchStatusBarProps) {
  const batchProducts = products.filter(p => p.production.mode === 'lote');
  const regularProducts = products.filter(p => p.production.mode !== 'lote');

  // Calcula estatísticas dos lotes
  const batchStats = batchProducts.reduce(
    (stats, product) => {
      const maxAvailable = calculateMaxSellableQuantity(product, availableIngredients);
      const yieldQuantity = product.production.yieldQuantity;
      const percentage = yieldQuantity > 0 ? (maxAvailable / yieldQuantity) * 100 : 0;

      if (maxAvailable === 0) {
        stats.unavailable++;
      } else if (percentage < 25) {
        stats.critical++;
      } else if (percentage < 50) {
        stats.warning++;
      } else if (percentage < 100) {
        stats.partial++;
      } else {
        stats.full++;
      }

      stats.totalAvailable += maxAvailable;
      stats.totalYield += yieldQuantity;

      return stats;
    },
    {
      full: 0,
      partial: 0,
      warning: 0,
      critical: 0,
      unavailable: 0,
      totalAvailable: 0,
      totalYield: 0,
    }
  );

  const totalBatchPercentage =
    batchStats.totalYield > 0 ? (batchStats.totalAvailable / batchStats.totalYield) * 100 : 0;

  return (
    <div className="bg-surface border-muted rounded-lg border-2 p-4 shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <Package className="text-primary h-5 w-5" />
        <h3 className="font-semibold">Status dos Produtos</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Produtos Regulares */}
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">{regularProducts.length}</div>
          <div className="text-xs text-gray-600">Produtos Regulares</div>
        </div>

        {/* Produtos em Lote */}
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">{batchProducts.length}</div>
          <div className="text-xs text-gray-600">Produtos em Lote</div>
        </div>

        {/* Disponibilidade Geral */}
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${
              totalBatchPercentage >= 75
                ? 'text-green-600'
                : totalBatchPercentage >= 50
                  ? 'text-yellow-600'
                  : totalBatchPercentage >= 25
                    ? 'text-orange-600'
                    : 'text-red-600'
            }`}
          >
            {totalBatchPercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Disponibilidade</div>
        </div>

        {/* Itens no Carrinho */}
        <div className="text-center">
          <div className="text-primary text-2xl font-bold">{cartItemsCount}</div>
          <div className="text-xs text-gray-600">No Carrinho</div>
        </div>
      </div>

      {/* Status Detalhado dos Lotes */}
      {batchProducts.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <div className="mb-2 text-sm font-medium text-gray-700">Status dos Lotes:</div>
          <div className="flex flex-wrap gap-2">
            {batchStats.full > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                <CheckCircle className="h-3 w-3" />
                <span>{batchStats.full} Completos</span>
              </div>
            )}

            {batchStats.partial > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                <TrendingUp className="h-3 w-3" />
                <span>{batchStats.partial} Parciais</span>
              </div>
            )}

            {batchStats.warning > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                <TrendingDown className="h-3 w-3" />
                <span>{batchStats.warning} Baixos</span>
              </div>
            )}

            {batchStats.critical > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                <AlertTriangle className="h-3 w-3" />
                <span>{batchStats.critical} Críticos</span>
              </div>
            )}

            {batchStats.unavailable > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                <AlertTriangle className="h-3 w-3" />
                <span>{batchStats.unavailable} Indisponíveis</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra de Progresso Geral */}
      {batchProducts.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-gray-600">
            <span>Capacidade Total dos Lotes</span>
            <span>
              {batchStats.totalAvailable}/{batchStats.totalYield} unidades
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${
                totalBatchPercentage >= 75
                  ? 'bg-green-500'
                  : totalBatchPercentage >= 50
                    ? 'bg-yellow-500'
                    : totalBatchPercentage >= 25
                      ? 'bg-orange-500'
                      : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(totalBatchPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
