'use client';

import BatchStatusBar from '@/components/features/pdv/BatchStatusBar';
import OrderSummary from '@/components/features/pdv/OrderSummary';
import PaymentConfiguration from '@/components/features/pdv/PaymentConfiguration';
import UnifiedProductCatalog from '@/components/features/pdv/unifiedProductCatalog';
import UnifiedShoppingCart from '@/components/features/pdv/UnifiedShoppingCart';
import { Button } from '@/components/ui/base';
import { Sheet, SheetContent, SheetDescription, SheetHeader } from '@/components/ui/feedback';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { useUnifiedSaleProcess } from '@/hooks/business/useUnifiedSaleProcess';

import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
  } = useUnifiedSaleProcess();

  const { state: ingredientStore } = useIngredientContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="w-full overflow-hidden">
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Barra de Status do Lote (Ex: ingredientes/estoque) */}
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
              />
            </div>

            {/* Carrinho e Pagamento - Desktop (Fixo na tela em telas grandes) */}
            <div className="hidden w-full xl:block xl:w-80 xl:flex-shrink-0">
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

        {/* Carrinho e Pagamento - Mobile (Sheet) */}
        <div className="xl:hidden">
          {mounted &&
            createPortal(
              <>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-4 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 sm:h-16 sm:w-16 md:hidden lg:hidden"
                  aria-label="Abrir carrinho de compras"
                  onClick={() => setIsCartOpen(true)}
                >
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white sm:h-6 sm:w-6 sm:text-xs">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </Button>
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetContent
                    side="right"
                    className="flex w-full max-w-md flex-col p-0 sm:max-w-lg"
                  >
                    <SheetHeader className="border-b p-4 sm:p-6">
                      <SheetDescription className="text-xs sm:text-sm">
                        {cart.length === 0 && 'Adicione produtos ao carrinho'}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-3 sm:space-y-4">
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
                            onConfirmSale={() => {
                              confirmSale();
                              setIsCartOpen(false);
                            }}
                            isCartEmpty={cart.length === 0}
                          />
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </>,
              document.body
            )}
        </div>
      </div>
    </>
  );
}
