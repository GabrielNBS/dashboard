'use client';

import ProductForm from '@/components/dashboard/store/IngredientForm';
import ProductEditModal from '@/components/dashboard/store/IngredientEditPanel';
import ProductTable from '@/components/dashboard/store/IngredientList';

export default function Store() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-4 sm:gap-6 sm:p-6">
      <div className="flex w-full flex-col items-start justify-start">
        <h2 className="text-lg font-bold sm:text-xl">Controle de Estoque</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gerencie seus ingrediente e produtos{' '}
        </p>
      </div>
      <ProductForm />
      <ProductTable />
      <ProductEditModal />
    </div>
  );
}
