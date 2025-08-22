'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CircleX, CheckCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

import { useToast } from '@/components/ui/use-toast';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { denormalizeQuantity, normalizeQuantity } from '@/utils/normalizeQuantity';

import { ingredientSchema, type IngredientFormData } from '@/schemas/validationSchemas';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

import React from 'react';

import EditFormFields from '@/components/ui/EditFormField';

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
      quantity: denormalizeQuantity(ingredientToEdit.quantity, ingredientToEdit.unit).toString(),
      unit: ingredientToEdit.unit as UnitType,
      buyPrice: ingredientToEdit.buyPrice?.toString() || '',
    });
  }, [isModalOpen, ingredientToEdit, reset]);

  // Handlers
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

  if (!mounted) return null;

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

          <DrawerFooter className="flex flex-row justify-center gap-3 border-t bg-gray-50 px-6 pt-4 pb-6">
            <Button
              type="button"
              variant="destructive"
              className="flex h-12 max-w-[150px] gap-1 rounded-xl text-base font-bold"
              onClick={handleClose}
            >
              <CircleX className="h-4 w-4" />
              Cancelar
            </Button>

            <Button
              type="submit"
              form="ingredient-edit-form"
              variant="accept"
              className="flex h-12 max-w-[150px] gap-1 rounded-xl text-base font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Salvando...'
              ) : (
                <>
                  <CheckCheck />
                  Salvar
                </>
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
