'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { normalizeQuantity } from '@/utils/normalizeQuantity';
import { useToast } from '@/components/ui/use-toast';
import {
  ingredientSchema,
  type IngredientFormData,
  validateQuantityByUnit,
} from '@/utils/validationSchemas';
import UnitTypeInfo from './UnitTypeInfo';
import { v4 as uuidv4 } from 'uuid';
import { IngredientsFormData, ingredientsSchema } from '@/schemas/ingredientsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function IngredientForm() {
  const { dispatch } = useIngredientContext();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      quantity: '',
      unit: 'kg',
      buyPrice: '',
    },
  });

  const watchedUnit = watch('unit');
  const watchedQuantity = watch('quantity');

  // Validação em tempo real para quantidade baseada na unidade
  const validateQuantity = (value: string) => {
    if (!value) return true;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return true;

    const unitError = validateQuantityByUnit(numValue, watchedUnit);
    if (unitError) {
      setError('quantity', { message: unitError });
      return false;
    } else {
      clearErrors('quantity');
      return true;
    }
  };

  function handleAddIngredient(ingredient: Ingredient) {
    dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawQuantity = parseFloat(quantity);
    const rawPrice = parseFloat(buyPrice);

    if (!name || isNaN(rawQuantity) || isNaN(rawPrice) || !unit) {
      toast({
        title: 'Erro de validação',
        description: unitValidationError,
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
      totalValue,
    };

    handleAddIngredient(newIngredient);

    setName('');
    setQuantity('');
    setBuyPrice('');
    setUnit('kg');

    toast({
      title: 'Ingrediente adicionado',
      description: `"${data.name}" cadastrado com sucesso.`,
      variant: 'accept',
    });

    reset();
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitType;
    setValue('unit', newUnit);

    if (watchedQuantity) {
      validateQuantity(watchedQuantity);
    }
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
