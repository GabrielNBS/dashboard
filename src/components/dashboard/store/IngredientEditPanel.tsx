'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CircleX, CheckCheck } from 'lucide-react';
import Button from '@/components/ui/base/Button';

import { useToast } from '@/components/ui/feedback/use-toast';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';

import { ingredientSchema, type IngredientFormData } from '@/schemas/validationSchemas';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/feedback/drawer';

import React from 'react';

import EditFormFields from '@/components/ui/forms/EditFormField';
import { denormalizeQuantity, normalizeQuantity } from '@/utils/helpers/normalizeQuantity';

export default function IngredientEditPanel() {
  const { state, dispatch } = useIngredientContext();
  const { isModalOpen, ingredientToEdit } = state;
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const methods = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    mode: 'onChange',
    defaultValues: { name: '', quantity: '', unit: 'kg', buyPrice: '' },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Efeitos colaterais
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isModalOpen) return reset();
    if (!ingredientToEdit) return;

    reset({
      name: ingredientToEdit.name,
      quantity: denormalizeQuantity(
        ingredientToEdit.totalQuantity,
        ingredientToEdit.unit
      ).toString(),
      unit: ingredientToEdit.unit as UnitType,
      buyPrice: ingredientToEdit.averageUnitPrice?.toString() || '',
    });
  }, [isModalOpen, ingredientToEdit, reset]);

  // Handlers
  const handleClose = () => dispatch({ type: 'CLOSE_EDIT_MODAL' });

  const onSubmit = (data: IngredientFormData) => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = data.buyPrice ? parseFloat(data.buyPrice) : 0;
    const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit);

    const updatedIngredient: Ingredient = {
      ...ingredientToEdit!,
      name: data.name.trim(),
      totalQuantity: normalizedQuantity,
      unit: data.unit,
      averageUnitPrice: rawPrice,
    };

    dispatch({ type: 'EDIT_INGREDIENT', payload: updatedIngredient });
    handleClose();

    toast({
      title: 'Ingrediente atualizado!',
      description: `"${data.name}" foi atualizado com sucesso.`,
      type: 'success',
    });
  };

  if (!mounted) return null;

  return (
    <Drawer open={isModalOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[95vh] sm:max-h-[90vh]">
        <div className="mx-auto flex w-full max-w-[480px] flex-col md:max-w-[800px]">
          <DrawerHeader className="px-4 pt-4 text-center sm:px-6 sm:pt-6">
            <DrawerTitle className="text-primary text-xl font-bold sm:text-2xl">
              Editar Ingrediente
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm sm:text-base">
              Atualize as informações do ingrediente
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
            <FormProvider {...methods}>
              <form
                id="ingredient-edit-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full justify-center"
              >
                <EditFormFields watchedUnit={methods.watch('unit')} />
              </form>
            </FormProvider>
          </div>

          <DrawerFooter className="bg-muted flex flex-row justify-center gap-2 px-4 pt-3 pb-4 sm:gap-3 sm:px-6 sm:pt-4 sm:pb-6">
            <Button
              type="button"
              variant="destructive"
              className="flex h-11 w-full max-w-[140px] gap-1 rounded-xl text-sm font-bold sm:h-12 sm:max-w-[150px] sm:text-base"
              onClick={handleClose}
            >
              <CircleX className="h-4 w-4" />
              Cancelar
            </Button>

            <Button
              type="submit"
              form="ingredient-edit-form"
              variant="accept"
              className="flex h-11 w-full max-w-[140px] gap-1 rounded-xl text-sm font-bold sm:h-12 sm:max-w-[150px] sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Salvando...'
              ) : (
                <>
                  <CheckCheck className="h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
