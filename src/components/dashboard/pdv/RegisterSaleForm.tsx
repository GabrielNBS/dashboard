// src/components/RegisterSaleForm.tsx
'use client';

import React from 'react';
import UnifiedProductCatalog from '@/components/features/pdv/UnifiedProductCatalog';
import UnifiedShoppingCart from '@/components/features/pdv/UnifiedShoppingCart';
import PaymentConfiguration from '@/components/features/pdv/PaymentConfiguration';
import OrderSummary from '@/components/features/pdv/OrderSummary';
import BatchStatusBar from '@/components/features/pdv/BatchStatusBar';
import { useUnifiedSaleProcess } from '@/hooks/business/useUnifiedSaleProcess';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

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
    getBatchInfo,
  } = useUnifiedSaleProcess();

  const { state: ingredientStore } = useIngredientContext();

  return (
    <div className="w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6">
        <BatchStatusBar
          products={products}
          availableIngredients={ingredientStore.ingredients}
          cartItemsCount={cart.length}
        />

        <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row">
          {/* Catálogo de Produtos */}
          <div className="min-w-0 flex-1 xl:flex-[2]">
            <UnifiedProductCatalog
              products={products}
              cart={cart}
              availableIngredients={ingredientStore.ingredients}
              onAddToCart={addToCart}
              canMakeProduct={canMakeProduct}
              getBatchInfo={getBatchInfo}
            />
          </div>

          {/* Carrinho e Pagamento */}
          <div className="w-full xl:w-80 xl:flex-shrink-0">
            <div className="space-y-4 xl:sticky xl:top-4">
              <UnifiedShoppingCart
                cart={cart}
                products={products}
                availableIngredients={ingredientStore.ingredients}
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
