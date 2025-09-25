'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { CartItem } from '@/types/sale';
import { ProductState } from '@/types/products';
import { useHydrated } from '@/hooks/ui/useHydrated';
import { formatCurrency } from '@/utils/UnifiedUtils';

interface ProductCatalogProps {
  products: ProductState[];
  cart: CartItem[];
  onAddToCart: (uid: string) => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
}

export default function ProductCatalog({
  products,
  cart,
  onAddToCart,
  canMakeProduct,
}: ProductCatalogProps) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <p>carregando ...</p>;
  }
  return (
    <div className="lg:col-span-2">
      <div className="bg-surface rounded-lg p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => {
            const inCart = cart.find(item => item.uid === product.uid);
            const canMake = canMakeProduct(product.uid, inCart?.quantity ?? 0 + 1);
            const sellingPrice = product.production.sellingPrice;

            return (
              <div
                key={product.uid}
                className={`group relative overflow-hidden rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                  inCart ? 'border-accent-light bg-accent-light' : 'border-gray-200 bg-white'
                } ${!canMake ? 'opacity-50' : ''}`}
              >
                <div className="mb-3">
                  <h3 className="text-primary font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.category}</p>
                </div>

                <div className="flex">
                  <img className="rounded-xl" src={'https://placehold.co/250'} alt={product.name} />
                </div>

                <div className="mb-3">
                  <p
                    className={`text-lg font-bold ${inCart ? 'text-primary font-black' : 'text-on-great'}`}
                  >
                    {formatCurrency(sellingPrice)}
                  </p>
                </div>

                {inCart && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-accent text-surface flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                      {inCart.quantity}
                    </span>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => onAddToCart(product.uid)}
                  disabled={!canMake}
                  variant={inCart ? 'default' : 'outline'}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {inCart ? 'Adicionar mais' : 'Adicionar'}
                </Button>

                {!canMake && (
                  <p className="text-on-critical z-10 mt-1 text-xs">Estoque insuficiente</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
