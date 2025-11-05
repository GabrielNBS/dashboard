// src/components/features/pdv/UnifiedProductCatalog.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { PackagePlus, Plus, AlertTriangle, CheckCircle, XCircle, Layers } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';
import { formatCurrency } from '@/utils/UnifiedUtils';
import { calculateMaxSellableQuantity, validateBatchSale } from '@/utils/calculations/batchSale';

import BatchBadge from '@/components/ui/feedback/BatchBadge';
import BatchProgress from '@/components/ui/feedback/BatchProgress';
import EmptyList from '@/components/ui/feedback/EmptyList';

interface UnifiedCartItem {
  uid: string;
  quantity: number;
  maxAvailable?: number;
  isBatchProduct?: boolean;
  saleMode?: 'unit' | 'batch';
}

interface UnifiedProductCatalogProps {
  products: ProductState[];
  cart: UnifiedCartItem[];
  availableIngredients: Ingredient[];
  onAddToCart: (uid: string, quantity?: number, saleMode?: 'unit' | 'batch') => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
  getBatchInfo: (productUid: string) => {
    product: ProductState;
    maxAvailable: number;
    isBatchProduct: boolean;
    yieldQuantity: number;
  } | null;
}

export default function UnifiedProductCatalog({
  products,
  cart,
  availableIngredients,
  onAddToCart,
  canMakeProduct,
}: UnifiedProductCatalogProps) {
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

  const handleProductClick = (product: ProductState, saleMode: 'unit' | 'batch' = 'unit') => {
    const isBatchProduct = product.production.mode === 'lote';
    const validation = validateBatchSale(product, 1, availableIngredients);

    if (!validation.isValid) {
      return;
    }

    if (isBatchProduct && saleMode === 'batch') {
      // Vende o lote completo
      onAddToCart(product.uid, product.production.yieldQuantity, 'batch');
    } else {
      // Venda unitária (tanto para produtos individuais quanto lotes)
      onAddToCart(product.uid, 1, 'unit');
    }
  };

  return (
    <div className="w-full">
      <div className="bg-muted rounded-lg p-3 shadow-sm sm:p-6">
        {sortedProducts.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <EmptyList
              title="Nenhum produto cadastrado"
              message="crie seu primeiro produto"
              icon={<PackagePlus className="text-muted-foreground mb-4 h-12 w-12" />}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {sortedProducts.map(product => {
              const inCart = cart.find(item => item.uid === product.uid);
              const isBatchProduct = product.production.mode === 'lote';
              const maxAvailable = calculateMaxSellableQuantity(product, availableIngredients);
              const canMake = canMakeProduct(product.uid, (inCart?.quantity ?? 0) + 1);
              const validation = validateBatchSale(product, 1, availableIngredients);
              const yieldQuantity = product.production.yieldQuantity;

              // Calcula preços baseado no modo de produção
              const unitPrice = isBatchProduct
                ? product.production.unitSellingPrice
                : product.production.sellingPrice;
              const batchPrice = isBatchProduct
                ? product.production.unitSellingPrice * yieldQuantity
                : product.production.sellingPrice;

              return (
                <div
                  key={product.uid}
                  className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                    inCart
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-muted-foreground'
                  } ${!canMake ? 'opacity-50' : ''}`}
                >
                  {/* Cart Quantity Badge - Posicionado no topo */}
                  {inCart && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-primary text-secondary flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold sm:h-6 sm:w-6">
                        {inCart.quantity}
                      </span>
                    </div>
                  )}

                  {/* Mobile Layout */}
                  <div className="flex items-center gap-3 p-3 sm:hidden">
                    {/* Imagem do Produto */}
                    <div className="flex-shrink-0">
                      <Image
                        className="h-12 w-12 rounded-md object-cover"
                        src="https://placehold.co/150"
                        alt={product.name}
                        width={150}
                        height={150}
                      />
                    </div>

                    {/* Informações do Produto */}
                    <div className="min-w-0 flex-1">
                      {/* Header: Nome + Badge de Lote */}
                      <div className="mb-1 flex items-center gap-1">
                        <h3 className="text-primary truncate text-sm font-medium">
                          {product.name}
                        </h3>
                        {isBatchProduct && (
                          <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium">
                            Lote
                          </span>
                        )}
                      </div>

                      {/* Categoria + Preço */}
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-muted-foreground truncate text-xs">{product.category}</p>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${inCart ? 'text-primary' : 'text-foreground'}`}
                          >
                            {formatCurrency(unitPrice)}
                          </p>
                          {isBatchProduct && (
                            <p className="text-muted-foreground text-xs">
                              Lote: {formatCurrency(batchPrice)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar para Lotes */}
                      {isBatchProduct && (
                        <div className="mb-2">
                          <BatchProgress
                            yieldQuantity={yieldQuantity}
                            availableQuantity={maxAvailable}
                            soldQuantity={inCart?.quantity || 0}
                            showLabels={false}
                            showPercentage={false}
                            size="sm"
                          />
                        </div>
                      )}

                      {/* Status Messages */}
                      {!validation.isValid && validation.missingIngredients.length > 0 && (
                        <div className="mb-1 flex items-center gap-1 text-red-600">
                          <XCircle className="h-3 w-3" />
                          <p className="truncate text-xs">Ingredientes em falta</p>
                        </div>
                      )}

                      {validation.isValid && !canMake && (
                        <div className="mb-1 flex items-center gap-1 text-red-600">
                          <XCircle className="h-3 w-3" />
                          <p className="text-xs">Estoque insuficiente</p>
                        </div>
                      )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleProductClick(product, 'unit')}
                        disabled={!canMake || !validation.isValid}
                        variant={inCart ? 'default' : 'outline'}
                        className="h-7 w-12 p-0 text-xs"
                      >
                        {isBatchProduct ? 'Un.' : <Plus className="h-3 w-3" />}
                      </Button>
                      {isBatchProduct && (
                        <Button
                          size="sm"
                          onClick={() => handleProductClick(product, 'batch')}
                          disabled={!canMake || !validation.isValid || maxAvailable < yieldQuantity}
                          variant="outline"
                          className="h-7 w-12 p-0 text-xs"
                        >
                          <Layers className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden p-4 sm:block">
                    {/* Header: Nome + Badge de Lote */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-primary truncate font-semibold">{product.name}</h3>
                        {isBatchProduct && (
                          <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                            Lote
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{product.category}</p>
                    </div>

                    {/* Imagem do Produto */}
                    <div className="mb-3 flex justify-center">
                      <Image
                        className="h-32 w-32 rounded-xl object-cover lg:h-40 lg:w-40"
                        src={'https://placehold.co/250'}
                        alt={product.name}
                        width={160}
                        height={160}
                      />
                    </div>

                    {/* Informações de Lote */}
                    {isBatchProduct && (
                      <div className="mb-3">
                        <BatchBadge
                          yieldQuantity={yieldQuantity}
                          availableQuantity={maxAvailable}
                          variant="default"
                        />
                        <div className="mt-2">
                          <BatchProgress
                            yieldQuantity={yieldQuantity}
                            availableQuantity={maxAvailable}
                            soldQuantity={inCart?.quantity || 0}
                            size="sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Preços */}
                    <div className="mb-3 text-center">
                      <p
                        className={`text-lg font-bold ${inCart ? 'text-primary' : 'text-foreground'}`}
                      >
                        {formatCurrency(unitPrice)}
                      </p>
                      <p className="text-muted-foreground text-sm">por unidade</p>
                      {isBatchProduct && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          Lote completo: {formatCurrency(batchPrice)}
                        </p>
                      )}
                    </div>

                    {/* Status Messages */}
                    <div className="mb-3 min-h-[20px]">
                      {!validation.isValid && validation.missingIngredients.length > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-3 w-3" />
                          <p className="text-xs">
                            Ingredientes em falta: {validation.missingIngredients.join(', ')}
                          </p>
                        </div>
                      )}

                      {validation.isValid && !canMake && (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-3 w-3" />
                          <p className="text-xs">Estoque insuficiente</p>
                        </div>
                      )}

                      {validation.isValid &&
                        canMake &&
                        maxAvailable < yieldQuantity &&
                        isBatchProduct && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <AlertTriangle className="h-3 w-3" />
                            <p className="text-xs">
                              Estoque limitado: {maxAvailable}/{yieldQuantity}
                            </p>
                          </div>
                        )}

                      {validation.isValid &&
                        canMake &&
                        maxAvailable >= yieldQuantity &&
                        isBatchProduct && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <p className="text-xs">Lote completo disponível</p>
                          </div>
                        )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => handleProductClick(product, 'unit')}
                        disabled={!canMake || !validation.isValid}
                        variant={inCart ? 'default' : 'outline'}
                      >
                        {!validation.isValid ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Indisponível
                          </>
                        ) : canMake ? (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            {inCart ? 'Adicionar +1' : 'Adicionar'}
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Sem Estoque
                          </>
                        )}
                      </Button>

                      {isBatchProduct && (
                        <Button
                          className="w-full"
                          onClick={() => handleProductClick(product, 'batch')}
                          disabled={!canMake || !validation.isValid || maxAvailable < yieldQuantity}
                          variant="outline"
                        >
                          {maxAvailable >= yieldQuantity ? (
                            <>
                              <Layers className="mr-2 h-4 w-4" />
                              Vender Lote Completo
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Lote Incompleto
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
