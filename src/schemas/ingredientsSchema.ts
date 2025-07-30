import { z } from 'zod';

export const ingredientsSchema = z.object({
  name: z.string().min(1, 'O nome do ingrediente é obrigatório'),
  quantity: z.string().min(0, 'A quantidade deve ser maior ou igual a zero').or(z.literal('')), // permite string vazia para compatibilidade com input
  unit: z.string().min(1, 'A unidade é obrigatória'),
  buyPrice: z.string().min(0, 'O preço de compra deve ser maior ou igual a zero').or(z.literal('')), // permite string vazia para compatibilidade com input
});

export type IngredientsFormData = z.infer<typeof ingredientsSchema>;
