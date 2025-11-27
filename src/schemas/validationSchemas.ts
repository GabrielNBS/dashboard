import { z } from 'zod';
import { UnitType } from '@/types/ingredients';

/**
 * Limites de quantidade por unidade
 */
export const UNIT_LIMITS = {
  un: { min: 1, max: 10000, decimals: 0 },
  kg: { min: 0.001, max: 1000, decimals: 3 },
  l: { min: 0.001, max: 1000, decimals: 3 },
  g: { min: 1, max: 1000000, decimals: 0 },
  ml: { min: 1, max: 1000000, decimals: 0 },
} as const;

/**
 * Limites de valores monetários
 */
export const CURRENCY_LIMITS = {
  ingredient: { min: 0.01, max: 999999.99 },
  product: { min: 0.01, max: 999999.99 },
  discount: { min: 0, max: 999.99 },
  fixedCost: { min: 0, max: 999999.99 },
  variableCost: { min: 0, max: 9999.99 },
} as const;

/**
 * Limites de percentuais
 */
export const PERCENTAGE_LIMITS = {
  margin: { min: 0, max: 1000 },
  discount: { min: 0, max: 50 },
  paymentFee: { min: 0, max: 25 },
  variableCost: { min: 0, max: 50 },
} as const;

/**
 * Schema para validação de ingredientes
 * Todas as validações são feitas via schema, sem validações manuais
 */
export const ingredientSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres')
      .trim()
      .transform(val =>
        val
          .replace(/[<>]/g, '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      ),

    quantity: z
      .string()
      .min(1, 'Quantidade é obrigatória')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Quantidade deve ser um número maior que zero'),

    unit: z.enum(['kg', 'l', 'un', 'g', 'ml']),

    minQuantity: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      }, 'Quantidade mínima deve ser maior ou igual a zero'),

    maxQuantity: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Quantidade máxima deve ser maior que zero'),

    buyPrice: z
      .string()
      .min(1, 'Preço de compra é obrigatório')
      .refine(
        val => {
          const num = parseFloat(val);
          return !isNaN(num) && num >= CURRENCY_LIMITS.ingredient.min;
        },
        `Preço deve ser no mínimo R$ ${CURRENCY_LIMITS.ingredient.min.toFixed(2)}`
      )
      .refine(
        val => {
          const num = parseFloat(val);
          return num <= CURRENCY_LIMITS.ingredient.max;
        },
        `Preço não pode ser maior que R$ ${CURRENCY_LIMITS.ingredient.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ),
  })
  .superRefine((data, ctx) => {
    // Validação dinâmica da quantidade baseada na unidade
    const num = parseFloat(data.quantity);
    const limits = UNIT_LIMITS[data.unit as keyof typeof UNIT_LIMITS];

    if (limits) {
      if (num < limits.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['quantity'],
          message: `Quantidade mínima: ${limits.min} ${data.unit}`,
        });
      }

      if (num > limits.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['quantity'],
          message: `Quantidade máxima: ${limits.max} ${data.unit}`,
        });
      }

      // Validar decimais para unidades inteiras
      if (limits.decimals === 0 && !Number.isInteger(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['quantity'],
          message: `${data.unit} deve ser um número inteiro`,
        });
      }
    }

    // Validação Min < Max
    if (data.minQuantity && data.maxQuantity) {
      const min = parseFloat(data.minQuantity);
      const max = parseFloat(data.maxQuantity);

      if (!isNaN(min) && !isNaN(max) && min >= max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['minQuantity'],
          message: 'Mínimo deve ser menor que o máximo',
        });
      }
    }
  });

/**
 * Schema para validação de produtos finais
 */
export const finalProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do produto é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .transform(val =>
      val
        .replace(/[<>]/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    ),

  category: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .max(50, 'Categoria deve ter no máximo 50 caracteres'),

  productionMode: z.enum(['individual', 'lote'], {
    message: 'Modo de produção inválido',
  }),

  yieldQuantity: z
    .number()
    .int('Rendimento deve ser um número inteiro')
    .min(1, 'Rendimento deve ser maior que zero')
    .max(10000, 'Rendimento não pode ser maior que 10.000')
    .optional(),

  sellingPrice: z
    .string()
    .min(1, 'Preço de venda é obrigatório')
    .refine(
      val => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= CURRENCY_LIMITS.product.min;
      },
      `Preço deve ser no mínimo R$ ${CURRENCY_LIMITS.product.min.toFixed(2)}`
    )
    .refine(
      val => {
        const num = parseFloat(val);
        return num <= CURRENCY_LIMITS.product.max;
      },
      `Preço não pode ser maior que R$ ${CURRENCY_LIMITS.product.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ),

  profitMargin: z
    .string()
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= PERCENTAGE_LIMITS.margin.min;
    }, 'Margem de lucro não pode ser negativa')
    .refine(val => {
      const num = parseFloat(val);
      return num <= PERCENTAGE_LIMITS.margin.max;
    }, `Margem não pode ser maior que ${PERCENTAGE_LIMITS.margin.max}%`),
});

/**
 * Schema para validação de pagamento
 */
export const paymentSchema = z.object({
  method: z.enum(['dinheiro', 'débito', 'crédito', 'Ifood'], {
    message: 'Método de pagamento inválido',
  }),

  discount: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0, 'Desconto não pode ser negativo'),
  }),
});

/**
 * Schema para validação de custos fixos
 */
export const fixedCostSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do custo é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  amount: z
    .string()
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, 'Valor deve ser maior ou igual a zero')
    .refine(
      val => {
        const num = parseFloat(val);
        return num <= CURRENCY_LIMITS.fixedCost.max;
      },
      `Valor não pode ser maior que R$ ${CURRENCY_LIMITS.fixedCost.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ),

  recurrence: z.enum(['diario', 'semanal', 'mensal', 'anual']),
  category: z.enum(['aluguel', 'energia', 'agua', 'internet', 'funcionarios', 'outros']),
});

/**
 * Schema para validação de custos variáveis
 */
export const variableCostSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do custo é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  percentage: z
    .string()
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, 'Percentual não pode ser negativo')
    .refine(val => {
      const num = parseFloat(val);
      return num <= PERCENTAGE_LIMITS.variableCost.max;
    }, `Percentual não pode ser maior que ${PERCENTAGE_LIMITS.variableCost.max}%`),

  fixedValue: z
    .string()
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, 'Valor não pode ser negativo')
    .refine(
      val => {
        const num = parseFloat(val);
        return num <= CURRENCY_LIMITS.variableCost.max;
      },
      `Valor não pode ser maior que R$ ${CURRENCY_LIMITS.variableCost.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ),
});

/**
 * Schema para validação de taxas de pagamento
 */
export const paymentFeeSchema = z.object({
  cash: z
    .number()
    .min(0, 'Taxa não pode ser negativa')
    .max(
      PERCENTAGE_LIMITS.paymentFee.max,
      `Taxa não pode ser maior que ${PERCENTAGE_LIMITS.paymentFee.max}%`
    ),

  debit: z
    .number()
    .min(0, 'Taxa não pode ser negativa')
    .max(
      PERCENTAGE_LIMITS.paymentFee.max,
      `Taxa não pode ser maior que ${PERCENTAGE_LIMITS.paymentFee.max}%`
    ),

  credit: z
    .number()
    .min(0, 'Taxa não pode ser negativa')
    .max(
      PERCENTAGE_LIMITS.paymentFee.max,
      `Taxa não pode ser maior que ${PERCENTAGE_LIMITS.paymentFee.max}%`
    ),

  ifood: z
    .number()
    .min(0, 'Taxa não pode ser negativa')
    .max(
      PERCENTAGE_LIMITS.paymentFee.max,
      `Taxa não pode ser maior que ${PERCENTAGE_LIMITS.paymentFee.max}%`
    ),
});

/**
 * Tipos inferidos dos schemas
 */
export type IngredientFormData = z.infer<typeof ingredientSchema>;
export type FinalProductFormData = z.infer<typeof finalProductSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type FixedCostFormData = z.infer<typeof fixedCostSchema>;
export type VariableCostFormData = z.infer<typeof variableCostSchema>;
export type PaymentFeeFormData = z.infer<typeof paymentFeeSchema>;

/**
 * Função auxiliar para validação de quantidade por unidade
 * Mantida para compatibilidade, mas agora usa os limites centralizados
 */
export function validateQuantityByUnit(quantity: number, unit: UnitType): string | null {
  const limits = UNIT_LIMITS[unit as keyof typeof UNIT_LIMITS];

  if (!limits) return 'Unidade inválida';

  if (quantity < limits.min) {
    return `Quantidade mínima: ${limits.min} ${unit}`;
  }

  if (quantity > limits.max) {
    return `Quantidade máxima: ${limits.max} ${unit}`;
  }

  if (limits.decimals === 0 && !Number.isInteger(quantity)) {
    return `${unit} deve ser um número inteiro`;
  }

  return null;
}
