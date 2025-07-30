'use client';

import Button from '@/components/ui/Button';
import { CheckIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { finalProductSchema } from '@/schemas/finalProductSchema';
import { z } from 'zod';

import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { useFinalProductContext } from '@/contexts/products/useFinalProductContext';
import CategoryList from '@/components/ui/CategoryList';
import IngredientSelector from './IngredientSelector';
import Input from '@/components/ui/Input';
import { toast } from '@/components/ui/use-toast';

// Tipagem automática derivada do schema Zod
type FinalProductFormData = z.infer<typeof finalProductSchema>;

export default function RegisterIngredientForm({ onClose }: { onClose?: () => void }) {
  const { state: finalProduct, dispatch } = useProductBuilderContext();
  const { state: listState, dispatch: listDispatch } = useFinalProductContext();

  // Hook do react-hook-form com zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FinalProductFormData>({
    resolver: zodResolver(finalProductSchema),
    defaultValues: {
      name: finalProduct.name,
      category: finalProduct.category,
      productionMode: finalProduct.productionMode,
      yieldQuantity: finalProduct.yieldQuantity,
      profitMargin: 33, // margem padrão
    },
  });

  const watchedYield = watch('yieldQuantity');
  const watchedProfitMargin = watch('profitMargin');
  const watchedProductionMode = watch('productionMode');

  const totalCost = finalProduct.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
  const sellingPrice = totalCost + totalCost * (watchedProfitMargin / 100);
  const unitPrice =
    watchedProductionMode === 'lote' && watchedYield && watchedYield > 0
      ? sellingPrice / watchedYield
      : sellingPrice;

  const onSubmit = (data: FinalProductFormData) => {
    console.log('Final Product Data:', data);
    if (finalProduct.ingredients.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos um ingrediente.',
        variant: 'destructive',
      });
      return;
    }

    const isDuplicate = listState.products.some(
      p =>
        p.name.toLowerCase() === data.name.toLowerCase() &&
        p.category.toLowerCase() === data.category.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: 'Erro',
        description: 'Já existe um produto com esse nome e categoria.',
        variant: 'destructive',
      });
      return;
    }

    listDispatch({
      type: 'ADD_FINAL_PRODUCT',
      payload: {
        ...finalProduct,
        name: data.name,
        category: data.category,
        productionMode: data.productionMode,
        yieldQuantity: data.productionMode,
        profitMargin: data.profitMargin,
        totalCost,
        sellingPrice: unitPrice,
      },
    });

    dispatch({ type: 'RESET_PRODUCT' });
    if (onClose) onClose();

    toast({
      title: 'Produto adicionado com sucesso!',
      description: `"${data.name}" foi adicionado à lista de produtos.`,
      variant: 'accept',
    });
  };

  const handleCloseForm = () => {
    dispatch({ type: 'RESET_PRODUCT' });
    if (onClose) onClose();
  };

  return (
    <>
      <h2 className="p-default text-hero-2xl font-bold">Adicionar produto</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register('name')} placeholder="Nome do produto" className="rounded border p-2" />
        {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}

        <CategoryList />
        <IngredientSelector />

        <label className="block font-medium">Modo de produção:</label>
        <select {...register('productionMode')} className="w-full rounded border p-2">
          <option value="individual">Individual</option>
          <option value="lote">Lote</option>
        </select>
        {errors.productionMode && (
          <span className="text-sm text-red-500">{errors.productionMode.message}</span>
        )}

        {watchedProductionMode === 'lote' && (
          <div className="flex items-center gap-4">
            <label className="block font-medium">Rendimento do lote:</label>
            <Input
              type="number"
              {...register('yieldQuantity', { valueAsNumber: true })}
              placeholder="Quantidade total produzida"
              className="w-24 rounded border p-2"
            />
            {errors.yieldQuantity && (
              <span className="text-sm text-red-500">{errors.yieldQuantity.message}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="block font-medium">Margem de Lucro (%):</label>
          <Input
            type="number"
            {...register('profitMargin', { valueAsNumber: true })}
            className="w-24 rounded border p-2"
          />
          {errors.profitMargin && (
            <span className="text-sm text-red-500">{errors.profitMargin.message}</span>
          )}
        </div>

        <div className="absolute right-48 bottom-10 flex gap-8">
          <div>
            <span className="text-sm font-semibold">Custo Total:</span>
            <span className="block text-xl">R$ {totalCost.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-sm font-semibold">Preço de Venda Sugerido:</span>
            <span className="block text-xl text-green-700">R$ {unitPrice.toFixed(2)}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="absolute right-6 bottom-10 h-16 w-16 rounded-full bg-green-300 hover:bg-green-400"
        >
          <CheckIcon className="h-10 w-10" strokeWidth={2} />
        </Button>
        <Button
          type="button"
          className="absolute right-26 bottom-10 h-16 w-16 rounded-full bg-red-300 hover:bg-red-400"
          onClick={handleCloseForm}
        >
          <X className="h-10 w-10" strokeWidth={2} />
        </Button>
      </form>
    </>
  );
}
