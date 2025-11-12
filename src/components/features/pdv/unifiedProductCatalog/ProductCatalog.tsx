'use client';
import React from 'react';
import Image from 'next/image';
import { Plus, Layers } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import BatchBadge from '@/components/ui/feedback/BatchBadge';
import BatchProgress from '@/components/ui/feedback/BatchProgress';
import { formatCurrency } from '@/utils/UnifiedUtils';
import { useProductCatalog } from './useProductCatalog';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';

interface UnifiedCartItem {
  uid: string;
  quantity: number;
}

interface Props {
  products: ProductState[];
  cart: UnifiedCartItem[];
  availableIngredients: Ingredient[];
  onAddToCart: (uid: string, quantity?: number, saleMode?: 'unit' | 'batch') => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
}

export default function ProductCatalog({
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

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
            className={`group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md ${
              inCart ? 'border-primary bg-primary/5' : 'border-border bg-card'
            } ${!canMake ? 'opacity-60' : ''}`}
          >
            {/* Image Section */}
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
              {product.image ? (
                <>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Layers className="h-12 w-12 text-slate-300" />
                </div>
              )}

              {/* Badge on Image */}
              {isBatchProduct && (
                <div className="absolute top-2 right-2">
                  <BatchBadge
                    yieldQuantity={yieldQuantity}
                    availableQuantity={maxAvailable}
                    variant="default"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-primary mb-3 truncate font-semibold">{product.name}</h2>

              <div className="mb-3 text-center">
                <p className={`text-lg font-bold ${inCart ? 'text-primary' : 'text-foreground'}`}>
                  {formatCurrency(unitPrice)}
                </p>
                {isBatchProduct && (
                  <p className="text-muted-foreground text-sm">
                    Lote: {formatCurrency(batchPrice)}
                  </p>
                )}
              </div>

              <BatchProgress
                yieldQuantity={yieldQuantity}
                availableQuantity={maxAvailable}
                soldQuantity={inCart?.quantity || 0}
                size="sm"
              />

              <div className="mt-3 space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleProductClick(product, 'unit')}
                  disabled={!canMake || !validation.isValid}
                  variant={inCart ? 'default' : 'outline'}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>

                {isBatchProduct && (
                  <Button
                    className="w-full"
                    onClick={() => handleProductClick(product, 'batch')}
                    disabled={!canMake || !validation.isValid || maxAvailable < yieldQuantity}
                    variant="outline"
                  >
                    <Layers className="mr-2 h-4 w-4" /> Vender Lote
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
