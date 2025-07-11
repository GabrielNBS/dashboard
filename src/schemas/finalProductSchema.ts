import { z } from 'zod';

export const finalProductSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório'),
  category: z.string().min(1, 'A categoria do produto é obrigatória'),
  productionMode: z.enum(['individual', 'lote']),
  yieldQuantity: z
    .number()
    .min(1, 'O rendimento deve ser maior que zero')
    .optional()
    .or(z.literal(undefined)), // permite undefined se o modo de produção for individual
  profitMargin: z.number().min(0, 'A margem de lucro não pode ser negativa'),
});
