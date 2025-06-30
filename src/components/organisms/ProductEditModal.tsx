'use client';

import Button from '@/components/atoms/Button';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/hooks/useIngredientContext';

export default function ProductEditModal() {
  const { state, dispatch } = useIngredientContext();
  const { isModalOpen, ingredientToEdit } = state;

  const [editedIngredient, setEditedIngredient] = useState<Ingredient>(
    ingredientToEdit || ({} as Ingredient)
  );

  useEffect(() => {
    if (ingredientToEdit) {
      setEditedIngredient(ingredientToEdit);
    }
  }, [ingredientToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedIngredient(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'buyPrice' || name === '' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'EDIT_INGREDIENT', payload: editedIngredient });
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
            value={editedIngredient.name || ''}
            onChange={handleChange}
            placeholder="Nome do ingrediente"
          />
          <input
            className={inputStyle}
            type="number"
            name="quantity"
            value={editedIngredient.quantity || 0}
            onChange={handleChange}
            placeholder="Quantidade"
          />
          <input
            className={inputStyle}
            type="number"
            name="buyPrice"
            value={editedIngredient.buyPrice || 0}
            onChange={handleChange}
            placeholder="Preço de compra"
          />
          <select
            title="Campo de escolha de medida do produto"
            value={editedIngredient.unit}
            onChange={e =>
              setEditedIngredient(prev => ({ ...prev, unit: e.target.value as UnitType }))
            }
          >
            <option value="g">Grama (g)</option>
            <option value="kg">Quilo (kg)</option>
            <option value="ml">Mililitro (ml)</option>
            <option value="l">Litro (l)</option>
            <option value="unidade">Unidade</option>
          </select>

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
