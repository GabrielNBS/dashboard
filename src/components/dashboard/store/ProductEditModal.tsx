'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { ChevronUp, ChevronDown, CircleX, CheckCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/use-toast';

import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { denormalizeQuantity, normalizeQuantity } from '@/utils/normalizeQuantity';
import { getQuantityInputConfig } from '@/utils/quantityInputConfig';

import {
  ingredientSchema,
  type IngredientFormData,
  validateQuantityByUnit,
} from '@/schemas/validationSchemas';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

import { TooltipTrigger, Tooltip, TooltipContent } from '@/components/ui/tooltip';

/**
 * Componente reutilizável para inputs numéricos com botões de incremento/decremento
 */
function NumericInputWithControls({
  name,
  label,
  step = 1,
  min = 0,
  placeholder,
  error,
}: {
  name: keyof IngredientFormData;
  label: string;
  step?: number;
  min?: number;
  placeholder?: string;
  error?: string;
}) {
  const { register, setValue, watch } = useFormContext<IngredientFormData>();
  const value = watch(name);

  const adjustValue = (delta: number) => {
    const current = parseFloat(value || '0') || 0;
    const newValue = Math.max(current + delta, min);
    setValue(name, newValue.toString(), { shouldValidate: true });
  };

  const getQuickIncrements = () => {
    const current = parseFloat(value || '0') || 0;

    if (name === 'quantity') {
      if (current < 1) return [0.1, 0.5];
      if (current < 10) return [1, 5];
      return [10, 50];
    }

    if (name === 'buyPrice') {
      if (current < 1) return [0.1, 0.5];
      if (current < 10) return [1, 5];
      if (current < 100) return [10, 25];
      return [50, 100];
    }

    return [step, step * 10];
  };

  const quickIncrements = getQuickIncrements();

  return (
    <div className="flex w-full flex-col">
      <label htmlFor={name} className="text-primary font-foreground block text-center text-base">
        {label}
      </label>

      <div className="flex w-full flex-col gap-2">
        <div className="relative w-full max-w-[400px]">
          <input
            {...register(name)}
            id={name}
            type="number"
            step={step}
            min={min}
            placeholder={placeholder}
            style={{
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
            }}
            className={clsx(
              'border-input bg-background h-14 w-full rounded-xl border-2 px-4 py-3 text-center text-lg font-medium',
              'focus:border-inflow focus:ring-accent transition-all focus:ring-2',
              'placeholder:text-gray-400',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              error && 'border-on-critical focus:border-on-critical focus:ring-on-critical'
            )}
          />

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {quickIncrements.map(inc => (
              <Button
                key={`dec-${inc}`}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustValue(-inc)}
                className="h-8 px-3 text-xs font-medium"
              >
                <ChevronDown className="mr-1 h-3 w-3" />-{inc}
              </Button>
            ))}
            {quickIncrements.map(inc => (
              <Button
                key={`inc-${inc}`}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustValue(inc)}
                className="h-8 px-3 text-xs font-medium"
              >
                <ChevronUp className="mr-1 h-3 w-3" />+{inc}
              </Button>
            ))}
          </div>

          {name === 'buyPrice' && (
            <span className="absolute top-1/2 right-4 -translate-y-[120%] text-lg font-medium text-gray-500">
              R$
            </span>
          )}
        </div>
      </div>

      {error && (
        <p className="bg-bad text-on-bad rounded-lg p-2 text-center text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

/**
 * Campos do formulário de edição do ingrediente
 */
function EditFormFields({ watchedUnit }: { watchedUnit: UnitType }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<IngredientFormData>();
  const quantityConfig = getQuantityInputConfig(watchedUnit);

  return (
    <div className="flex w-full gap-4">
      {/* Nome */}
      <div className="flex w-full flex-col">
        <label htmlFor="name" className="text-primary block text-center text-base font-medium">
          Nome do ingrediente
        </label>
        <Input
          {...register('name')}
          id="name"
          placeholder="Digite o nome do ingrediente"
          className={clsx(
            'focus:border-inflow focus:ring-accent h-14 rounded-xl border-2 px-4 text-lg transition-all focus:ring-2',
            errors.name && 'border-on-critical focus:border-on-critical focus:ring-on-critical'
          )}
        />
        {errors.name && (
          <p className="text-on-critical rounded-lg bg-red-50 p-2 text-center text-sm font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Quantidade */}
      <NumericInputWithControls
        name="quantity"
        label="Quantidade"
        step={
          typeof quantityConfig.step === 'string'
            ? parseFloat(quantityConfig.step)
            : quantityConfig.step
        }
        min={quantityConfig.min}
        placeholder={quantityConfig.placeholder}
        error={errors.quantity?.message}
      />

      {/* Unidade */}
      <div className="flex w-full flex-col">
        <label htmlFor="unit" className="text-primary block text-center text-base font-medium">
          Unidade de medida
        </label>
        <select
          {...register('unit')}
          id="unit"
          className={clsx(
            'border-input bg-background h-14 w-full rounded-xl border-2 px-4 py-3 text-center text-lg font-medium',
            'focus:border-inflow focus:ring-accent transition-all focus:ring-2 focus:outline-none',
            'appearance-none bg-white',
            errors.unit && 'border-on-critical focus:border-on-critical focus:ring-on-critical'
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
          }}
        >
          <option value="kg">Quilograma (kg)</option>
          <option value="l">Litro (l)</option>
          <option value="un">Unidade (un)</option>
        </select>
        {errors.unit && (
          <p className="text-on-critical rounded-lg bg-red-50 p-2 text-center text-sm font-medium">
            {errors.unit.message}
          </p>
        )}
      </div>

      {/* Preço de compra */}
      <NumericInputWithControls
        name="buyPrice"
        label="Preço de compra"
        step={0.01}
        min={0}
        placeholder="0,00"
        error={errors.buyPrice?.message}
      />
    </div>
  );
}

/**
 * Componente principal do painel de edição de ingredientes
 */
export default function IngredientEditPanel() {
  const { state, dispatch } = useIngredientContext();
  const { isModalOpen, ingredientToEdit } = state;
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const methods = useForm<IngredientFormData>({
    resolver: zodResolver(
      ingredientSchema.superRefine((val, ctx) => {
        const quantityNum = parseFloat(val.quantity);
        if (!isNaN(quantityNum)) {
          const unitError = validateQuantityByUnit(quantityNum, val.unit);
          if (unitError) {
            ctx.addIssue({
              code: 'custom',
              message: unitError,
              path: ['quantity'],
            });
          }
        }
      })
    ),
    mode: 'onChange',
    defaultValues: { name: '', quantity: '', unit: 'kg', buyPrice: '' },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;
  const watchedUnit = watch('unit');

  useEffect(() => {
    if (isModalOpen && ingredientToEdit) {
      reset({
        name: ingredientToEdit.name,
        quantity: denormalizeQuantity(ingredientToEdit.quantity, ingredientToEdit.unit).toString(),
        unit: (['kg', 'l', 'un'] as const).includes(ingredientToEdit.unit as 'kg' | 'l' | 'un')
          ? (ingredientToEdit.unit as 'kg' | 'l' | 'un')
          : 'kg',
        buyPrice: ingredientToEdit.buyPrice?.toString() || '',
      });
    } else if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen, ingredientToEdit, reset]);

  if (!mounted) return null;

  const handleClose = () => dispatch({ type: 'CLOSE_EDIT_MODAL' });

  const onSubmit = (data: IngredientFormData) => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = data.buyPrice ? parseFloat(data.buyPrice) : 0;
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
    handleClose();

    toast({
      title: 'Ingrediente atualizado!',
      description: `"${data.name}" foi atualizado com sucesso.`,
      variant: 'accept',
    });
  };

  return (
    <Drawer open={isModalOpen} onOpenChange={handleClose}>
      <div className="mx-auto flex w-full max-w-[480px] flex-col">
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader className="px-6 pt-6 text-center">
            <DrawerTitle className="text-primary text-2xl font-bold">
              Editar Ingrediente
            </DrawerTitle>
            <DrawerDescription className="text-base text-gray-600">
              Atualize as informações do ingrediente
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <form
              id="ingredient-edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full justify-center"
            >
              <FormProvider {...methods}>
                <EditFormFields watchedUnit={watchedUnit} />
              </FormProvider>
            </form>
          </div>

          <DrawerFooter className="flex flex-row justify-center gap-3 border-t bg-gray-50 px-6 pt-4 pb-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex h-12 max-w-[150px] gap-1 rounded-xl text-base font-bold"
                  onClick={handleClose}
                >
                  <CircleX className="h-4 w-4" />
                  Cancelar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancelar edição</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  form="ingredient-edit-form"
                  variant="accept"
                  className="flex h-12 max-w-[150px] gap-1 rounded-xl text-base font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <CheckCheck className="h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Salvar alterações</p>
              </TooltipContent>
            </Tooltip>
          </DrawerFooter>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
