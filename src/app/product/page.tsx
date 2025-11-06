'use client';

import Button from '@/components/ui/base/Button';
import { PackagePlus, Plus } from 'lucide-react';
import ProductsList from '@/components/dashboard/product/ProductsList';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/feedback/sheet';
import ProductForm from '@/components/dashboard/product/ProductForm';
import { Header } from '@/components/ui/Header';

export default function Product() {
  const { state, dispatch } = useProductContext();
  const { dispatch: builderDispatch } = useProductBuilderContext();
  const { products } = state;

  const handleToggleForm = () => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    builderDispatch({ type: 'RESET_PRODUCT' });
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  return (
    <div className="w-full rounded-lg p-6">
      <Header
        title="Produtos"
        subtitle="Gerencie seus produtos e produza lotes quando necessário"
      />
      {products.length > 0 && (
        <Button
          type="button"
          size="md"
          className="fixed right-15 bottom-4 z-10"
          onClick={handleToggleForm}
          aria-label="Criar novo produto"
        >
          <Plus className="mr-1" aria-hidden="true" />
          Novo Produto
        </Button>
      )}

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

      <Sheet
        open={state.isFormVisible}
        onOpenChange={() => dispatch({ type: 'TOGGLE_FORM_VISIBILITY' })}
      >
        <SheetContent
          side="right"
          className="max-w-3xl overflow-hidden p-0"
          aria-labelledby="product-form-title"
          aria-describedby="product-form-description"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="border-border flex-shrink-0 border-b p-6">
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
            </SheetHeader>
            <div className="flex-1 overflow-hidden p-6">
              <ProductForm />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
