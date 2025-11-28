/* eslint-disable prettier/prettier */

import React, { useMemo, createContext, useContext, ReactNode } from 'react';
import { useProductForm } from '@/hooks/useProductForm';

// Importar os steps
import BasicInfoStep from './steps/BasicInfoStep';
import IngredientsStep from './steps/IngredientsStep';
import ProductionStep from './steps/ProductionStep';
import PricingStep from './steps/PricingStep';
import ReviewStep from './steps/ReviewStep';
import { ArrowRight, Check, CheckCheck } from 'lucide-react';
import LordIcon from '@/components/ui/LordIcon';
import { Button } from '@/components/ui/base';

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

interface MultiStepContextType {
  currentStep: number;
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

export function MultiStepRoot({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const {
    currentStep,
    isSubmitting,
    isLastStep,
    progress,
    nextStep,
    prevStep,
    submit,
    builderState,
    tempSellingPrice,
    tempMargin,
    getCalculations,
    updateData,
    isEditMode,
  } = useProductForm(onClose);

  const CurrentStepComponent = useMemo(() => {
    return STEPS[currentStep].component;
  }, [currentStep]);

  const stepProps = useMemo(() => {
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
  }, [builderState, tempSellingPrice, tempMargin, getCalculations, updateData]);

  const value = {
    currentStep,
    steps: STEPS,
    progress,
    isSubmitting,
    isLastStep,
    isEditMode,
    nextStep,
    prevStep,
    submit,
    stepProps,
    CurrentStepComponent,
  };

  return <MultiStepContext.Provider value={value}>{children}</MultiStepContext.Provider>;
}

export function MultiStepHeader() {
  const { currentStep, steps, progress } = useMultiStepForm();

  return (
    <div className="shrink-0 border-b border-border pb-2 sm:pb-4">
      <div className="mb-2 flex items-center justify-end sm:mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground sm:text-xs">Progresso</div>
          <div className="text-xs font-semibold text-foreground sm:text-sm">
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
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : index < currentStep
                      ? 'bg-success text-success-foreground shadow-md'
                      : 'bg-muted text-muted-foreground'
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
                      ? 'text-success'
                      : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 transition-all duration-300 sm:mx-2 ${
                  index < currentStep ? 'bg-success' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="h-1 w-full rounded-full bg-muted">
        <div
          className="h-1 rounded-full bg-primary-to-r from-primary to-success transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function MultiStepContent() {
  const { CurrentStepComponent, stepProps } = useMultiStepForm();
  return (
    <div className="h-full">
      <CurrentStepComponent {...stepProps} />
    </div>
  );
}

export function MultiStepFooter() {
  const { currentStep, isLastStep, isSubmitting, isEditMode, nextStep, prevStep, submit } = useMultiStepForm();

  return (
    <div className="flex justify-between gap-2">
      <Button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 0}
        className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
      >
        Voltar
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-success-foreground transition-colors hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-2 sm:text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-success-foreground border-t-transparent" />
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
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
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
