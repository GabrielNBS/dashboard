'use client';

import Button from '@/components/ui/base/Button';
import { PackagePlus, Plus } from 'lucide-react';
import ProductsList from '@/components/dashboard/product/ProductsList';
import { useProductContext } from '@/contexts/products/ProductContext';
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
  const { products } = state;

  const handleToggleForm = () => {
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
          <Button size="md" onClick={handleToggleForm}>
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
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="text-center">
            <SheetTitle>Adicionar ou Editar Produto</SheetTitle>
            <SheetDescription>Preencha as informações do produto.</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ProductForm />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
