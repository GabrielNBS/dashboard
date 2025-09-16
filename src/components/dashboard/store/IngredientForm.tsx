'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/base/Button';
import Input from '@/components/ui/base/Input';
import { Ingredient, UnitType, PurchaseBatch } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

import { useToast } from '@/components/ui/feedback/use-toast';
import {
  ingredientSchema,
  type IngredientFormData,
  validateQuantityByUnit,
} from '@/schemas/validationSchemas';

import { v4 as uuidv4 } from 'uuid';

import { useState } from 'react';
import { CheckCheck, Plus, Package } from 'lucide-react';

// componentes shadcn
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/feedback/sheet';
import { Label } from '@/components/ui/base/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { normalizeQuantity } from '@/utils/helpers/normalizeQuantity';
import { getQuantityInputConfig } from '@/utils/helpers/quantityInputConfig';

export default function IngredientForm() {
  const { dispatch, state, addBatch } = useIngredientContext();
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
  const watchedName = watch('name');

  // Verifica se existe ingrediente com mesmo nome
  const existingIngredient = state.ingredients.find(
    ing => ing.name.toLowerCase().trim() === watchedName.toLowerCase().trim()
  );

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

  const createNewIngredient = (data: IngredientFormData): Ingredient => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = parseFloat(data.buyPrice);
    const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);
    const unitPrice = rawPrice / normalizedQuantity;

    const batch: PurchaseBatch = {
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      purchaseDate: new Date(),
      buyPrice: rawPrice,
      originalQuantity: normalizedQuantity,
      currentQuantity: normalizedQuantity,
      unitPrice,
    };

    return {
      id: uuidv4(),
      name: data.name.trim(),
      unit: data.unit,
      totalQuantity: normalizedQuantity,
      averageUnitPrice: unitPrice,
      batches: [batch],
      maxQuantity: normalizeQuantity(10, data.unit),
    };
  };

  const handleAddBatchToExisting = (data: IngredientFormData, ingredient: Ingredient) => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = parseFloat(data.buyPrice);
    const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);

    // Verifica se a unidade é compatível
    if (ingredient.unit !== data.unit) {
      toast({
        title: 'Erro de unidade',
        description: `O ingrediente "${ingredient.name}" já existe com a unidade "${ingredient.unit}". Use a mesma unidade.`,
        variant: 'destructive',
      });
      return;
    }

    const newBatch = {
      purchaseDate: new Date(),
      buyPrice: rawPrice,
      originalQuantity: normalizedQuantity,
      currentQuantity: normalizedQuantity,
      unitPrice: rawPrice / normalizedQuantity,
    };

    addBatch(ingredient.id, newBatch);

    toast({
      title: 'Lote adicionado',
      description: `Novo lote de "${ingredient.name}" adicionado ao estoque.`,
      variant: 'accept',
    });
  };

  const onSubmit = (data: IngredientFormData) => {
    const rawQuantity = parseFloat(data.quantity);

    const unitValidationError = validateQuantityByUnit(rawQuantity, data.unit);
    if (unitValidationError) {
      toast({
        title: 'Erro de validação',
        description: unitValidationError,
        variant: 'destructive',
      });
      return;
    }

    // Verifica se é reabastecimento ou novo ingrediente
    if (existingIngredient) {
      handleAddBatchToExisting(data, existingIngredient);
    } else {
      const newIngredient = createNewIngredient(data);
      dispatch({ type: 'ADD_INGREDIENT', payload: newIngredient });

      toast({
        title: 'Ingrediente criado',
        description: `"${data.name}" cadastrado com sucesso.`,
        variant: 'accept',
      });
    }

    reset();
    setToggle(false);
    setSelectedExistingIngredient(null);
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
            size="md"
          >
            <Plus className="mr-1" />
            Adicionar ingrediente
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="mb-6 flex flex-col items-center">
            <SheetTitle className="flex items-center gap-2 text-lg">
              {existingIngredient ? <Package className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {existingIngredient ? 'Reabastecer ingrediente' : 'Adicionar novo ingrediente'}
            </SheetTitle>
            <SheetDescription>
              {existingIngredient
                ? `Adicionar novo lote ao ingrediente "${existingIngredient.name}"`
                : 'Preencha os campos abaixo para registrar um novo ingrediente'}
            </SheetDescription>
          </SheetHeader>

          {/* Aviso de reabastecimento */}
          {existingIngredient && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <h4 className="mb-1 font-medium text-blue-800">Reabastecimento detectado</h4>
              <p className="text-sm text-blue-600">
                Estoque atual: {existingIngredient.totalQuantity} {existingIngredient.unit}
              </p>
              <p className="text-sm text-blue-600">
                Preço médio atual: R$ {existingIngredient.averageUnitPrice.toFixed(3)}
              </p>
              <p className="text-sm text-blue-600">
                Batches ativos: {existingIngredient.batches.length}
              </p>
            </div>
          )}

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
                  disabled={!!existingIngredient}
                />
                {errors.name && (
                  <span className="text-destructive mt-1 block text-sm">{errors.name.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="unit" className="mb-2 block">
                  Unidade de medida
                </Label>
                <Select
                  onValueChange={handleUnitChange}
                  value={watchedUnit}
                  disabled={!!existingIngredient}
                >
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
                  Quantidade {existingIngredient ? 'do novo lote' : ''}
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
                  Preço de compra {existingIngredient ? 'do novo lote' : ''} (R$)
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

            {/* Preview do novo preço médio para reabastecimento */}
            {existingIngredient && watchedQuantity && watch('buyPrice') && (
              <div className="rounded-lg border bg-gray-50 p-3">
                <h4 className="mb-2 font-medium text-gray-800">Preview do novo preço médio</h4>
                {(() => {
                  const newQuantity = normalizeQuantity(parseFloat(watchedQuantity), watchedUnit);
                  const newPrice = parseFloat(watch('buyPrice'));
                  const newUnitPrice = newPrice / newQuantity;

                  // Calcular novo preço médio ponderado
                  const currentTotalValue =
                    existingIngredient.totalQuantity * existingIngredient.averageUnitPrice;
                  const newTotalValue = newQuantity * newUnitPrice;
                  const combinedValue = currentTotalValue + newTotalValue;
                  const combinedQuantity = existingIngredient.totalQuantity + newQuantity;
                  const newAveragePrice = combinedValue / combinedQuantity;

                  return (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Preço atual: R$ {existingIngredient.averageUnitPrice.toFixed(3)}</p>
                      <p>Preço do novo lote: R$ {newUnitPrice.toFixed(3)}</p>
                      <p className="font-medium">
                        Novo preço médio: R$ {newAveragePrice.toFixed(3)}
                      </p>
                      <p>
                        Quantidade total: {combinedQuantity} {watchedUnit}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setToggle(false)}>
                Cancelar
              </Button>
              <Button className="p-4" variant="accept" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Adicionando...'
                ) : (
                  <p className="flex items-center gap-2">
                    {existingIngredient ? <Package /> : <CheckCheck />}
                    {existingIngredient ? 'Reabastecer' : 'Adicionar'}
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
