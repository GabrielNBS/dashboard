'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { PackagePlus, Plus } from 'lucide-react';

import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import Button from '@/components/ui/base/Button';
import ProductsList from '@/components/dashboard/product/ProductsList';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/feedback/sheet';
import { ProductForm } from '@/components/dashboard/product/ProductForm';
import { Header } from '@/components/ui/Header';

export default function Product() {
  const { state, dispatch } = useProductContext();
  const { dispatch: builderDispatch } = useProductBuilderContext();
  const { products } = state;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleToggleForm = () => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    builderDispatch({ type: 'RESET_PRODUCT' });
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  const handleCloseForm = () => {
    builderDispatch({ type: 'RESET_PRODUCT' });
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <Header
        title="Produtos"
        subtitle="Gerencie seus produtos e produza lotes quando necessário"
      />

      {products.length > 0 && (
        <Button
          type="button"
          size="md"
          className="fixed right-4 bottom-4 z-20 shadow-lg sm:right-6 sm:bottom-6"
          onClick={handleToggleForm}
          aria-label="Criar novo produto"
        >
          <Plus className="mr-1" aria-hidden="true" />
          <span className="hidden sm:inline">Novo Produto</span>
          <span className="sm:hidden">Criar produto</span>
        </Button>
      )}

      {createPortal(
        <Sheet open={state.isFormVisible} onOpenChange={handleToggleForm}>
          <SheetContent
            side="right"
            className="z-100 w-full max-w-3xl p-0"
            aria-labelledby="product-form-title"
            aria-describedby="product-form-description"
          >
            <ProductForm.Root onClose={handleCloseForm}>
              <div className="flex h-full flex-col">
                <SheetHeader className="border-border shrink-0 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <PackagePlus className="text-primary h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <SheetTitle
                        id="product-form-title"
                        className="text-foreground text-lg font-semibold"
                      >
                        {state.isEditMode ? 'Editar Produto' : 'Novo Produto'}
                      </SheetTitle>
                      <SheetDescription
                        id="product-form-description"
                        className="text-muted-foreground text-sm"
                      >
                        {state.isEditMode
                          ? 'Atualize as informações do produto existente'
                          : 'Preencha as informações para criar um novo produto'}
                      </SheetDescription>
                    </div>
                  </div>
                  <div className="mt-6">
                    <ProductForm.Header />
                  </div>
                </SheetHeader>

                <div className="scrollbar-hide flex-1 overflow-scroll">
                  <ProductForm.Content />
                </div>

                <SheetFooter className="border-border shrink-0 border-t">
                  <ProductForm.Footer />
                </SheetFooter>
              </div>
            </ProductForm.Root>
          </SheetContent>
        </Sheet>,
        document.body
      )}

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <section
          className="bg-muted rounded-lg py-12 text-center"
          aria-labelledby="empty-state-title"
        >
          <div className="mb-4 flex flex-col items-center justify-center gap-2">
            <PackagePlus
              className="text-muted-foreground"
              width={60}
              height={60}
              aria-hidden="true"
            />
            <p id="empty-state-title" className="text-muted-foreground">
              Nenhum produto cadastrado
            </p>
          </div>
          <Button
            type="button"
            size="md"
            onClick={handleToggleForm}
            aria-describedby="empty-state-title"
          >
            Criar Primeiro Produto
          </Button>
        </section>
      ) : (
        <section aria-labelledby="products-list-title">
          <h2 id="products-list-title" className="sr-only">
            Lista de produtos
          </h2>
          <ProductsList />
        </section>
      )}
    </div>
  );
}
