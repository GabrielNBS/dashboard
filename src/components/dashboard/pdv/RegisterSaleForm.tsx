// src/components/RegisterSaleForm.tsx
'use client';

import React from 'react';
import ProductCatalog from '@/components/features/pdv/ProductCatalog';
import ShoppingCart from '@/components/features/pdv/ShoppingCart';
import PaymentConfiguration from '@/components/features/pdv/PaymentConfiguration';
import OrderSummary from '@/components/features/pdv/OrderSummary';
import { useSaleProcess } from '@/hooks/business/useSaleProcess';

export default function RegisterSaleForm() {
  const {
    cart,
    payment,
    sellingResume,
    products,
    addToCart,
    removeFromCart,
    updateQuantity,
    setPayment,
    confirmSale,
    canMakeProduct,
  } = useSaleProcess();

  return (
    <div className="v min-h-screen p-6">
      <div className="x mx-auto">
        <div className="mb-6">
          <h1 className="text-primary text-xl font-bold">Sistema de Vendas</h1>
          <p className="text-muted-foreground">Selecione os produtos e configure o pagamento</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ProductCatalog
            products={products}
            cart={cart}
            onAddToCart={addToCart}
            canMakeProduct={canMakeProduct}
          />

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <ShoppingCart
                cart={cart}
                products={products}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateQuantity}
                canMakeProduct={canMakeProduct}
              />

              {cart.length > 0 && (
                <>
                  <PaymentConfiguration payment={payment} onPaymentChange={setPayment} />
                  <OrderSummary
                    sellingResume={sellingResume}
                    payment={payment}
                    onConfirmSale={confirmSale}
                    isCartEmpty={cart.length === 0}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
