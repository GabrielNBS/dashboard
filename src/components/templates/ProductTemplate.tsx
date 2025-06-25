'use client';

import { useState } from 'react';
import Button from '@/components/atoms/Button';
import { PlusIcon } from 'lucide-react';
import RegisterIngredientForm from '@/components/molecules/RegisterIngredientForm';
import { useFinalProductListContext } from '@/hooks/useFinalProductListContext';

export default function ProductFormContainer() {
  const [openForm, setOpenForm] = useState(false);
  const { state } = useFinalProductListContext();

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
            <p className="text-gray-500">Nenhum produto cadastrado.</p>
          ) : (
            <ul className="space-y-4">
              {state.products.map((prod, index) => {
                const total = prod.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
                const lucro = total * 0.2;

                return (
                  <li key={index} className="rounded border bg-white p-4 text-sm shadow-sm">
                    <h3 className="text-lg font-semibold">{prod.name}</h3>
                    <p className="text-gray-600">Categoria: {prod.category}</p>
                    <ul className="mt-2">
                      {prod.ingredients.map((ingredient, i) => (
                        <li key={i}>
                          - {ingredient.name} ({ingredient.quantity} x R$
                          {ingredient.sellPrice.toFixed(2)}) = R$
                          {ingredient.totalValue.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex justify-between font-medium">
                      <span>Total: R${total.toFixed(2)}</span>
                      <span>Lucro: R${lucro.toFixed(2)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
