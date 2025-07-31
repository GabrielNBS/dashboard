'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { denormalizeQuantity, normalizeQuantity } from '@/utils/normalizeQuantity';
import { useToast } from '@/components/ui/use-toast';
import {
  ingredientSchema,
  type IngredientFormData,
  validateQuantityByUnit,
} from '@/schemas/validationSchemas';
import UnitTypeInfo from './UnitTypeInfo';
import { getQuantityInputConfig } from '@/utils/quantityInputConfig';

export default function ProductEditModal() {
  const { state, dispatch } = useIngredientContext();
  const { isModalOpen, ingredientToEdit } = state;
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

  // Atualiza o formulário quando o modal é aberto
  useEffect(() => {
    if (ingredientToEdit) {
      reset({
        name: ingredientToEdit.name,
        quantity: denormalizeQuantity(ingredientToEdit.quantity, ingredientToEdit.unit).toString(),
        unit: ingredientToEdit.unit,
        buyPrice: ingredientToEdit.buyPrice?.toString() || '',
      });
    }
  }, [ingredientToEdit, reset]);

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

    const updatedIngredient: Ingredient = {
      ...ingredientToEdit!,
      name: data.name.trim(),
      quantity: normalizedQuantity,
      unit: data.unit,
      buyPrice: rawPrice,
      totalValue,
    };

    dispatch({ type: 'EDIT_INGREDIENT', payload: updatedIngredient });
    dispatch({ type: 'CLOSE_EDIT_MODAL' });

    toast({
      title: 'Ingrediente atualizado com sucesso!',
      description: `"${data.name}" foi atualizado.`,
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
    <div
      className={clsx(
        'fixed inset-0 flex items-center justify-center bg-black/80 transition-opacity duration-300',
        {
          hidden: !isModalOpen,
        }
      )}
    >
      <div className="flex w-96 flex-col gap-4 rounded-md bg-white p-4 shadow-md">
        <h2 className="text-hero-lg font-bold">Editar ingrediente</h2>

        {/* Informações sobre o tipo de unidade selecionado */}
        <UnitTypeInfo unit={watchedUnit} />

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
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

          <div>
            {(() => {
              const { step, min, placeholder } = getQuantityInputConfig(watchedUnit);

              return (
                <Input
                  type="number"
                  step={step}
                  min={min}
                  placeholder={placeholder}
                  {...register('quantity', {
                    onChange: e => validateQuantity(e.target.value),
                  })}
                  id="quantity"
                  className={errors.quantity ? 'border-red-500' : ''}
                />
              );
            })()}

            {errors.quantity && (
              <span className="mt-1 block text-sm text-red-500">{errors.quantity.message}</span>
            )}
          </div>

          <div>
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

          <div>
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

          <div className="flex gap-2">
            <Button variant="accept" type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
