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
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row">
        {/* Catálogo de Produtos */}
        <div className="min-w-0 flex-1 xl:flex-[2]">
          <ProductCatalog
            products={products}
            cart={cart}
            onAddToCart={addToCart}
            canMakeProduct={canMakeProduct}
          />
        </div>

        {/* Carrinho e Pagamento */}
        <div className="w-full xl:w-80 xl:flex-shrink-0">
          <div className="space-y-4 xl:sticky xl:top-4">
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
  );
}
