'use client';

import { useState } from 'react';
import Button from '@/components/atoms/Button';
import { PlusIcon } from 'lucide-react';
import clsx from 'clsx';
import RegisterProductForm from '@/components/molecules/RegisterIngredientForm';
export default function ProductFormContainer() {
  const [openForm, setOpenForm] = useState(false);

  const handleAddProduct = () => {
    setOpenForm(!openForm);
    console.log('Adicionar produto');
  };

  return (
    <div className="p-default relative max-h-[512px] min-h-[400px] w-full rounded-lg shadow-md">
      {openForm ? (
        <RegisterProductForm />
      ) : (
        <Button
          onClick={handleAddProduct}
          className={clsx('absolute right-6 bottom-10 h-16 w-16 rounded-full')}
        >
          <PlusIcon className="h-10 w-10" strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}
