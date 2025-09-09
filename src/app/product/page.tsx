'use client';

import { useState } from 'react';
import Button from '@/components/ui/base/Button';
import { Plus } from 'lucide-react';
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

export default function Product() {
  const { state } = useProductContext();
  const { products } = state;

  const [openForm, setOpenForm] = useState(false);

  const handleOpenNewForm = () => {
    setOpenForm(true);
  };

  return (
    <div className="w-full rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Produtos Cadastrados</h2>
        <Button size="md" onClick={handleOpenNewForm}>
          <Plus className="mr-1" />
          Novo Produto
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-muted rounded-lg py-12 text-center">
          <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          <Button size="md" onClick={handleOpenNewForm}>
            Criar Primeiro Produto
          </Button>
        </div>
      ) : (
        <ProductsList />
      )}

      <Sheet open={openForm} onOpenChange={setOpenForm}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="text-center">
            <SheetTitle>Adicionar ou Editar Produto</SheetTitle>
            <SheetDescription>Preencha as informações do produto.</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ProductForm onClose={() => setOpenForm(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
