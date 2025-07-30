'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { normalizeQuantity } from '@/utils/normalizeQuantity';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { IngredientsFormData, ingredientsSchema } from '@/schemas/ingredientsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function IngredientForm() {
  const { dispatch } = useIngredientContext();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IngredientsFormData>({
    resolver: zodResolver(ingredientsSchema),
    defaultValues: {
      name: '',
      quantity: '',
      unit: 'kg',
      buyPrice: '',
    },
  });

  const unit = watch('unit');

  const onSubmit = (data: IngredientsFormData) => {
    const rawQuantity = parseFloat(data.quantity);
    const rawPrice = parseFloat(data.buyPrice);

    if (isNaN(rawQuantity) || isNaN(rawPrice)) {
      toast({
        title: 'Erro ao adicionar ingrediente',
        description: 'Preencha todos os campos corretamente.',
        variant: 'destructive',
      });
      return;
    }

    const normalizedQuantity = normalizeQuantity(rawQuantity, data.unit as UnitType);

    const newIngredient: Ingredient = {
      id: uuidv4(),
      name: data.name,
      quantity: normalizedQuantity,
      unit: data.unit as UnitType,
      buyPrice: rawPrice,
      totalValue: normalizedQuantity * rawPrice,
    };

    dispatch({ type: 'ADD_INGREDIENT', payload: newIngredient });

    toast({
      title: 'Ingrediente adicionado',
      description: `"${data.name}" cadastrado com sucesso.`,
      variant: 'accept',
    });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-1/2 gap-4">
      <div className="flex flex-col">
        <Input type="text" placeholder="Nome do ingrediente" id="name" {...register('name')} />
        {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col">
        <Input
          type="number"
          step="any"
          placeholder={`Quantidade (${unit})`}
          id="quantity"
          min={0}
          {...register('quantity')}
        />
        {errors.quantity && <span className="text-sm text-red-500">{errors.quantity.message}</span>}
      </div>

      <div className="flex flex-col">
        <select
          title="Campo de medida do produto"
          className="rounded border p-2"
          {...register('unit')}
        >
          <option value="kg">Quilo (kg)</option>
          <option value="l">Litro (l)</option>
          <option value="un">Unidade</option>
        </select>
        {errors.unit && <span className="text-sm text-red-500">{errors.unit.message}</span>}
      </div>

      <div className="flex flex-col">
        <Input
          type="number"
          step="0.01"
          placeholder="Preço de compra"
          id="buyPrice"
          min={0}
          {...register('buyPrice')}
        />
        {errors.buyPrice && <span className="text-sm text-red-500">{errors.buyPrice.message}</span>}
      </div>

      <Button variant="accept" type="submit">
        Adicionar
      </Button>
    </form>
  );
}
