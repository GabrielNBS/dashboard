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
import { useHydrated } from '@/hooks/ui/useHydrated';

export default function Product() {
  const hydrated = useHydrated();
  const { state, dispatch } = useProductContext();
  const { dispatch: builderDispatch } = useProductBuilderContext();
  const { products } = state;

  const handleToggleForm = () => {
    // Sempre limpar dados do produto em edição e resetar builder context
    // para garantir que não há dados residuais do modo de edição
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    builderDispatch({ type: 'RESET_PRODUCT' });
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  // Renderizar um skeleton enquanto não hidratou
  if (!hydrated) {
    return (
      <div className="w-full rounded-lg p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="bg-muted rounded-lg py-12 text-center">
          <div className="mb-4 flex flex-col items-center justify-center gap-2">
            <div className="h-16 w-16 animate-pulse rounded bg-gray-300" />
            <div className="h-5 w-48 animate-pulse rounded bg-gray-300" />
          </div>
          <div className="mx-auto h-10 w-40 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Produtos Cadastrados</h2>
        {products.length > 0 && (
          <Button size="md" className="fixed right-15 bottom-4 z-10" onClick={handleToggleForm}>
            <Plus className="mr-1" />
            Novo Produto
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-muted rounded-lg py-12 text-center">
          <div className="mb-4 flex flex-col items-center justify-center gap-2">
            <PackagePlus className="text-muted-foreground" width={60} height={60} />
            <p className="text-muted-foreground">Nenhum produto cadastrado</p>
          </div>
          <Button size="md" onClick={handleToggleForm}>
            Criar Primeiro Produto
          </Button>
        </div>
      ) : (
        <ProductsList />
      )}

      <Sheet
        open={state.isFormVisible}
        onOpenChange={() => dispatch({ type: 'TOGGLE_FORM_VISIBILITY' })}
      >
        <SheetContent side="right" className="max-w-3xl overflow-hidden p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="flex-shrink-0 border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <PackagePlus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <SheetTitle className="text-lg font-semibold text-gray-900">
                    {state.isEditMode ? 'Editar Produto' : 'Novo Produto'}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500">
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
