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
    <div className="p-default w-full rounded-lg">
      {openForm ? (
        <RegisterIngredientForm onClose={handleCloseForm} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Produtos Cadastrados</h2>
            <Button
              onClick={handleOpenNewForm}
              className="absolute right-12 bottom-12 h-18 w-18 rounded-full"
              tooltip={{ tooltipContent: 'criar novo produto' }}
            >
              <PlusIcon className="h-8 w-8" />
            </Button>
          </div>

          {products.length === 0 ? (
            <span className="text-muted-foreground">Nenhum produto cadastrado.</span>
          ) : (
            <ProductsList />
          )}
        </>
      )}
    </div>
  );
}
