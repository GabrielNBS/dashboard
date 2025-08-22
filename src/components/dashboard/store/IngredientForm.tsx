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
} from '@/schemas/validationSchemas';

import { v4 as uuidv4 } from 'uuid';
import { getQuantityInputConfig } from '@/utils/quantityInputConfig';
import { useState } from 'react';
import { CheckCheck, Plus } from 'lucide-react';

// componentes shadcn
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function IngredientForm() {
  const { dispatch } = useIngredientContext();
  const { toast } = useToast();
  const [toggle, setToggle] = useState(false);

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
      maxQuantity: normalizeQuantity(10, data.unit), // Exemplo: limite padrão de 100 unidades na unidade base
    };

    handleAddIngredient(newIngredient);
    reset();

    toast({
      title: 'Ingrediente adicionado',
      description: `"${data.name}" cadastrado com sucesso.`,
      variant: 'accept',
    });
  };

  const handleUnitChange = (newUnit: string) => {
    setValue('unit', newUnit as UnitType);

    if (watchedQuantity) {
      validateQuantity(watchedQuantity);
    }
  };

  return (
    <>
      <Sheet open={toggle} onOpenChange={setToggle}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            className="fixed right-15 bottom-4 z-10"
            type="button"
            aria-label={toggle ? 'Fechar formulário' : 'Abrir formulário de ingrediente'}
            size="xl"
            tooltip={{ tooltipContent: 'Adicionar novo ingrediente' }}
          >
            <Plus className="mr-1" />
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="mb-6 flex flex-col items-center">
            <SheetTitle className="text-lg">Adicionar novo ingrediente</SheetTitle>
            <SheetDescription>
              Preencha os campos abaixo para registrar um novo ingrediente
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Nome do ingrediente
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: Farinha de trigo"
                  {...register('name')}
                  id="name"
                  aria-invalid={!!errors.name}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <span className="text-destructive mt-1 block text-sm">{errors.name.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="unit" className="mb-2 block">
                  Unidade de medida
                </Label>
                <Select onValueChange={handleUnitChange} value={watchedUnit}>
                  <SelectTrigger aria-invalid={!!errors.unit}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilo (kg)</SelectItem>
                    <SelectItem value="l">Litro (l)</SelectItem>
                    <SelectItem value="un">Unidade</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <span className="text-destructive mt-1 block text-sm">{errors.unit.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="quantity" className="mb-2 block">
                  Quantidade
                </Label>
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
                      className={errors.quantity ? 'border-destructive' : ''}
                    />
                  );
                })()}
                {errors.quantity && (
                  <span className="text-destructive mt-1 block text-sm">
                    {errors.quantity.message}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="buyPrice" className="mb-2 block">
                  Preço de compra (R$)
                </Label>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="Ex: R$5,99"
                  {...register('buyPrice')}
                  id="buyPrice"
                  min="0"
                  aria-invalid={!!errors.buyPrice}
                  className={errors.buyPrice ? 'border-destructive' : ''}
                />
                {errors.buyPrice && (
                  <span className="text-destructive mt-1 block text-sm">
                    {errors.buyPrice.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setToggle(false)}>
                Cancelar
              </Button>
              <Button variant="accept" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Adicionando...'
                ) : (
                  <p className="flex h-12 items-center gap-1 rounded-xl text-base font-bold">
                    {' '}
                    <CheckCheck />
                    Adicionar ingrediente
                  </p>
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
