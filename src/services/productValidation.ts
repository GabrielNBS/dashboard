//  FASE 3.2: Serviço de validação centralizado
// Benefício: Validações testáveis, reutilizáveis, sem acoplamento com componentes

import { WizardStep } from '@/types/products';

export interface ValidationError {
  message: string;
  field?: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  ingredients: any[];
  productionMode: string;
  yieldQuantity: number;
  margin: string;
  sellingPrice: string;
}

// Validação do step básico
export function validateBasicInfo(
  data: Pick<ProductFormData, 'name' | 'category'>
): ValidationError | null {
  if (!data.name?.trim()) {
    return { message: 'Nome do produto é obrigatório', field: 'name' };
  }
  if (data.name.length < 3) {
    return { message: 'Nome deve ter pelo menos 3 caracteres', field: 'name' };
  }
  if (!data.category) {
    return { message: 'Categoria do produto é obrigatória', field: 'category' };
  }
  return null;
}

// Validação de ingredientes
export function validateIngredients(
  data: Pick<ProductFormData, 'ingredients'>
): ValidationError | null {
  if (!data.ingredients || data.ingredients.length === 0) {
    return { message: 'Adicione pelo menos um ingrediente', field: 'ingredients' };
  }
  return null;
}

// Validação de produção
export function validateProduction(
  data: Pick<ProductFormData, 'productionMode' | 'yieldQuantity'>
): ValidationError | null {
  if (!data.productionMode) {
    return { message: 'Modo de produção é obrigatório', field: 'productionMode' };
  }

  if (data.productionMode === 'lote' && (!data.yieldQuantity || data.yieldQuantity < 1)) {
    return { message: 'Rendimento do lote deve ser maior que zero', field: 'yieldQuantity' };
  }
  return null;
}

// Validação de preços
export function validatePricing(
  data: Pick<ProductFormData, 'margin' | 'sellingPrice'>
): ValidationError | null {
  const margin = parseFloat(data.margin);
  const sellingPrice = parseFloat(data.sellingPrice);

  if (!data.margin || isNaN(margin)) {
    return { message: 'Margem de lucro é obrigatória', field: 'margin' };
  }

  if (!data.sellingPrice || isNaN(sellingPrice) || sellingPrice <= 0) {
    return {
      message: 'Preço de venda é obrigatório e deve ser maior que zero',
      field: 'sellingPrice',
    };
  }

  return null;
}

// Função principal que valida baseado no step
export function validateStep(
  step: WizardStep,
  data: Partial<ProductFormData>
): ValidationError | null {
  switch (step) {
    case 0: // WizardStep.BASIC
      return validateBasicInfo(data as Pick<ProductFormData, 'name' | 'category'>);
    case 1: // WizardStep.INGREDIENTS
      return validateIngredients(data as Pick<ProductFormData, 'ingredients'>);
    case 2: // WizardStep.PRODUCTION
      return validateProduction(data as Pick<ProductFormData, 'productionMode' | 'yieldQuantity'>);
    case 3: // WizardStep.PRICING
      return validatePricing(data as Pick<ProductFormData, 'margin' | 'sellingPrice'>);
    case 4: // WizardStep.REVIEW
      return null;
    default:
      return null;
  }
}
