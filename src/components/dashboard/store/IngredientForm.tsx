'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { CheckCheck, Plus, Package, Loader2, PackagePlus, AlertCircle, Pencil } from 'lucide-react';

import Button from '@/components/ui/base/Button';
import Input from '@/components/ui/base/Input';
import { Label } from '@/components/ui/base/label';
import CurrencyInputField from '@/components/ui/forms/CurrencyInputField';
import QuantityInputField from '@/components/ui/forms/QuantityInputField';
import UnitSelect from '@/components/ui/UnitSelect';
import { useToast } from '@/components/ui/feedback/use-toast';
import LordIcon from '@/components/ui/LordIcon';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/feedback/sheet';

import { Ingredient, PurchaseBatch, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

import {
  ingredientSchema,
  type IngredientFormData,
  UNIT_LIMITS,
  CURRENCY_LIMITS,
} from '@/schemas/validationSchemas';

import { normalizeQuantity, denormalizeQuantity } from '@/utils/helpers/normalizeQuantity';
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
  <div className="bg-great/50 mb-4 rounded-lg p-4 shadow-md transition-all duration-200">
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 rounded-full p-2">
        <LordIcon
          src="https://cdn.lordicon.com/uomkwtjh.json"
          width={16}
          height={16}
          isActive={true}
          colors={{
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--primary))',
          }}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-primary mb-2 font-bold">Reabastecimento detectado</h4>
        <ul className="text-primary space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Estoque atual:</span>
            <span className="font-medium">
              {ingredient.totalQuantity} {ingredient.unit}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Preço médio atual:</span>
            <span className="font-medium">{formatCurrency(ingredient.averageUnitPrice)}</span>
          </li>
          <li className="flex justify-between">
            <span>Lotes ativos:</span>
            <span className="font-medium">{ingredient.batches.length}</span>
          </li>
        </ul>
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
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [isWeightConversionEnabled, setIsWeightConversionEnabled] = useState(false);

  // Determina se estamos em modo de edição baseado no contexto
  const isEditMode = state.isModalOpen && !!state.ingredientToEdit;
  const isOpen = localIsOpen || state.isModalOpen;

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
      unit: 'un',
      buyPrice: '',
      minQuantity: '',
      maxQuantity: '',
      weightPerUnit: '',
      weightUnit: 'g',
    },
  });

  const [name, unit, quantity, buyPrice, weightPerUnit, weightUnit] = watch([
    'name',
    'unit',
    'quantity',
    'buyPrice',
    'weightPerUnit',
    'weightUnit',
  ]);

  useEffect(() => {
    if (isEditMode && state.ingredientToEdit) {
      const ing = state.ingredientToEdit;
      reset({
        name: ing.name,
        quantity: denormalizeQuantity(ing.totalQuantity, ing.unit).toString(),
        unit: ing.unit as UnitType,
        buyPrice: ing.averageUnitPrice?.toString() || '',
        minQuantity: ing.minQuantity
          ? denormalizeQuantity(ing.minQuantity, ing.unit).toString()
          : '',
        maxQuantity: ing.maxQuantity
          ? denormalizeQuantity(ing.maxQuantity, ing.unit).toString()
          : '',
        weightPerUnit: ing.weightPerUnit?.toString() || '',
        weightUnit: ing.weightUnit || 'g',
      });
      setIsWeightConversionEnabled(!!ing.weightPerUnit);
    } else if (!isOpen) {
      reset({
        name: '',
        quantity: '',
        unit: 'un',
        buyPrice: '',
        minQuantity: '',
        maxQuantity: '',
        weightPerUnit: '',
        weightUnit: 'g',
      });
      setIsWeightConversionEnabled(false);
    }
  }, [isEditMode, state.ingredientToEdit, isOpen, reset]);

  /*
   * REMOVED DUPLICATE USEEFFECT
   * The logic was merged into the main reset effect above to ensure
   * atomic updates and avoid race conditions.
   */

  const existingIngredient = useMemo(() => {
    if (isEditMode || !name) return null;
    const normalizedName = normalizeForComparison(name);
    return state.ingredients.find(ing => normalizeForComparison(ing.name) === normalizedName);
  }, [name, state.ingredients, isEditMode]);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const createNewIngredient = useCallback(
    (data: IngredientFormData): Ingredient => {
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
        maxQuantity: data.maxQuantity
          ? normalizeQuantity(parseFloat(data.maxQuantity), data.unit)
          : normalizeQuantity(10, data.unit),
        minQuantity: data.minQuantity
          ? normalizeQuantity(parseFloat(data.minQuantity), data.unit)
          : 0,
        weightPerUnit:
          data.weightPerUnit && !isNaN(parseFloat(data.weightPerUnit)) && isWeightConversionEnabled
            ? parseFloat(data.weightPerUnit)
            : undefined,
        weightUnit:
          data.weightPerUnit && isWeightConversionEnabled
            ? (data.weightUnit as UnitType)
            : undefined,
      };
    },
    [isWeightConversionEnabled]
  );

  const handleAddBatchToExisting = useCallback(
    (data: IngredientFormData, ingredient: Ingredient) => {
      if (ingredient.unit !== data.unit) {
        toast({
          title: 'Unidade incompatível',
          description: `O ingrediente "${ingredient.name}" já está cadastrado como "${ingredient.unit}". Use a mesma unidade.`,
          type: 'error',
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
        type: 'success',
      });

      return true;
    },
    [addBatch, toast]
  );

  const handleEditIngredient = useCallback(
    (data: IngredientFormData) => {
      if (!state.ingredientToEdit) return;

      const rawQuantity = parseFloat(data.quantity);
      const rawPrice = data.buyPrice ? parseFloat(data.buyPrice) : 0;
      const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);

      const updatedIngredient: Ingredient = {
        ...state.ingredientToEdit,
        name: data.name.trim(),
        totalQuantity: normalizedQuantity,
        unit: data.unit,
        averageUnitPrice: rawPrice,
        minQuantity: data.minQuantity
          ? normalizeQuantity(parseFloat(data.minQuantity), data.unit)
          : 0,
        maxQuantity: data.maxQuantity
          ? normalizeQuantity(parseFloat(data.maxQuantity), data.unit)
          : normalizeQuantity(10, data.unit),
        weightPerUnit:
          data.weightPerUnit && !isNaN(parseFloat(data.weightPerUnit)) && isWeightConversionEnabled
            ? parseFloat(data.weightPerUnit)
            : undefined,
        weightUnit:
          data.weightPerUnit && isWeightConversionEnabled
            ? (data.weightUnit as UnitType)
            : undefined,
      };

      dispatch({ type: 'EDIT_INGREDIENT', payload: updatedIngredient });

      toast({
        title: 'Ingrediente atualizado!',
        description: `"${data.name}" foi atualizado com sucesso.`,
        type: 'success',
      });
    },
    [state.ingredientToEdit, dispatch, toast, isWeightConversionEnabled]
  );

  const onSubmit = useCallback(
    async (data: IngredientFormData) => {
      try {
        if (isEditMode) {
          handleEditIngredient(data);
        } else if (existingIngredient) {
          const success = handleAddBatchToExisting(data, existingIngredient);
          if (!success) return;
        } else {
          const newIngredient = createNewIngredient(data);
          dispatch({ type: 'ADD_INGREDIENT', payload: newIngredient });

          toast({
            title: 'Ingrediente cadastrado',
            description: `"${data.name}" foi adicionado com sucesso.`,
            type: 'success',
          });
        }

        // Fecha o modal apropriado
        if (state.isModalOpen) {
          dispatch({ type: 'CLOSE_EDIT_MODAL' });
        }
        setLocalIsOpen(false);
        reset();
      } catch (error) {
        console.error('Erro ao salvar:', error);
        toast({
          title: 'Erro ao salvar',
          description: 'Algo deu errado ao salvar o ingrediente.',
          type: 'error',
        });
      }
    },
    [
      isEditMode,
      existingIngredient,
      handleEditIngredient,
      handleAddBatchToExisting,
      createNewIngredient,
      dispatch,
      toast,
      reset,
      state.isModalOpen,
    ]
  );

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Tem certeza que deseja fechar? As informações não salvas serão perdidas.'
      );
      if (!confirmed) return;
    }

    if (state.isModalOpen) {
      dispatch({ type: 'CLOSE_EDIT_MODAL' });
    }
    setLocalIsOpen(false);
    reset();
  }, [isDirty, reset, state.isModalOpen, dispatch]);

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open && isDirty) {
        const confirmed = window.confirm(
          'Tem certeza que deseja fechar? As informações não salvas serão perdidas.'
        );

        if (!confirmed) {
          if (!state.isModalOpen) setLocalIsOpen(true);
          return;
        }
      }

      if (!open) {
        if (state.isModalOpen) {
          dispatch({ type: 'CLOSE_EDIT_MODAL' });
        }
        setLocalIsOpen(false);
        reset();
      } else {
        setLocalIsOpen(true);
      }
    },
    [isDirty, reset, state.isModalOpen, dispatch]
  );

  if (!mounted) return null;

  return (
    <>
      {createPortal(
        <>
          {/* BOTÃO FIXO (Apenas mostra se não estiver em modo de edição) */}
          {!isEditMode && (
            <Button
              className="fixed right-4 bottom-4 z-20 shadow-lg transition-all duration-200 hover:scale-105 sm:right-6 sm:bottom-6"
              type="button"
              onClick={() => setLocalIsOpen(true)}
              size="md"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Adicionar ingrediente</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          )}

          {createPortal(
            <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
              <SheetContent
                className="max-w-3xl overflow-hidden p-0"
                aria-labelledby="ingredient-form-title"
                aria-describedby="ingredient-form-description"
              >
                <SheetHeader className="border-border mb-6 shrink-0 border-b p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      {isEditMode ? (
                        <Pencil className="text-primary h-5 w-5" />
                      ) : existingIngredient ? (
                        <Package className="text-primary h-5 w-5" />
                      ) : (
                        <PackagePlus className="text-primary h-5 w-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <SheetTitle className="text-foreground text-lg font-semibold">
                        {isEditMode
                          ? 'Editar Ingrediente'
                          : existingIngredient
                            ? 'Reabastecer ingrediente'
                            : 'Novo ingrediente'}
                      </SheetTitle>

                      <SheetDescription className="text-muted-foreground text-sm">
                        {isEditMode
                          ? 'Atualize as informações do ingrediente'
                          : existingIngredient
                            ? `Adicionar novo lote ao ingrediente "${existingIngredient.name}"`
                            : 'Cadastre um novo ingrediente no sistema'}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="-mr-2 flex-1 overflow-y-auto pr-2">
                  {existingIngredient && !isEditMode && (
                    <ExistingStockInfo ingredient={existingIngredient} />
                  )}

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
                          disabled={!!existingIngredient && !isEditMode} // Desabilita apenas se for reabastecimento
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
                          disabled={!!existingIngredient && !isEditMode} // Desabilita apenas se for reabastecimento
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
                        <Label htmlFor="quantity">
                          Quantidade{existingIngredient && !isEditMode && ' do lote'}
                        </Label>

                        <QuantityInputField
                          placeholder={unit === 'un' ? '0' : '0,000'}
                          id="quantity"
                          unit={unit}
                          value={quantity}
                          allowDecimals={UNIT_LIMITS[unit]?.decimals > 0}
                          maxValue={UNIT_LIMITS[unit]?.max}
                          min={UNIT_LIMITS[unit]?.min}
                          onChange={(v: string) =>
                            setValue('quantity', v, { shouldValidate: true })
                          }
                          className={errors.quantity ? 'border-on-bad' : ''}
                        />

                        {errors.quantity && (
                          <p className="text-on-badborder-on-bad flex items-center gap-1 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buyPrice">
                          Preço de compra{existingIngredient && !isEditMode && ' do lote'}
                        </Label>

                        <CurrencyInputField
                          id="buyPrice"
                          value={buyPrice}
                          placeholder="R$ 0,00"
                          maxValue={CURRENCY_LIMITS.ingredient.max}
                          onChange={(v: string) =>
                            setValue('buyPrice', v, { shouldValidate: true })
                          }
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

                    {/* Conversão de Unidade (Opcional - Apenas se UNIDADE for 'un') */}
                    {unit === 'un' && (
                      <div className="bg-muted/30 rounded-lg border border-dashed p-4">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <Label className="text-primary mb-1 block font-medium">
                              Conversão de Medida (Opcional)
                            </Label>
                            <p className="text-muted-foreground text-xs">
                              Habilite para definir o peso equivalente a 1 unidade (ex: 1 caixa =
                              395g).
                            </p>
                          </div>
                          <div className="flex h-6 items-center">
                            <input
                              type="checkbox"
                              id="enableConversion"
                              className="border-input ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                              checked={isWeightConversionEnabled}
                              onChange={e => {
                                setIsWeightConversionEnabled(e.target.checked);
                                if (!e.target.checked) {
                                  setValue('weightPerUnit', '', { shouldValidate: true });
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className={`transition-all duration-200 ${
                            !isWeightConversionEnabled
                              ? 'pointer-events-none opacity-50 blur-[1px] grayscale'
                              : 'opacity-100'
                          }`}
                        >
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="weightPerUnit">Peso/Volume por Unidade</Label>
                              <QuantityInputField
                                placeholder="Ex: 395"
                                id="weightPerUnit"
                                unit={weightUnit || 'g'}
                                value={weightPerUnit || ''}
                                allowDecimals={true}
                                maxValue={100000}
                                min={0.001}
                                onChange={(v: string) =>
                                  setValue('weightPerUnit', v, { shouldValidate: true })
                                }
                                className={errors.weightPerUnit ? 'border-destructive' : ''}
                                disabled={!isWeightConversionEnabled}
                              />
                              {errors.weightPerUnit && (
                                <p className="text-destructive flex items-center gap-1 text-xs">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.weightPerUnit.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="weightUnit">Unidade de Peso/Volume</Label>
                              <UnitSelect
                                register={register}
                                name="weightUnit"
                                errors={errors}
                                options={['g', 'ml', 'kg', 'l']}
                                disabled={!isWeightConversionEnabled}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Min/Max Quantity */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="minQuantity">Quantidade Mínima (Alerta Crítico)</Label>
                        <QuantityInputField
                          placeholder={unit === 'un' ? '0' : '0,000'}
                          id="minQuantity"
                          unit={unit}
                          value={watch('minQuantity') || ''}
                          allowDecimals={UNIT_LIMITS[unit]?.decimals > 0}
                          maxValue={UNIT_LIMITS[unit]?.max}
                          min={0}
                          onChange={(v: string) =>
                            setValue('minQuantity', v, { shouldValidate: true })
                          }
                          className={errors.minQuantity ? 'border-destructive' : ''}
                        />
                        {errors.minQuantity && (
                          <p className="text-destructive flex items-center gap-1 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.minQuantity.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxQuantity">Quantidade Máxima (Capacidade)</Label>
                        <QuantityInputField
                          placeholder={unit === 'un' ? '0' : '0,000'}
                          id="maxQuantity"
                          unit={unit}
                          value={watch('maxQuantity') || ''}
                          allowDecimals={UNIT_LIMITS[unit]?.decimals > 0}
                          maxValue={UNIT_LIMITS[unit]?.max}
                          min={0}
                          onChange={(v: string) =>
                            setValue('maxQuantity', v, { shouldValidate: true })
                          }
                          className={errors.maxQuantity ? 'border-destructive' : ''}
                        />
                        {errors.maxQuantity && (
                          <p className="text-destructive flex items-center gap-1 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            {errors.maxQuantity.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PREVIEW DE PREÇO - Apenas se não for edição */}
                    {pricePreview && existingIngredient && !isEditMode && (
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
                            {isEditMode ? (
                              <CheckCheck className="h-4 w-4" />
                            ) : existingIngredient ? (
                              <Package className="h-4 w-4" />
                            ) : (
                              <CheckCheck className="h-4 w-4" />
                            )}
                            {isEditMode
                              ? 'Salvar'
                              : existingIngredient
                                ? 'Reabastecer'
                                : 'Adicionar'}
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </SheetContent>
            </Sheet>,
            document.body
          )}
        </>,
        document.body
      )}
    </>
  );
}
