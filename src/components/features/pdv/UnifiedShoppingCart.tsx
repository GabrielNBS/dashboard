// src/components/features/pdv/UnifiedShoppingCart.tsx
'use client';

import React from 'react';
import {
  ShoppingCart as ShoppingCartIcon,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Layers,
} from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { ProductState } from '@/types/products';
import { formatCurrency } from '@/utils/UnifiedUtils';
import {
  calculateProportionalIngredientCost,
  calculateMaxSellableQuantity,
} from '@/utils/calculations/batchSale';
import { Ingredient } from '@/types/ingredients';
import BatchBadge from '@/components/ui/feedback/BatchBadge';
import BatchProgress from '@/components/ui/feedback/BatchProgress';

interface UnifiedCartItem {
  uid: string;
  quantity: number;
  maxAvailable?: number;
  isBatchProduct?: boolean;
  saleMode?: 'unit' | 'batch';
}

interface UnifiedShoppingCartProps {
  cart: UnifiedCartItem[];
  products: ProductState[];
  availableIngredients: Ingredient[];
  onRemoveFromCart: (uid: string) => void;
  onUpdateQuantity: (uid: string, quantity: number) => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
}

export default function UnifiedShoppingCart({
  cart,
  products,
  availableIngredients,
  onRemoveFromCart,
  onUpdateQuantity,
  canMakeProduct,
}: UnifiedShoppingCartProps) {
  return (
    <div className="bg-surface rounded-lg p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b-1">
        <ShoppingCartIcon className="text-primary h-5 w-5" />
        <h3 className="text-lg font-semibold">Carrinho</h3>
        <span className="text-primary bg-accent-light rounded-full px-2 py-1 text-xs font-medium">
          {cart.length} {cart.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="py-8 text-center">
          <ShoppingCartIcon className="text-muted mx-auto h-12 w-12" />
          <p className="text-muted-foreground mt-2 text-sm">Seu carrinho está vazio</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => {
            const product = products.find(product => product.uid === item.uid);
            if (!product) return null;

            const isBatchProduct = product.production.mode === 'lote';
            const maxAvailable = calculateMaxSellableQuantity(product, availableIngredients);
            const yieldQuantity = product.production.yieldQuantity;

            // Calcula preços baseado no modo de produção
            const unitPrice = isBatchProduct
              ? product.production.unitSellingPrice
              : product.production.sellingPrice;

            const proportionalCost = isBatchProduct
              ? calculateProportionalIngredientCost(product, item.quantity)
              : product.production.totalCost * item.quantity;

            const totalValue = unitPrice * item.quantity;
            const profit = totalValue - proportionalCost;
            const profitMargin = totalValue > 0 ? (profit / totalValue) * 100 : 0;

            // Determina se é venda de lote completo
            const isFullBatch = isBatchProduct && item.quantity === yieldQuantity;
            const batchPercentage = isBatchProduct ? (item.quantity / yieldQuantity) * 100 : 0;
            const isPartialBatch =
              isBatchProduct && item.quantity > 1 && item.quantity < yieldQuantity;

            return (
              <div key={item.uid} className="border-border rounded-lg border p-4">
                {/* Product Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{product.name}</h4>
                      {isBatchProduct && (
                        <div className="flex items-center gap-1">
                          <BatchBadge
                            yieldQuantity={yieldQuantity}
                            availableQuantity={maxAvailable}
                            variant="compact"
                          />
                          {isFullBatch && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              Lote Completo
                            </span>
                          )}
                          {isPartialBatch && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                              Venda Parcial
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <p className="text-muted-foreground">
                        {formatCurrency(unitPrice)} por unidade
                      </p>
                      {isBatchProduct && (
                        <span className="text-xs text-blue-600">
                          ({batchPercentage.toFixed(1)}% do lote)
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveFromCart(item.uid)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Batch Info */}
                {isBatchProduct && (
                  <div className="mb-3 space-y-2">
                    <BatchProgress
                      yieldQuantity={yieldQuantity}
                      availableQuantity={maxAvailable}
                      soldQuantity={item.quantity}
                      size="sm"
                      showLabels={true}
                    />

                    {isFullBatch && (
                      <div className="rounded border border-green-200 bg-green-50 p-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <Layers className="h-4 w-4" />
                          <span className="text-sm font-medium">Venda de Lote Completo</span>
                        </div>
                        <p className="mt-1 text-xs text-green-600">
                          Vendendo todo o lote de {yieldQuantity} unidades
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.uid, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.uid, item.quantity + 1)}
                      disabled={
                        !canMakeProduct(item.uid, item.quantity + 1) ||
                        item.quantity >= maxAvailable
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(totalValue)}</p>
                    <p className="text-muted-foreground text-xs">
                      Margem: {profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="space-y-2">
                  {maxAvailable === 0 && (
                    <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Sem estoque disponível</span>
                    </div>
                  )}

                  {maxAvailable > 0 &&
                    maxAvailable < (isBatchProduct ? yieldQuantity * 0.3 : 5) && (
                      <div className="flex items-center gap-2 rounded border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Estoque baixo: {maxAvailable} unidades restantes</span>
                      </div>
                    )}

                  {isBatchProduct && maxAvailable === yieldQuantity && (
                    <div className="flex items-center gap-2 rounded border border-green-200 bg-green-50 p-2 text-xs text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      <span>Lote completo disponível</span>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="bg-muted mt-3 rounded p-2 text-xs">
                  <div className="flex justify-between">
                    <span>Custo {isBatchProduct ? 'proporcional' : 'total'}:</span>
                    <span>{formatCurrency(proportionalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lucro estimado:</span>
                    <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(profit)}
                    </span>
                  </div>
                  {isBatchProduct && (
                    <div className="flex justify-between text-blue-600">
                      <span>Tipo de venda:</span>
                      <span>{isFullBatch ? 'Lote Completo' : 'Parcial'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
