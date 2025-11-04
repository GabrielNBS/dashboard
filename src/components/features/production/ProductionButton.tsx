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

  const handleProduce = async () => {
    setIsProducing(true);
    try {
      await produceProduct(product.uid, 1);
    } finally {
      setIsProducing(false);
    }
  };

  const totalCost = product.production.totalCost;
  const totalRevenue = product.production.unitSellingPrice * yieldQuantity;
  const profit = totalRevenue - totalCost;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status da Produção */}
      <div className="bg-muted rounded-lg p-3">
        <div className="mb-2 flex items-center gap-2">
          <Package className="text-primary h-4 w-4" />
          <span className="text-sm font-medium">Status da Produção</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Produzido</p>
            <p className="font-medium">{currentProduced} unidades</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pode Produzir</p>
            <p className="font-medium">{maxUnitsCanProduce} unidades</p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${currentProduced > 0 ? Math.min((currentProduced / (currentProduced + maxUnitsCanProduce)) * 100, 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Informações Financeiras */}
      <div className="bg-accent-light rounded-lg p-3">
        <div className="mb-2 flex items-center gap-2">
          <Factory className="text-primary h-4 w-4" />
          <span className="text-sm font-medium">Próxima Produção</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Custo</p>
            <p className="font-medium text-red-600">{formatCurrency(totalCost)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Receita</p>
            <p className="font-medium text-blue-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lucro</p>
            <p className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </p>
          </div>
        </div>
      </div>

      {/* Botão de Produção */}
      <Button
        onClick={handleProduce}
        disabled={!canProduce || isProducing}
        className="w-full"
        variant={canProduce ? 'default' : 'outline'}
      >
        {isProducing ? (
          <>
            <Factory className="mr-2 h-4 w-4 animate-spin" />
            Produzindo...
          </>
        ) : canProduce ? (
          <>
            <Factory className="mr-2 h-4 w-4" />
            Produzir 1 Lote ({yieldQuantity} un.)
          </>
        ) : maxBatches === 0 ? (
          <>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Ingredientes Insuficientes
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Produção Disponível
          </>
        )}
      </Button>

      {/* Alertas */}
      {!canProduce && maxBatches === 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-2">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Sem ingredientes para produzir</span>
          </div>
        </div>
      )}

      {currentProduced === 0 && canProduce && (
        <div className="rounded border border-orange-200 bg-orange-50 p-2">
          <div className="flex items-center gap-2 text-orange-700">
            <Package className="h-4 w-4" />
            <span className="text-xs font-medium">Nenhuma unidade produzida ainda</span>
          </div>
        </div>
      )}
    </div>
  );
}
