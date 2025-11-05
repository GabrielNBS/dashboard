// src/components/features/pdv/BatchQuantitySelector.tsx
'use client';

import React, { useState } from 'react';
import { Package, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { ProductState } from '@/types/products';
import { formatCurrency } from '@/utils/UnifiedUtils';
import {
  calculateProportionalIngredientCost,
  calculateProportionalProfitMargin,
} from '@/utils/calculations/batchSale';
import BatchBadge from '@/components/ui/feedback/BatchBadge';
import BatchProgress from '@/components/ui/feedback/BatchProgress';
import { BatchValidationAlert } from '@/components/ui/feedback/BatchAlert';

interface BatchQuantitySelectorProps {
  product: ProductState;
  maxAvailable: number;
  currentQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (quantity: number) => void;
  onCancel: () => void;
  missingIngredients?: string[];
}

export default function BatchQuantitySelector({
  product,
  maxAvailable,
  currentQuantity,
  onQuantityChange,
  onAddToCart,
  onCancel,
  missingIngredients = [],
}: BatchQuantitySelectorProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(currentQuantity || 1);

  const isBatchProduct = product.production.mode === 'lote';
  const yieldQuantity = product.production.yieldQuantity;
  const unitPrice = product.production.unitSellingPrice;

  // Cálculos para produtos em lote
  const proportionalCost = isBatchProduct
    ? calculateProportionalIngredientCost(product, selectedQuantity)
    : product.production.totalCost * selectedQuantity;

  // Sempre calcular margem real baseada no preço atual
  const proportionalMargin = calculateProportionalProfitMargin(
    product,
    selectedQuantity,
    unitPrice
  );

  const totalValue = unitPrice * selectedQuantity;
  const remainingInBatch = isBatchProduct ? yieldQuantity - selectedQuantity : 0;
  const isValidQuantity = selectedQuantity <= maxAvailable && selectedQuantity > 0;
  const canProceed = isValidQuantity && missingIngredients.length === 0;

  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, maxAvailable));
    setSelectedQuantity(clampedQuantity);
    onQuantityChange(clampedQuantity);
  };

  const handleConfirm = () => {
    onQuantityChange(selectedQuantity);
    onAddToCart(selectedQuantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface mx-4 w-full max-w-md rounded-lg p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <Package className="text-primary h-6 w-6" />
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-muted-foreground text-sm">
              {isBatchProduct ? 'Produto em Lote' : 'Produto Individual'}
            </p>
          </div>
        </div>

        {/* Batch Info */}
        {isBatchProduct && (
          <div className="mb-4 space-y-3">
            <BatchBadge
              yieldQuantity={yieldQuantity}
              availableQuantity={maxAvailable}
              variant="detailed"
            />

            <BatchProgress
              yieldQuantity={yieldQuantity}
              availableQuantity={maxAvailable}
              soldQuantity={selectedQuantity}
              size="md"
            />
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Quantidade a vender</label>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(selectedQuantity - 1)}
              disabled={selectedQuantity <= 1}
            >
              -
            </Button>

            <input
              type="number"
              min="1"
              max={maxAvailable}
              value={selectedQuantity}
              onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="border-border bg-background w-20 rounded border px-3 py-2 text-center"
              aria-label="Quantidade a vender"
              title="Quantidade a vender"
            />

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(selectedQuantity + 1)}
              disabled={selectedQuantity >= maxAvailable}
            >
              +
            </Button>
          </div>

          {/* Validation feedback */}
          <div className="mt-3">
            <BatchValidationAlert
              isValid={missingIngredients.length === 0}
              missingIngredients={missingIngredients}
              maxAvailable={maxAvailable}
              requestedQuantity={selectedQuantity}
              yieldQuantity={yieldQuantity}
            />
          </div>
        </div>

        {/* Quick Selection Buttons */}
        {isBatchProduct && maxAvailable > 1 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">Seleção rápida:</p>
            <div className="flex flex-wrap gap-2">
              {[
                Math.ceil(maxAvailable * 0.25),
                Math.ceil(maxAvailable * 0.5),
                Math.ceil(maxAvailable * 0.75),
                maxAvailable,
              ]
                .filter((qty, index, arr) => arr.indexOf(qty) === index && qty <= maxAvailable)
                .map(qty => (
                  <Button
                    key={qty}
                    size="sm"
                    variant={selectedQuantity === qty ? 'default' : 'outline'}
                    onClick={() => handleQuantityChange(qty)}
                  >
                    {qty === maxAvailable ? 'Tudo' : `${qty}`}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Calculation Summary */}
        <div className="bg-muted mb-4 rounded-lg p-3">
          <h4 className="mb-2 text-sm font-medium">Resumo da Venda</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Quantidade:</span>
              <span className="font-medium">{selectedQuantity} unidades</span>
            </div>
            <div className="flex justify-between">
              <span>Valor total:</span>
              <span className="font-medium">{formatCurrency(totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Custo proporcional:</span>
              <span className="font-medium">{formatCurrency(proportionalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Margem de lucro:</span>
              <span className="font-medium">{proportionalMargin.toFixed(1)}%</span>
            </div>
            {isBatchProduct && remainingInBatch > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Restará no lote:</span>
                <span className="font-medium">{remainingInBatch} unidades</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleConfirm}
            disabled={!canProceed}
          >
            {canProceed ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Não Disponível
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
