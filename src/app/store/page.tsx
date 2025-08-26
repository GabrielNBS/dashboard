'use client';

import ProductForm from '@/components/dashboard/store/IngredientForm';
import ProductEditModal from '@/components/dashboard/store/IngredientEditPanel';
import ProductTable from '@/components/dashboard/store/IngredientList';

export default function Store() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full flex-col items-start justify-start">
        <h2 className="text-xl font-bold">Controle de Estoque</h2>
        <p className="text-md text-muted-foreground">Gerencie seus ingrediente e produtos </p>
      </div>
      <ProductForm />
      <ProductTable />
      <ProductEditModal />
    </div>
  );
}
