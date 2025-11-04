// src/components/features/sales/BatchSaleDetails.tsx
'use client';

import React from 'react';
import { Package, Info, TrendingUp, DollarSign } from 'lucide-react';
import { BatchSale, BatchSaleItem } from '@/types/sale';
import { formatCurrency } from '@/utils/UnifiedUtils';
import {
  calculateProportionalIngredientCost,
  calculateProportionalProfitMargin,
} from '@/utils/calculations/batchSale';

interface BatchSaleDetailsProps {
  sale: BatchSale;
  isExpanded?: boolean;
}

export default function BatchSaleDetails({ sale, isExpanded = false }: BatchSaleDetailsProps) {
  const batchItems = sale.items.filter(item => item.isBatchSale);
  const regularItems = sale.items.filter(item => !item.isBatchSale);

  const totalBatchRevenue = batchItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalRegularRevenue = regularItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (!isExpanded) {
    return (
      <div className="bg-surface rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Venda #{sale.id.slice(-8)}</p>
              <p className="text-muted-foreground text-sm">
                {new Date(sale.date).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(sale.sellingResume.totalValue)}</p>
            <p className="text-muted-foreground text-sm">
              {batchItems.length > 0 &&
                `${batchItems.length} lote${batchItems.length > 1 ? 's' : ''}`}
              {batchItems.length > 0 && regularItems.length > 0 && ' + '}
              {regularItems.length > 0 &&
                `${regularItems.length} regular${regularItems.length > 1 ? 'es' : ''}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Venda #{sale.id.slice(-8)}</h3>
            <p className="text-muted-foreground">{new Date(sale.date).toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatCurrency(sale.sellingResume.totalValue)}</p>
          <p className="text-muted-foreground text-sm">
            Método: {sale.sellingResume.paymentMethod}
          </p>
        </div>
      </div>

      {/* Batch Items */}
      {batchItems.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Package className="text-primary h-5 w-5" />
            <h4 className="font-medium">Vendas de Lotes Parciais</h4>
          </div>
          <div className="space-y-3">
            {batchItems.map((item, index) => {
              const proportionalCost =
                item.proportionalCost ||
                calculateProportionalIngredientCost(item.product, item.quantity);
              const profit = item.subtotal - proportionalCost;
              const profitMargin = item.subtotal > 0 ? (profit / item.subtotal) * 100 : 0;

              return (
                <div key={index} className="bg-accent-light rounded-lg p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{item.product.name}</h5>
                      <p className="text-muted-foreground text-sm">
                        Lote de {item.batchYieldQuantity} unidades
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.quantity} × {formatCurrency(item.subtotal / item.quantity)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Vendido</p>
                      <p className="font-medium">{item.batchSoldQuantity} unidades</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Restante</p>
                      <p className="font-medium">{item.batchRemainingQuantity} unidades</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Custo Proporcional</p>
                      <p className="font-medium">{formatCurrency(proportionalCost)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Margem</p>
                      <p
                        className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Ingredients breakdown */}
                  <div className="mt-3 border-t pt-3">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Ingredientes Consumidos (Proporcional)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.product.ingredients.map((ingredient, idx) => {
                        const proportion = item.batchSoldQuantity! / item.batchYieldQuantity!;
                        const consumedQuantity = ingredient.totalQuantity * proportion;
                        return (
                          <span key={idx} className="bg-muted rounded px-2 py-1 text-xs">
                            {ingredient.name}: {consumedQuantity.toFixed(2)} {ingredient.unit}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Items */}
      {regularItems.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <DollarSign className="text-primary h-5 w-5" />
            <h4 className="font-medium">Produtos Regulares</h4>
          </div>
          <div className="space-y-2">
            {regularItems.map((item, index) => (
              <div
                key={index}
                className="bg-muted flex items-center justify-between rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.quantity} × {formatCurrency(item.subtotal / item.quantity)}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="mb-3 font-medium">Resumo Financeiro</h4>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-semibold">{formatCurrency(sale.sellingResume.subtotal)}</p>
          </div>
          {sale.sellingResume.discount && sale.sellingResume.discount.value > 0 && (
            <div>
              <p className="text-muted-foreground">Desconto</p>
              <p className="font-semibold text-green-600">
                -
                {formatCurrency(
                  sale.sellingResume.discount.type === 'percentage'
                    ? (sale.sellingResume.subtotal * sale.sellingResume.discount.value) / 100
                    : sale.sellingResume.discount.value
                )}
              </p>
            </div>
          )}
          {sale.sellingResume.fees && sale.sellingResume.fees > 0 && (
            <div>
              <p className="text-muted-foreground">Taxas</p>
              <p className="font-semibold text-orange-600">
                -{formatCurrency(sale.sellingResume.fees)}
              </p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Total Final</p>
            <p className="text-lg font-bold">{formatCurrency(sale.sellingResume.totalValue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
