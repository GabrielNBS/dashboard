'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { useFinalProductContext } from '@/contexts/products/useFinalProductContext';
import RegisterIngredientForm from '@/components/dashboard/product/RegisterIngredientForm';
import ProductsList from '@/components/dashboard/product/ProductsList';

export default function Product() {
  const [openForm, setOpenForm] = useState(false);
  const { state } = useFinalProductContext();
  const handleToggleForm = () => setOpenForm(prev => !prev);

  return (
    <div className="p-default relative w-full rounded-lg shadow-md">
      {openForm ? (
        <RegisterIngredientForm onClose={handleToggleForm} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Produtos Cadastrados</h2>
            <Button onClick={handleToggleForm} className="h-12 w-12 rounded-full">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>

          {state.products.length === 0 ? (
            <span className="text-gray-500">Nenhum produto cadastrado.</span>
          ) : (
            <ProductsList />
          )}
        </>
      )}
    </div>
  );
}
