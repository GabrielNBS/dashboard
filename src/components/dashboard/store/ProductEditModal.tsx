'use client';

import Button from '@/components/ui/Button';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { normalizeQuantity } from '@/utils/normalizeQuantity';
import { useToast } from '@/components/ui/use-toast';

export default function ProductEditModal() {
  const { state, dispatch } = useIngredientContext();
  const { isModalOpen, ingredientToEdit } = state;
  const { toast } = useToast();
  const [editedIngredient, setEditedIngredient] = useState<Ingredient>(
    ingredientToEdit || ({} as Ingredient)
  );

  // Atualiza o estado local quando o modal é aberto
  useEffect(() => {
    if (ingredientToEdit) {
      setEditedIngredient(ingredientToEdit);
    }
  }, [ingredientToEdit]);

  //  Função para tratar inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedIngredient(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'buyPrice' ? Number(value) : value,
    }));
  };

  // Tratamento especial para a unidade (select)
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value as UnitType;

    setEditedIngredient(prev => ({
      ...prev,
      unit: selectedUnit,
    }));
  };

  //  Valida os campos antes de salvar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, quantity, buyPrice, unit } = editedIngredient;

    const rawQuantity = parseFloat(quantity.toString());
    const rawPrice = parseFloat(buyPrice?.toString() || '0');

    if (!name || isNaN(rawQuantity) || isNaN(rawPrice) || !unit) {
      toast({
        title: 'Preencha todos os campos corretamente',
        variant: 'destructive',
      });
      return;
    }

    if (rawQuantity <= 0 || rawPrice <= 0) {
      toast({
        title: 'Valores Inválidos',
        description: 'Quantidade e preço devem ser maiores que zero.',
        variant: 'destructive',
      });
      return;
    }

    const normalizedQuantity = normalizeQuantity(rawQuantity, unit);

    const updatedIngredient: Ingredient = {
      ...editedIngredient,
      quantity: normalizedQuantity,
      totalValue: normalizedQuantity * rawPrice,
    };

    dispatch({ type: 'EDIT_INGREDIENT', payload: updatedIngredient });
    dispatch({ type: 'CLOSE_EDIT_MODAL' });

    toast({
      title: 'Ingrediente atualizado com sucesso!',
      variant: 'accept',
    });
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
        <h2 className="text-hero-lg font-bold">Editar ingrediente</h2>
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
            min={0}
            step="any"
            placeholder="Quantidade"
          />
          <input
            className={inputStyle}
            type="number"
            name="buyPrice"
            value={editedIngredient.buyPrice ?? ''}
            onChange={handleChange}
            min={0}
            step={0.01}
            placeholder="Preço de compra"
          />
          <select
            title="Campo de escolha de medida do produto"
            value={editedIngredient.unit}
            onChange={handleUnitChange}
            className={inputStyle}
          >
            <option value="kg">Quilo (kg)</option>
            <option value="l">Litro (l)</option>
            <option value="un">Unidade</option>
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
