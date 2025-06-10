'use client';

import Button from '@/components/atoms/Button';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Product } from '@/types/ProductProps';
import { useProductContext } from '@/hooks/useProductContext';

export default function ProductEditModal() {
  const { state, dispatch } = useProductContext();
  const { isModalOpen, productToEdit } = state;

  const [editedProduct, setEditedProduct] = useState<Product>(productToEdit || ({} as Product));

  useEffect(() => {
    if (productToEdit) {
      setEditedProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'buyPrice' || name === 'sellPrice' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'EDIT_PRODUCT', payload: editedProduct });
    dispatch({ type: 'CLOSE_EDIT_MODAL' });
  };

  const inputStyle = 'rounded-md border border-gray-300 p-2 w-full h-full';

  return (
    <div
      className={clsx(
        'fixed inset-0 flex items-center justify-center bg-black/80 transition-opacity duration-300',
        {
          hidden: !isModalOpen,
        }
      )}
    >
      <div className="flex w-96 flex-col gap-2 rounded-md bg-white p-4 shadow-md">
        <h2 className="text-hero-lg font-bold">Editar produto</h2>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            className={inputStyle}
            type="text"
            name="name"
            value={editedProduct.name || ''}
            onChange={handleChange}
            placeholder="Nome do produto"
          />
          <input
            className={inputStyle}
            type="number"
            name="quantity"
            value={editedProduct.quantity || 0}
            onChange={handleChange}
            placeholder="Quantidade"
          />
          <input
            className={inputStyle}
            type="number"
            name="buyPrice"
            value={editedProduct.buyPrice || 0}
            onChange={handleChange}
            placeholder="Preço de compra"
          />
          <input
            className={inputStyle}
            type="number"
            name="sellPrice"
            value={editedProduct.sellPrice || 0}
            onChange={handleChange}
            placeholder="Preço de venda"
          />
          <div className="flex gap-2">
            <Button variant="accept" type="submit">
              Salvar
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
