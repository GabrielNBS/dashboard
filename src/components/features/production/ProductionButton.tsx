// src/components/features/production/ProductionButton.tsx
'use client';

import React, { useState } from 'react';
import { Factory, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { ProductState } from '@/types/products';
import { useProductionProcess } from '@/hooks/business/useProductionProcess';
import { formatCurrency } from '@/utils/UnifiedUtils';

interface ProductionButtonProps {
  product: ProductState;
  className?: string;
}

export default function ProductionButton({ product, className = '' }: ProductionButtonProps) {
  const { produceProduct, getProductionInfo } = useProductionProcess();
  const [isProducing, setIsProducing] = useState(false);

  if (product.production.mode !== 'lote') {
    return null; // Só mostra para produtos em lote
  }

  const productionInfo = getProductionInfo(product.uid);
  if (!productionInfo) return null;

  const { maxBatches, currentProduced, yieldQuantity, canProduce, maxUnitsCanProduce } =
    productionInfo;

  const handleProduce = () => {
    setIsProducing(true);
    try {
      produceProduct(product.uid, 1);
    } finally {
      setIsProducing(false);
    }
  };

  const totalCost = product.production.totalCost;
  const totalRevenue = product.production.unitSellingPrice * yieldQuantity;
  const profit = totalRevenue - totalCost;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header compacto */}
      <div className="flex items-center gap-2">
        <Factory className="h-4 w-4 text-indigo-600" />
        <span className="text-sm font-medium text-slate-900">Produção</span>
      </div>

      {/* Status compacto em linha */}
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-slate-500">Produzido</p>
            <p className="text-sm font-bold text-slate-900">{currentProduced}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Disponível</p>
            <p className="text-sm font-bold text-indigo-600">{maxUnitsCanProduce}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Lucro/Lote</p>
            <p className={`text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </p>
          </div>
        </div>

        {/* Barra de progresso compacta */}
        <div className="mt-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${currentProduced > 0 ? Math.min((currentProduced / (currentProduced + maxUnitsCanProduce)) * 100, 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Alertas compactos */}
      {!canProduce && maxBatches === 0 && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-2 text-red-700">
          <AlertTriangle className="h-3 w-3" />
          <span className="text-xs">Ingredientes insuficientes</span>
        </div>
      )}

      {currentProduced === 0 && canProduce && (
        <div className="flex items-center gap-2 rounded border border-orange-200 bg-orange-50 p-2 text-orange-700">
          <Package className="h-3 w-3" />
          <span className="text-xs">Pronto para produzir</span>
        </div>
      )}

      {/* Botão de produção com tamanho normal */}
      <Button
        onClick={handleProduce}
        disabled={!canProduce || isProducing}
        className="w-full"
        size="sm"
        variant={canProduce ? 'default' : 'outline'}
      >
        {isProducing ? (
          <>
            <Factory className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Produzindo...
          </>
        ) : canProduce ? (
          <>
            <Factory className="mr-1.5 h-3.5 w-3.5" />
            Produzir Lote ({yieldQuantity} un.)
          </>
        ) : maxBatches === 0 ? (
          <>
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            Sem Ingredientes
          </>
        ) : (
          <>
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Disponível
          </>
        )}
      </Button>
    </div>
  );
}
