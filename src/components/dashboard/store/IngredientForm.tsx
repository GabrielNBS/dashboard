'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { CheckCheck, Plus, Package, Loader2 } from 'lucide-react';

import Button from '@/components/ui/base/Button';
import Input from '@/components/ui/base/Input';
import { Label } from '@/components/ui/base/label';
import CurrencyInputField from '@/components/ui/forms/CurrencyInputField';
import QuantityInputField from '@/components/ui/forms/QuantityInputField';
import UnitSelect from '@/components/ui/UnitSelect';
import { useToast } from '@/components/ui/feedback/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/feedback/sheet';

import { Ingredient, PurchaseBatch } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import {
  ingredientSchema,
  type IngredientFormData,
  UNIT_LIMITS,
  CURRENCY_LIMITS,
} from '@/schemas/validationSchemas';
import { normalizeQuantity } from '@/utils/helpers/normalizeQuantity';
import { formatCurrency } from '@/utils/UnifiedUtils';

const sanitizeInput = (value: string) =>
  value
    .replace(/[<>]/g, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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
    defaultValues: { name: '', quantity: '', unit: 'kg', buyPrice: '' },
  });

  const watchedUnit = watch('unit');
  const watchedQuantity = watch('quantity');
  const watchedName = watch('name');
  const watchedPrice = watch('buyPrice');

  const normalizedName = sanitizeInput(watchedName.toLowerCase());
  const existingIngredient = state.ingredients.find(
    ing => sanitizeInput(ing.name.toLowerCase()) === normalizedName
  );

  useEffect(() => {
    if (toggle) {
      setTimeout(() => document.getElementById('name')?.focus(), 200);
    }
  }, [toggle]);

  // Validação agora é feita apenas pelo schema via zodResolver
  // Removida validação manual duplicada

  const pricePreview = useMemo(() => {
    if (!existingIngredient || !watchedQuantity || !watchedPrice) return null;

    const newQuantity = normalizeQuantity(parseFloat(watchedQuantity), watchedUnit);
    const newPrice = parseFloat(watchedPrice);
    const newUnitPrice = newPrice / newQuantity;

    const currentTotalValue =
      existingIngredient.totalQuantity * existingIngredient.averageUnitPrice;
    const newTotalValue = newQuantity * newUnitPrice;
    const combinedValue = currentTotalValue + newTotalValue;
    const combinedQuantity = existingIngredient.totalQuantity + newQuantity;
    const newAveragePrice = combinedValue / combinedQuantity;

    return {
      newUnitPrice,
      newAveragePrice,
      combinedQuantity,
    };
  }, [existingIngredient, watchedQuantity, watchedPrice, watchedUnit]);

  const createNewIngredient = (data: IngredientFormData): Ingredient => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = parseFloat(data.buyPrice);
    const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);
    const unitPrice = data.unit === 'un' ? rawPrice : rawPrice / normalizedQuantity;

    const batch: PurchaseBatch = {
      id: uuidv4(),
      purchaseDate: new Date(),
      buyPrice: rawPrice,
      originalQuantity: normalizedQuantity,
      currentQuantity: normalizedQuantity,
      unitPrice,
    };

    return {
      id: uuidv4(),
      name: sanitizeInput(data.name),
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

    if (ingredient.unit !== data.unit) {
      toast({
        title: 'Unidade incompatível',
        description: `O ingrediente "${ingredient.name}" já está cadastrado como "${ingredient.unit}". Use a mesma unidade.`,
        variant: 'destructive',
      });
      return;
    }

    const newBatch: PurchaseBatch = {
      id: uuidv4(),
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
    // Todas as validações são feitas pelo schema via zodResolver
    // Não há necessidade de validações manuais adicionais

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
  };

  const handleCancel = () => {
    const hasChanges = Object.values(watch()).some(Boolean);
    if (hasChanges && !confirm('Tem certeza que deseja cancelar? As informações serão perdidas.')) {
      return;
    }
    reset();
    setToggle(false);
  };

  return (
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

      <SheetContent className="max-w-3xl overflow-y-auto">
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

        {existingIngredient && (
          <div className="border-primary/20 bg-primary/5 mb-4 rounded-lg border p-3">
            <h4 className="text-on-info mb-1 font-medium">Reabastecimento detectado</h4>
            <p className="text-on-info/80 text-sm">
              Estoque atual: {existingIngredient.totalQuantity} {existingIngredient.unit}
            </p>
            <p className="text-on-info/80 text-sm">
              Preço médio atual: {formatCurrency(existingIngredient.averageUnitPrice)}
            </p>
            <p className="text-on-info/80 text-sm">
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
                aria-describedby="error-name"
                className={errors.name ? 'border-destructive' : ''}
                disabled={!!existingIngredient}
              />
              {errors.name && (
                <span id="error-name" className="text-destructive mt-1 block text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="unit" className="mb-2 block">
                Unidade de medida
              </Label>
              <UnitSelect register={register} errors={errors} />
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
              <QuantityInputField
                placeholder={`Ex: 1 ${watchedUnit}`}
                id="quantity"
                className={errors.quantity ? 'border-destructive' : ''}
                unit={watchedUnit}
                allowDecimals={UNIT_LIMITS[watchedUnit]?.decimals > 0}
                maxValue={UNIT_LIMITS[watchedUnit]?.max ?? 1000}
                minValue={UNIT_LIMITS[watchedUnit]?.min ?? 0}
                value={watchedQuantity}
                onChange={(value: string) => setValue('quantity', value)}
              />
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
              <CurrencyInputField
                placeholder="R$ 0,00"
                id="buyPrice"
                aria-invalid={!!errors.buyPrice}
                aria-describedby="error-buyPrice"
                className={errors.buyPrice ? 'border-destructive' : ''}
                maxValue={CURRENCY_LIMITS.ingredient.max}
                minValue={CURRENCY_LIMITS.ingredient.min}
                value={watchedPrice}
                onChange={(value: string) => setValue('buyPrice', value)}
              />
              {errors.buyPrice && (
                <span id="error-buyPrice" className="text-destructive mt-1 block text-sm">
                  {errors.buyPrice.message}
                </span>
              )}
            </div>
          </div>

          {pricePreview && existingIngredient && (
            <div className="bg-muted rounded-lg border p-3">
              <h4 className="text-foreground mb-2 font-medium">Preview do novo preço médio</h4>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>Preço atual: R$ {existingIngredient.averageUnitPrice.toFixed(3)}</p>
                <p>Preço do novo lote: R$ {pricePreview.newUnitPrice.toFixed(3)}</p>
                <p className="font-medium">
                  Novo preço médio: R$ {pricePreview.newAveragePrice.toFixed(3)}
                </p>
                <p>
                  Quantidade total: {pricePreview.combinedQuantity} {watchedUnit}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button className="p-4" variant="accept" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </div>
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
  );
}
