'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { normalizeQuantity } from '@/utils/normalizeQuantity';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export default function IngredientForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [unit, setUnit] = useState<UnitType>('kg');
  const { dispatch } = useIngredientContext();
  const { toast } = useToast();

  function handleAddIngredient(ingredient: Ingredient) {
    dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawQuantity = parseFloat(quantity);
    const rawPrice = parseFloat(buyPrice);

    if (!name || isNaN(rawQuantity) || isNaN(rawPrice) || !unit) {
      toast({
        title: 'Erro ao adicionar ingrediente',
        description: 'Preencha todos os campos corretamente.',
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

    const newIngredient: Ingredient = {
      id: uuidv4(),
      name,
      quantity: normalizedQuantity,
      unit,
      buyPrice: rawPrice,
      totalValue: normalizedQuantity * rawPrice,
    };

    handleAddIngredient(newIngredient);

    setName('');
    setQuantity('');
    setBuyPrice('');
    setUnit('kg');

    toast({
      title: 'Ingrediente adicionado',
      description: `\"${name}\" cadastrado com sucesso.`,
      variant: 'accept',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-1/2 gap-4">
      <Input
        type="text"
        value={name}
        placeholder="Nome do ingrediente"
        onChange={e => setName(e.target.value)}
        id="name"
      />

      <Input
        type="number"
        value={quantity}
        step="any"
        placeholder={`Quantidade (${unit})`}
        onChange={e => setQuantity(e.target.value)}
        id="quantity"
        min={0}
      />

      <select
        title="Campo de medida do produto"
        value={unit}
        onChange={e => setUnit(e.target.value as UnitType)}
        className="rounded border p-2"
      >
        <option value="kg">Quilo (kg)</option>
        <option value="l">Litro (l)</option>
        <option value="un">Unidade</option>
      </select>

      <Input
        type="number"
        value={buyPrice}
        step="0.01"
        placeholder="Preço de compra"
        onChange={e => setBuyPrice(e.target.value)}
        id="buyPrice"
        min={0}
      />

      <Button variant="accept" type="submit">
        Adicionar
      </Button>
    </form>
  );
}
