'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const onSubmit = (data: IngredientFormData) => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = parseFloat(data.buyPrice);

    // Validação adicional para quantidade baseada na unidade
    const unitValidationError = validateQuantityByUnit(rawQuantity, data.unit);
    if (unitValidationError) {
      toast({
        title: 'Erro de validação',
        description: unitValidationError,
        variant: 'destructive',
      });
      return;
    }

    const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);
    const totalValue = normalizedQuantity * rawPrice;

    const newIngredient: Ingredient = {
      id: uuidv4(),
      name: data.name.trim(),
      quantity: normalizedQuantity,
      unit: data.unit,
      buyPrice: rawPrice,
      totalValue,
    };

    handleAddIngredient(newIngredient);

    // Reset do formulário
    reset();

    toast({
      title: 'Ingrediente adicionado',
      description: `"${data.name}" cadastrado com sucesso.`,
      variant: 'accept',
    });
  };

  // Atualizar validação quando a unidade muda
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as UnitType;
    setValue('unit', newUnit);

    // Revalidar quantidade se houver valor
    if (watchedQuantity) {
      validateQuantity(watchedQuantity);
    }
  };

  return (
    <div className="w-full">
      {/* Informações sobre o tipo de unidade selecionado */}
      <UnitTypeInfo unit={watchedUnit} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Nome do ingrediente"
            {...register('name')}
            id="name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <span className="mt-1 block text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex-1">
          <Input
            type="number"
            step={watchedUnit === 'un' ? '1' : 'any'}
            placeholder={`Quantidade (${watchedUnit})`}
            {...register('quantity', {
              onChange: e => validateQuantity(e.target.value),
            })}
            id="quantity"
            min={watchedUnit === 'un' ? '1' : '0.001'}
            className={errors.quantity ? 'border-red-500' : ''}
          />
          {errors.quantity && (
            <span className="mt-1 block text-sm text-red-500">{errors.quantity.message}</span>
          )}
        </div>

        <div className="flex-1">
          <select
            title="Campo de medida do produto"
            {...register('unit')}
            onChange={handleUnitChange}
            className={`w-full rounded border p-2 ${errors.unit ? 'border-red-500' : ''}`}
          >
            <option value="kg">Quilo (kg)</option>
            <option value="l">Litro (l)</option>
            <option value="un">Unidade</option>
          </select>
          {errors.unit && (
            <span className="mt-1 block text-sm text-red-500">{errors.unit.message}</span>
          )}
        </div>

        <div className="flex-1">
          <Input
            type="number"
            step="0.01"
            placeholder="Preço de compra"
            {...register('buyPrice')}
            id="buyPrice"
            min="0"
            className={errors.buyPrice ? 'border-red-500' : ''}
          />
          {errors.buyPrice && (
            <span className="mt-1 block text-sm text-red-500">{errors.buyPrice.message}</span>
          )}
        </div>

        <Button variant="accept" type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </form>
    </div>
  );
}
