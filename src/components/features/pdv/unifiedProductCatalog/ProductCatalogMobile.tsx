'use client';
import React from 'react';
import Image from 'next/image';
import { Plus, Layers, XCircle } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import EmptyList from '@/components/ui/feedback/EmptyList';
import { formatCurrency } from '@/utils/UnifiedUtils';
import { useProductCatalog } from './useProductCatalog';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';

interface UnifiedCartItem {
  uid: string;
  quantity: number;
  saleMode?: 'unit' | 'batch';
}

interface Props {
  products: ProductState[];
  cart: UnifiedCartItem[];
  availableIngredients: Ingredient[];
  onAddToCart: (uid: string, quantity?: number, saleMode?: 'unit' | 'batch') => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
}

export default function ProductCatalogMobile({
  products,
  cart,
  availableIngredients,
  onAddToCart,
  canMakeProduct,
}: Props) {
  const { sortedProducts, handleProductClick, getProductData } = useProductCatalog({
    products,
    cart,
    availableIngredients,
    canMakeProduct,
    onAddToCart,
  });

  if (sortedProducts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <EmptyList
          title="Nenhum produto cadastrado"
          message="crie seu primeiro produto"
          icon={<Plus className="text-muted-foreground mb-4 h-12 w-12" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sortedProducts.map(product => {
        const data = getProductData(product);
        const {
          inCart,
          isBatchProduct,
          maxAvailable,
          canMake,
          validation,
          yieldQuantity,
          unitPrice,
          batchPrice,
        } = data;

        return (
          <div
            key={product.uid}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
              inCart ? 'border-primary bg-primary/5' : 'border-border bg-card'
            } ${!canMake ? 'opacity-50' : ''}`}
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-slate-100 to-slate-200">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Layers className="h-6 w-6 text-slate-300" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-1">
                <h3 className="text-primary truncate text-sm font-medium">{product.name}</h3>
                {isBatchProduct && (
                  <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium">
                    Lote
                  </span>
                )}
              </div>

              <div className="flex justify-between text-xs">
                <p className="text-muted-foreground truncate">{product.category}</p>
                <div className="text-right">
                  <p className={`font-bold ${inCart ? 'text-primary' : 'text-foreground'}`}>
                    {formatCurrency(unitPrice)}
                  </p>
                  {isBatchProduct && (
                    <p className="text-muted-foreground">Lote: {formatCurrency(batchPrice)}</p>
                  )}
                </div>
              </div>

              {!validation.isValid && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <XCircle className="h-3 w-3" /> Ingredientes em falta
                </p>
              )}
            </div>

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
        );
      })}
    </div>
  );
}
