'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductForm from '@/components/dashboard/store/IngredientForm';
import ProductEditModal from '@/components/dashboard/store/IngredientEditPanel';
import ProductTable from '@/components/dashboard/store/IngredientList';
import { Header } from '@/components/ui/Header';

// Componente para simular carregamento assíncrono
function AsyncProductTable() {
  return (
    <Suspense fallback={<ProductTableSkeleton />}>
      <ProductTable />
    </Suspense>
  );
}

// Skeleton específico para a tabela de produtos
function ProductTableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function Store() {
  return (
    <div className="relative p-4 sm:p-6">
      <Header title="Estoque" subtitle="Gerencie os produtos da loja" className="mb-4 sm:mb-6" />

      <main className="flex w-full flex-col items-center justify-center gap-4 sm:gap-6">
        <h2 id="product-form-title" className="sr-only">
          Formulário de produtos
        </h2>
        <ProductForm />
        <h2 id="product-table-title" className="sr-only">
          Lista de produtos em estoque
        </h2>{' '}
        <AsyncProductTable />
        <ProductEditModal />
      </main>
    </div>
  );
}
