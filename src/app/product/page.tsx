'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import RegisterIngredientForm from '@/components/dashboard/product/RegisterIngredientForm';
import ProductsList from '@/components/dashboard/product/ProductsList';
import { useProductContext } from '@/contexts/products/ProductContext';

export default function Product() {
  const [openForm, setOpenForm] = useState(false);
  const { state, dispatch } = useProductContext();
  const { productToEdit, products } = state;

  useEffect(() => {
    if (productToEdit) {
      setOpenForm(true);
    }
  }, [productToEdit]);

  const handleOpenNewForm = () => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);

    setTimeout(() => {
      dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    }, 0);
  };

  return (
    <div className="p-default w-full rounded-lg shadow-md">
      {openForm ? (
        <RegisterIngredientForm onClose={handleCloseForm} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Produtos Cadastrados</h2>
            <Button onClick={handleOpenNewForm} className="h-12 w-12 rounded-full">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>

          {products.length === 0 ? (
            <span className="text-gray-500">Nenhum produto cadastrado.</span>
          ) : (
            <ProductsList />
          )}
        </>
      )}
    </div>
  );
}
