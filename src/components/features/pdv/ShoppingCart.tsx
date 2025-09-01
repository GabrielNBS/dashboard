'use client';

import React from 'react';
import { ShoppingCart as ShoppingCartIcon, Trash2, Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { CartItem } from '@/types/sale';
import { ProductState } from '@/types/products';

interface ShoppingCartProps {
  cart: CartItem[];
  products: ProductState[];
  onRemoveFromCart: (uid: string) => void;
  onUpdateQuantity: (uid: string, quantity: number) => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
}

export default function ShoppingCart({
  cart,
  products,
  onRemoveFromCart,
  onUpdateQuantity,
  canMakeProduct,
}: ShoppingCartProps) {
  return (
    <div className="bg-surface rounded-lg p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
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
        <div className="space-y-3">
          {cart.map(item => {
            const product = products.find(p => p.uid === item.uid);
            if (!product) return null;
            const sellingPrice = product.production.sellingPrice;

            return (
              <div key={item.uid} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex-1">
                  <p className="text-muted-foreground font-medium">{product.name}</p>
                  <p className="text-muted-foreground text-sm">R$ {sellingPrice.toFixed(2)} cada</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.uid, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.uid, item.quantity + 1)}
                    disabled={!canMakeProduct(item.uid, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button size="sm" variant="destructive" onClick={() => onRemoveFromCart(item.uid)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
