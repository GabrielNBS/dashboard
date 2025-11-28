'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import ProductForm from '@/components/dashboard/store/IngredientForm';
import ProductTable from '@/components/dashboard/store/IngredientList';
import { Header } from '@/components/ui/Header';

function AsyncProductTable() {
  return (
    <Suspense fallback={<ProductTableSkeleton />}>
      <ProductTable />
    </Suspense>
  );
}

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
  const searchParams = useSearchParams();
  const focusId = searchParams.get('focus');

  useEffect(() => {
    if (focusId) {
      // Small delay to ensure content is loaded/rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(`ingredient-${focusId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-primary', 'transition-all', 'duration-500');

          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-primary');
          }, 3000);
        }
      }, 500); // 500ms delay to wait for Suspense/Rendering

      return () => clearTimeout(timer);
    }
  }, [focusId]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <Header title="Estoque" subtitle="Gerencie os produtos da loja" />
      <h2 id="product-form-title" className="sr-only">
        Formulário de produtos
      </h2>
      <ProductForm />
      <h2 id="product-table-title" className="sr-only">
        Lista de produtos em estoque
      </h2>{' '}
      <AsyncProductTable />
    </div>
  );
}
