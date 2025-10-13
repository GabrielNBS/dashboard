'use client';

import React from 'react';
import { PackagePlus, Plus } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { CartItem } from '@/types/sale';
import { ProductState } from '@/types/products';
import { useHydrated } from '@/hooks/ui/useHydrated';
import { formatCurrency } from '@/utils/UnifiedUtils';

import EmptyList from '@/components/ui/feedback/EmptyList';

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

  products.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full">
      <div className="bg-muted rounded-lg p-3 shadow-sm sm:p-6">
        {products.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <EmptyList
              title="Nenhum produto cadastrado"
              message="crie seu primeiro produto"
              icon={<PackagePlus className="text-muted-foreground mb-4 h-12 w-12" />}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {products.map(product => {
              const inCart = cart.find(item => item.uid === product.uid);
              const canMake = canMakeProduct(product.uid, inCart?.quantity ?? 0 + 1);
              const sellingPrice = product.production.sellingPrice;

              return (
                <div
                  key={product.uid}
                  className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                    inCart
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-muted-foreground'
                  } ${!canMake ? 'opacity-50' : ''}`}
                >
                  {/* Mobile Layout */}
                  <div className="flex items-center gap-3 p-2.5 sm:hidden">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={'https://placehold.co/250'}
                        alt={product.name}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-primary truncate text-sm font-medium">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground truncate text-xs">
                              {product.category}
                            </p>
                            <p
                              className={`ml-2 text-sm font-bold ${inCart ? 'text-primary' : 'text-accent'}`}
                            >
                              {formatCurrency(sellingPrice)}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="ml-3 flex items-center">
                          <Button
                            size="sm"
                            onClick={() => onAddToCart(product.uid)}
                            disabled={!canMake}
                            variant={inCart ? 'default' : 'outline'}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Cart Quantity Badge */}
                    {inCart && (
                      <div className="absolute -top-0.5 -right-0.5">
                        <span className="bg-primary flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white">
                          {inCart.quantity}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden p-4 sm:block">
                    <div className="mb-3">
                      <h3 className="text-primary font-semibold">{product.name}</h3>
                      <p className="text-muted-foreground text-sm">{product.category}</p>
                    </div>

                    <div className="mb-3 flex justify-center">
                      <img
                        className="h-32 w-32 rounded-xl object-cover lg:h-40 lg:w-40"
                        src={'https://placehold.co/250'}
                        alt={product.name}
                      />
                    </div>

                    <div className="mb-3">
                      <p
                        className={`text-lg font-bold ${inCart ? 'text-primary font-black' : 'text-accent'}`}
                      >
                        {formatCurrency(sellingPrice)}
                      </p>
                    </div>

                    {inCart && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
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
                  </div>

                  {/* Error Message */}
                  {!canMake && (
                    <div className="px-3 pb-2 sm:px-4">
                      <p className="text-destructive text-xs">Estoque insuficiente</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
