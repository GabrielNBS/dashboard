'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { CheckCheck, Plus, Package, Loader2, PackagePlus, AlertCircle } from 'lucide-react';

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

/* ===========================================================
   UTILITÁRIOS
=========================================================== */

const sanitizeInput = (value: string): string =>
  value
    .replace(/[<>]/g, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const normalizeForComparison = (value: string): string => sanitizeInput(value.toLowerCase());

/* ===========================================================
   COMPONENTES INTERNOS (mantidos)
=========================================================== */

const ExistingStockInfo = ({ ingredient }: { ingredient: Ingredient }) => (
  <div className="border-primary/20 bg-primary/5 hover:border-primary/30 mb-4 rounded-lg border p-4 transition-all duration-200">
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 rounded-full p-2">
        <Package className="text-primary h-4 w-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-on-info mb-2 font-semibold">Reabastecimento detectado</h4>
        <div className="text-on-info/80 space-y-1 text-sm">
          <p className="flex justify-between">
            <span>Estoque atual:</span>
            <span className="font-medium">
              {ingredient.totalQuantity} {ingredient.unit}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Preço médio atual:</span>
            <span className="font-medium">{formatCurrency(ingredient.averageUnitPrice)}</span>
          </p>
          <p className="flex justify-between">
            <span>Lotes ativos:</span>
            <span className="font-medium">{ingredient.batches.length}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

const PricePreview = ({
  currentPrice,
  newUnitPrice,
  newAveragePrice,
  combinedQuantity,
  unit,
}: {
  currentPrice: number;
  newUnitPrice: number;
  newAveragePrice: number;
  combinedQuantity: number;
  unit: string;
}) => {
  const priceChange = newAveragePrice - currentPrice;
  const percentChange = (priceChange / currentPrice) * 100;
  const isIncrease = priceChange > 0;

  return (
    <div className="bg-muted hover:border-border rounded-lg border p-4 transition-all duration-200">
      <div className="mb-3 flex items-center gap-2">
        <AlertCircle className="text-muted-foreground h-4 w-4" />
        <h4 className="text-foreground font-semibold">Preview do novo preço médio</h4>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Preço atual:</span>
          <span className="font-mono">{formatCurrency(currentPrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Preço do novo lote:</span>
          <span className="font-mono">{formatCurrency(newUnitPrice)}</span>
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>Novo preço médio:</span>
            <span className="font-mono">{formatCurrency(newAveragePrice)}</span>
          </div>
          <div
            className={`mt-1 text-right text-xs ${isIncrease ? 'text-destructive' : 'text-green-600'}`}
          >
            {isIncrease ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
          </div>
        </div>

        <div className="flex justify-between border-t pt-2 text-sm">
          <span className="text-muted-foreground">Quantidade total:</span>
          <span className="font-medium">
            {combinedQuantity} {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ===========================================================
   COMPONENTE PRINCIPAL (AJUSTADO)
=========================================================== */

export default function IngredientForm() {
  const { dispatch, state, addBatch } = useIngredientContext();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* ------------------------------
     FORM
  ------------------------------ */

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      quantity: '',
      unit: 'kg',
      buyPrice: '',
    },
  });

  const [name, unit, quantity, buyPrice] = watch(['name', 'unit', 'quantity', 'buyPrice']);

  /* ------------------------------
     EXISTING INGREDIENT
  ------------------------------ */

  const existingIngredient = useMemo(() => {
    if (!name) return null;
    const normalizedName = normalizeForComparison(name);
    return state.ingredients.find(ing => normalizeForComparison(ing.name) === normalizedName);
  }, [name, state.ingredients]);

  /* ------------------------------
     PRICE PREVIEW
  ------------------------------ */

  const pricePreview = useMemo(() => {
    if (!existingIngredient || !quantity || !buyPrice) return null;

    const newQuantity = normalizeQuantity(parseFloat(quantity), unit);
    const newPrice = parseFloat(buyPrice);

    if (newQuantity <= 0 || newPrice <= 0) return null;

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
  }, [existingIngredient, quantity, buyPrice, unit]);

  /* ------------------------------
     MOUNT GUARD SAFE PORTAL
  ------------------------------ */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ------------------------------
     CREATE NEW INGREDIENT
  ------------------------------ */

  const createNewIngredient = useCallback((data: IngredientFormData): Ingredient => {
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
  }, []);

  /* ------------------------------
     ADD BATCH TO EXISTING INGREDIENT
  ------------------------------ */

  const handleAddBatchToExisting = useCallback(
    (data: IngredientFormData, ingredient: Ingredient) => {
      if (ingredient.unit !== data.unit) {
        toast({
          title: 'Unidade incompatível',
          description: `O ingrediente "${ingredient.name}" já está cadastrado como "${ingredient.unit}". Use a mesma unidade.`,
          variant: 'destructive',
        });
        return false;
      }

      const rawQuantity = parseFloat(data.quantity);
      const rawPrice = parseFloat(data.buyPrice);

      const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);

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
        description: `Novo lote de "${ingredient.name}" foi registrado.`,
        variant: 'accept',
      });

      return true;
    },
    [addBatch, toast]
  );

  /* ------------------------------
     FORM SUBMIT
  ------------------------------ */

  const onSubmit = useCallback(
    async (data: IngredientFormData) => {
      try {
        if (existingIngredient) {
          const success = handleAddBatchToExisting(data, existingIngredient);
          if (!success) return;
        } else {
          const newIngredient = createNewIngredient(data);
          dispatch({ type: 'ADD_INGREDIENT', payload: newIngredient });

          toast({
            title: 'Ingrediente cadastrado',
            description: `"${data.name}" foi adicionado com sucesso.`,
            variant: 'accept',
          });
        }

        reset();
        setIsOpen(false);
      } catch (error) {
        console.error('Erro ao salvar:', error);
        toast({
          title: 'Erro ao salvar',
          description: 'Algo deu errado ao salvar o ingrediente.',
          variant: 'destructive',
        });
      }
    },
    [existingIngredient, handleAddBatchToExisting, createNewIngredient, dispatch, toast, reset]
  );

  /* ------------------------------
     CANCEL / CLOSE HANDLER SEGURO
     (não mexe no onOpenChange interno)
  ------------------------------ */

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Tem certeza que deseja fechar? As informações não salvas serão perdidas.'
      );
      if (!confirmed) return;
    }
    reset();
    setIsOpen(false);
  }, [isDirty, reset]);

  /* ------------------------------
     onOpenChange FINAL
     - Não executa window.confirm direto
     - Respeita o estado interno do Sheet
  ------------------------------ */

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open && isDirty) {
        const confirmed = window.confirm(
          'Tem certeza que deseja fechar? As informações não salvas serão perdidas.'
        );

        if (!confirmed) {
          // Força o modal permanecer aberto
          setIsOpen(true);
          return;
        }
      }

      setIsOpen(open);

      if (!open) {
        reset();
      }
    },
    [isDirty, reset]
  );

  /* ===========================================================
     RENDER
  =========================================================== */

  if (!mounted) return null;

  return (
    <>
      {createPortal(
        <>
          {/* BOTÃO FIXO */}
          <Button
            className="fixed right-4 bottom-4 z-50 shadow-lg transition-all duration-200 hover:scale-105 sm:right-6 sm:bottom-6"
            type="button"
            onClick={() => setIsOpen(true)}
            size="md"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Adicionar ingrediente</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>

          {/* MODAL SHEET */}
          <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
            <SheetContent className="flex max-h-screen flex-col overflow-hidden sm:max-w-2xl">
              <SheetHeader className="mb-4 flex-shrink-0">
                <SheetTitle className="flex items-center gap-2">
                  {existingIngredient ? (
                    <Package className="h-5 w-5" />
                  ) : (
                    <PackagePlus className="h-5 w-5" />
                  )}
                  {existingIngredient ? 'Reabastecer ingrediente' : 'Novo ingrediente'}
                </SheetTitle>

                <SheetDescription>
                  {existingIngredient
                    ? `Adicionar novo lote ao ingrediente "${existingIngredient.name}"`
                    : 'Cadastre um novo ingrediente no sistema'}
                </SheetDescription>
              </SheetHeader>

              <div className="-mr-2 flex-1 overflow-y-auto pr-2">
                {existingIngredient && <ExistingStockInfo ingredient={existingIngredient} />}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Nome + Unidade */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do ingrediente</Label>
                      <Input
                        type="text"
                        placeholder="Ex: Farinha de trigo"
                        {...register('name')}
                        id="name"
                        autoComplete="off"
                        disabled={!!existingIngredient}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-destructive flex items-center gap-1 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unidade de medida</Label>
                      <UnitSelect
                        register={register}
                        errors={errors}
                        disabled={!!existingIngredient}
                      />
                      {errors.unit && (
                        <p className="text-destructive flex items-center gap-1 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.unit.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantidade + Preço */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade{existingIngredient && ' do lote'}</Label>

                      <QuantityInputField
                        placeholder={`Ex: 1 ${unit}`}
                        id="quantity"
                        unit={unit}
                        value={quantity}
                        allowDecimals={UNIT_LIMITS[unit]?.decimals > 0}
                        maxValue={UNIT_LIMITS[unit]?.max}
                        minValue={UNIT_LIMITS[unit]?.min}
                        onChange={v => setValue('quantity', v, { shouldValidate: true })}
                        className={errors.quantity ? 'border-destructive' : ''}
                      />

                      {errors.quantity && (
                        <p className="text-destructive flex items-center gap-1 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buyPrice">
                        Preço de compra{existingIngredient && ' do lote'}
                      </Label>

                      <CurrencyInputField
                        id="buyPrice"
                        value={buyPrice}
                        placeholder="R$ 0,00"
                        maxValue={CURRENCY_LIMITS.ingredient.max}
                        minValue={CURRENCY_LIMITS.ingredient.min}
                        onChange={v => setValue('buyPrice', v, { shouldValidate: true })}
                        className={errors.buyPrice ? 'border-destructive' : ''}
                      />

                      {errors.buyPrice && (
                        <p className="text-destructive flex items-center gap-1 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.buyPrice.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PREVIEW DE PREÇO */}
                  {pricePreview && existingIngredient && (
                    <PricePreview
                      currentPrice={existingIngredient.averageUnitPrice}
                      newUnitPrice={pricePreview.newUnitPrice}
                      newAveragePrice={pricePreview.newAveragePrice}
                      combinedQuantity={pricePreview.combinedQuantity}
                      unit={unit}
                    />
                  )}

                  {/* BOTÕES */}
                  <div className="flex justify-end gap-3 border-t pt-4">
                    <Button variant="outline" type="button" onClick={handleCancel}>
                      Cancelar
                    </Button>

                    <Button
                      variant="accept"
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Salvando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {existingIngredient ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <CheckCheck className="h-4 w-4" />
                          )}
                          {existingIngredient ? 'Reabastecer' : 'Adicionar'}
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </>,
        document.body
      )}
    </>
  );
}
