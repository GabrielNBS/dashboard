/* eslint-disable prettier/prettier */

import React, { useState, useCallback, useEffect, useMemo, useRef, createContext, useContext, ReactNode } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { showValidationToast, showSuccessToast } from '@/components/ui/GenericFormUtils';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';
import { ProductionMode } from '@/types/products';

// Importar os steps
import BasicInfoStep from './steps/BasicInfoStep';
import IngredientsStep from './steps/IngredientsStep';
import ProductionStep from './steps/ProductionStep';
import PricingStep from './steps/PricingStep';
import ReviewStep from './steps/ReviewStep';
import { ArrowRight, Check, CheckCheck } from 'lucide-react';
import LordIcon from '@/components/ui/LordIcon';
import { Button } from '@/components/ui/base';

enum WizardStep {
  BASIC = 0,
  INGREDIENTS = 1,
  PRODUCTION = 2,
  PRICING = 3,
  REVIEW = 4,
}

type ValidationError = {
  title: string;
  description: string;
} | null;

interface StepConfig {
  component: React.ComponentType<any>;
  label: string;
  icon: string;
  description: string;
}

const STEPS: StepConfig[] = [
  {
    component: BasicInfoStep,
    label: 'Básico',
    icon: 'https://cdn.lordicon.com/jgnvfzqg.json',
    description: 'Nome e categoria',
  },
  {
    component: IngredientsStep,
    label: 'Ingredientes',
    icon: 'https://cdn.lordicon.com/fmsilsqx.json',
    description: 'Adicionar ingredientes',
  },
  {
    component: ProductionStep,
    label: 'Produção',
    icon: 'https://cdn.lordicon.com/fspidoxv.json',
    description: 'Modo de produção',
  },
  {
    component: PricingStep,
    label: 'Preços',
    icon: 'https://cdn.lordicon.com/bgfqzjey.json',
    description: 'Preços e margens',
  },
  {
    component: ReviewStep,
    label: 'Revisar',
    icon: 'https://cdn.lordicon.com/zdfcfvwu.json',
    description: 'Confirmar dados',
  },
];



interface StepUpdateData {
  name?: string;
  category?: string;
  image?: string;
  sellingPrice?: string;
  margin?: string;
  productionMode?: ProductionMode;
  yieldQuantity?: number;
}

/**
 * Helpers de negócio puros
 */

const normalizeText = (value?: string | null): string => (value ?? '').trim().toLowerCase();

const isBatchMode = (mode: ProductionMode | null | undefined): boolean => mode === 'lote';

/**
 * Validações puras — retornam apenas erro, sem side-effects
 */

const validateBasicInfo = (name: string, category: string): ValidationError => {
  if (!name?.trim()) {
    return {
      title: 'Nome obrigatório',
      description: 'Informe o nome do produto.',
    };
  }
  if (!category?.trim()) {
    return {
      title: 'Categoria obrigatória',
      description: 'Selecione uma categoria.',
    };
  }
  return null;
};

const validateIngredients = (ingredientsCount: number): ValidationError => {
  if (ingredientsCount === 0) {
    return {
      title: 'Ingredientes necessários',
      description: 'Adicione pelo menos um ingrediente.',
    };
  }
  return null;
};

const validateProduction = (mode: ProductionMode | null): ValidationError => {
  if (!mode) {
    return {
      title: 'Modo de produção obrigatório',
      description: 'Selecione o modo de produção.',
    };
  }
  return null;
};

const validatePricing = (sellingPrice: number): ValidationError => {
  if (!sellingPrice || Number.isNaN(sellingPrice) || sellingPrice <= 0) {
    return {
      title: 'Preço inválido',
      description: 'Informe um preço válido.',
    };
  }
  return null;
};

// Context Definition
interface MultiStepContextType {
  currentStep: WizardStep;
  steps: StepConfig[];
  progress: number;
  isSubmitting: boolean;
  isLastStep: boolean;
  isEditMode: boolean;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => void;
  stepProps: any;
  CurrentStepComponent: React.ComponentType<any>;
}

const MultiStepContext = createContext<MultiStepContextType | undefined>(undefined);

const useMultiStepForm = () => {
  const context = useContext(MultiStepContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepRoot');
  }
  return context;
};

// Root Component
export function MultiStepRoot({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const { state: productState, dispatch: productDispatch } = useProductContext();
  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const { state: settingsState } = useSettings();
  const { productToEdit, products, isEditMode } = productState;

  const isInitializedRef = useRef(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.BASIC);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultMargin = settingsState?.financial?.defaultProfitMargin ?? 0;
  const [tempSellingPrice, setTempSellingPrice] = useState<string>('');
  const [tempMargin, setTempMargin] = useState<string>(defaultMargin.toString());

  
  useEffect(() => {
    if (isInitializedRef.current) return;
    if (!settingsState?.financial) return;

    if (productToEdit) {
      builderDispatch({ type: 'SET_NAME', payload: productToEdit.name });
      builderDispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
      if (productToEdit.image) builderDispatch({ type: 'SET_IMAGE', payload: productToEdit.image });
      builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.production.mode });
      builderDispatch({ type: 'SET_YIELD_QUANTITY', payload: productToEdit.production.yieldQuantity });
      builderDispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });
      setTempSellingPrice(productToEdit.production.sellingPrice.toString());
      setTempMargin(productToEdit.production.unitMargin.toString());
    } else {
      builderDispatch({ type: 'RESET_PRODUCT' });
      setTempSellingPrice('');
      setTempMargin((settingsState.financial.defaultProfitMargin ?? 0).toString());
    }
    isInitializedRef.current = true;
  }, [productToEdit, settingsState, builderDispatch]);

  useEffect(() => {
    return () => {
      builderDispatch({ type: 'RESET_PRODUCT' });
      isInitializedRef.current = false;
    };
  }, [builderDispatch]);

  const totalCost = useMemo(() => {
    return builderState.ingredients.reduce((acc, ing) => {
      const ingredientCost = (ing.averageUnitPrice ?? 0) * (ing.totalQuantity ?? 0);
      return acc + ingredientCost;
    }, 0);
  }, [builderState.ingredients]);

  const getCalculations = useCallback(() => {
    const margin = parseFloat(tempMargin) || 0;
    const sellingPrice = parseFloat(tempSellingPrice) || 0;

    return {
      totalCost,
      suggestedPrice: calculateSuggestedPrice(
        totalCost,
        margin,
        builderState.production.mode,
        builderState.production.yieldQuantity,
      ),
      realProfitMargin: calculateRealProfitMargin(
        totalCost,
        sellingPrice,
        builderState.production.mode,
        builderState.production.yieldQuantity,
      ),
      unitCost: calculateUnitCost(
        totalCost,
        builderState.production.mode,
        builderState.production.yieldQuantity,
      ),
    };
  }, [totalCost, tempMargin, tempSellingPrice, builderState.production]);

  const validateStep = useCallback(
    (step: WizardStep): boolean => {
      let error: ValidationError = null;
      switch (step) {
        case WizardStep.BASIC:
          error = validateBasicInfo(builderState.name, builderState.category);
          break;
        case WizardStep.INGREDIENTS:
          error = validateIngredients(builderState.ingredients.length);
          break;
        case WizardStep.PRODUCTION:
          error = validateProduction(builderState.production.mode);
          break;
        case WizardStep.PRICING:
          const sellingPriceValue = parseFloat(tempSellingPrice);
          error = validatePricing(sellingPriceValue);
          break;
        default:
          error = null;
      }
      if (error) {
        showValidationToast(error);
        return false;
      }
      return true;
    },
    [builderState.name, builderState.category, builderState.ingredients.length, builderState.production.mode, tempSellingPrice]
  );

  const nextStep = useCallback(() => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => (prev + 1) as WizardStep);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => (prev - 1) as WizardStep);
    }
  }, [currentStep]);

  const checkForDuplicate = useCallback((): boolean => {
    const currentName = normalizeText(builderState.name);
    const currentCategory = normalizeText(builderState.category);
    return products.some(p => {
      const existingName = normalizeText(p.name);
      const existingCategory = normalizeText(p.category);
      const isSameProduct = existingName === currentName && existingCategory === currentCategory;
      const isDifferentUid = !isEditMode || p.uid !== productToEdit?.uid;
      return isSameProduct && isDifferentUid;
    });
  }, [products, builderState.name, builderState.category, isEditMode, productToEdit?.uid]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(currentStep)) return;
    if (!isEditMode && checkForDuplicate()) {
      showValidationToast({
        title: 'Produto duplicado',
        description: 'Já existe um produto com esse nome e categoria.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const calculations = getCalculations();
      const sellingPriceValue = parseFloat(tempSellingPrice) || 0;
      const customMarginValue = parseFloat(tempMargin) || 0;
      const isBatch = isBatchMode(builderState.production.mode);

      const production = {
        ...builderState.production,
        totalCost: calculations.totalCost,
        unitCost: calculations.unitCost,
        sellingPrice: isBatch
          ? sellingPriceValue * builderState.production.yieldQuantity
          : sellingPriceValue,
        unitSellingPrice: sellingPriceValue,
        unitMargin: customMarginValue,
        profitMargin: calculations.realProfitMargin,
      };

      const productPayload = {
        ...builderState,
        production,
        uid: isEditMode && productToEdit ? productToEdit.uid : Date.now().toString(),
      };

      const action = isEditMode ? 'EDIT_PRODUCT' : 'ADD_PRODUCT';
      productDispatch({ type: action, payload: productPayload });

      showSuccessToast({
        title: isEditMode ? 'Produto atualizado!' : 'Produto adicionado com sucesso!',
        description: isEditMode
          ? `"${builderState.name}" foi editado com sucesso.`
          : `"${builderState.name}" foi adicionado à lista de produtos.`,
      });

      builderDispatch({ type: 'RESET_PRODUCT' });
      isInitializedRef.current = false;
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      showValidationToast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o produto.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, validateStep, isEditMode, checkForDuplicate, builderState, tempSellingPrice, tempMargin, getCalculations, productToEdit, productDispatch, builderDispatch, onClose]);

  const progress = useMemo(() => {
    return ((currentStep + 1) / STEPS.length) * 100;
  }, [currentStep]);

  const CurrentStepComponent = useMemo(() => {
    return STEPS[currentStep].component;
  }, [currentStep]);

  const isLastStep = currentStep === STEPS.length - 1;

  const stepProps = useMemo(() => {
    const updateData = (data: StepUpdateData) => {
      if (data.name !== undefined) builderDispatch({ type: 'SET_NAME', payload: data.name });
      if (data.category !== undefined) builderDispatch({ type: 'SET_CATEGORY', payload: data.category });
      if (data.image !== undefined) builderDispatch({ type: 'SET_IMAGE', payload: data.image });
      if (data.sellingPrice !== undefined) setTempSellingPrice(data.sellingPrice);
      if (data.margin !== undefined) setTempMargin(data.margin);
      if (data.productionMode !== undefined) builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: data.productionMode });
      if (data.yieldQuantity !== undefined) builderDispatch({ type: 'SET_YIELD_QUANTITY', payload: data.yieldQuantity });
    };

    return {
      data: {
        name: builderState.name,
        category: builderState.category,
        image: builderState.image,
        ingredientsCount: builderState.ingredients.length,
        productionMode: builderState.production.mode,
        yieldQuantity: builderState.production.yieldQuantity,
        sellingPrice: tempSellingPrice,
        margin: tempMargin,
        ingredients: builderState.ingredients,
        production: builderState.production,
        calculations: getCalculations(),
      },
      updateData,
    };
  }, [builderState, tempSellingPrice, tempMargin, builderDispatch, getCalculations]);

  const value = {
    currentStep,
    steps: STEPS,
    progress,
    isSubmitting,
    isLastStep,
    isEditMode,
    nextStep,
    prevStep,
    submit: handleSubmit,
    stepProps,
    CurrentStepComponent,
  };

  return <MultiStepContext.Provider value={value}>{children}</MultiStepContext.Provider>;
}

// Header Component
export function MultiStepHeader() {
  const { currentStep, steps, progress } = useMultiStepForm();

  return (
    <div className="shrink-0 border-b border-gray-200 pb-2 sm:pb-4">
      <div className="mb-2 flex items-center justify-end sm:mb-3">
        <div>
          <div className="text-[10px] text-gray-500 sm:text-xs">Progresso</div>
          <div className="text-xs font-semibold text-gray-900 sm:text-sm">
            {currentStep + 1}/{steps.length}
          </div>
        </div>
      </div>

      <div className="mb-2 flex justify-between sm:mb-3">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center">
              <div
                className={`mb-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:mb-1 sm:h-8 sm:w-8 ${
                  index === currentStep
                    ? 'bg-primary text-secondary shadow-lg'
                    : index < currentStep
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <span className="text-xs sm:text-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                ) : (
                  <LordIcon
                    src={step.icon}
                    width={12}
                    height={12}
                    isActive={index === currentStep}
                    isHovered={index === currentStep}
                  />
                )}
              </div>
              <span
                className={`text-center text-[10px] font-medium sm:text-xs ${
                  index === currentStep
                    ? 'text-primary'
                    : index < currentStep
                      ? 'text-green-600'
                      : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 transition-all duration-300 sm:mx-2 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="h-1 w-full rounded-full bg-gray-200">
        <div
          className="h-1 rounded-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Content Component
export function MultiStepContent() {
  const { CurrentStepComponent, stepProps } = useMultiStepForm();
  return (
    <div className="h-full">
      <CurrentStepComponent {...stepProps} />
    </div>
  );
}

// Footer Component
export function MultiStepFooter() {
  const { currentStep, isLastStep, isSubmitting, isEditMode, nextStep, prevStep, submit } = useMultiStepForm();

  return (
    <div className="flex justify-between gap-2">
      <Button
        type="button"
        onClick={prevStep}
        disabled={currentStep === WizardStep.BASIC}
        className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
      >
        Voltar
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-2 sm:text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="hidden sm:inline">Salvando...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">
                {isEditMode ? 'Atualizar Produto' : 'Criar Produto'}
              </span>
              <span className="sm:hidden">{isEditMode ? 'Atualizar' : 'Criar'}</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="hidden sm:inline">Próximo</span>
          <span className="sm:hidden">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      )}
    </div>
  );
}
