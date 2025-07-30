import { z } from 'zod';
import { UnitType } from '@/types/ingredients';

// Schema para validação de ingredientes
export const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim(),

  quantity: z
    .string()
    .min(1, 'Quantidade é obrigatória')
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Quantidade deve ser um número maior que zero')
    .refine(val => {
      const num = parseFloat(val);
      return (
        val !== '' &&
        !isNaN(num) &&
        ((num >= 0.001 && num <= 1000) || // kg e l
          (Number.isInteger(num) && num >= 1 && num <= 10000)) // un
      );
    }, 'Quantidade inválida para o tipo de unidade'),

  unit: z.enum(['kg', 'l', 'un'], {
    required_error: 'Unidade é obrigatória',
  }),

  buyPrice: z
    .string()
    .min(1, 'Preço de compra é obrigatório')
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Preço deve ser um número maior que zero'),
});

export type IngredientFormData = z.infer<typeof ingredientSchema>;

// Função para validação dinâmica da quantidade por unidade
export function validateQuantityByUnit(quantity: number, unit: UnitType): string | null {
  switch (unit) {
    case 'kg':
      if (quantity > 1000) return 'Quantidade em kg não pode ser maior que 1000';
      if (quantity < 0.001) return 'Quantidade em kg deve ser pelo menos 0.001';
      break;

    case 'l':
      if (quantity > 1000) return 'Quantidade em litros não pode ser maior que 1000';
      if (quantity < 0.001) return 'Quantidade em litros deve ser pelo menos 0.001';
      break;

    case 'un':
      if (quantity > 10000) return 'Quantidade em unidades não pode ser maior que 10000';
      if (quantity < 1) return 'Quantidade em unidades deve ser pelo menos 1';
      if (!Number.isInteger(quantity)) return 'Quantidade em unidades deve ser um número inteiro';
      break;
  }
  return null;
}
