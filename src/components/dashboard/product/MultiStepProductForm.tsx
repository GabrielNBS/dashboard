import React, { useMemo, createContext, useContext, ReactNode } from 'react';
import { useProductForm } from '@/hooks/useProductForm';
import { Ingredient } from '@/types/ingredients';
import { ProductionMode } from '@/types/products';

import BasicInfoStep from './steps/BasicInfoStep';
import IngredientsStep from './steps/IngredientsStep';
import ProductionStep from './steps/ProductionStep';
import PricingStep from './steps/PricingStep';
import ReviewStep from './steps/ReviewStep';
import {
  ArrowRight,
  Check,
  CheckCheck,
  FileText,
  Salad,
  Factory,
  DollarSign,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/base';

// TAREFA 2: Tipo base unificado para o estado do produto
interface ProductBuilderStateShape {
  name: string;
  category: string;
  image?: string;
  ingredients: Ingredient[];
  production: {
    mode: ProductionMode;
    yieldQuantity: number;
  };
  sellingPrice: string;
  margin: string;
}

// TAREFA 2: StepValidationData herda do tipo base
type StepValidationData = ProductBuilderStateShape;

// TAREFA 2: StepData estende o tipo base com campos adicionais
interface StepData extends ProductBuilderStateShape {
  ingredientsCount: number;
  productionMode: ProductionMode;
  yieldQuantity: number;
  calculations: {
    totalCost: number;
    suggestedPrice: number;
    realProfitMargin: number;
    unitCost: number;
  };
}

// TAREFA 1: Props tipados para todos os step components
interface StepProps {
  data: StepData;
  updateData: (data: Partial<StepData>) => void;
}

// TAREFA 1: StepComponent fortemente tipado com StepProps
type StepComponent = React.ComponentType<StepProps>;

interface StepConfig {
  component: StepComponent;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  validate?: (data: StepValidationData) => boolean;
}

// TAREFA 3: Função utilitária para parse numérico robusto
const parseNumber = (value: string): number | null => {
  if (!value) return null;
  const normalized = value.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

// TAREFA 1: Steps com type assertion - necessário porque cada step tem props específicas
// mas todos são compatíveis com StepProps em runtime (recebem data e updateData)
const STEPS: StepConfig[] = [
  {
    component: BasicInfoStep as StepComponent,
    label: 'Básico',
    icon: FileText,
    description: 'Nome e categoria',
    validate: data => Boolean(data.name && data.category),
  },
  {
    component: IngredientsStep as StepComponent,
    label: 'Ingredientes',
    icon: Salad,
    description: 'Adicionar ingredientes',
    validate: data => data.ingredients.length > 0,
  },
  {
    component: ProductionStep as StepComponent,
    label: 'Produção',
    icon: Factory,
    description: 'Modo de produção',
    validate: data => Boolean(data.production.mode && data.production.yieldQuantity > 0),
  },
  {
    component: PricingStep as StepComponent,
    label: 'Preços',
    icon: DollarSign,
    description: 'Preços e margens',
    // TAREFA 3: Validação com parseNumber robusto
    validate: data => {
      const price = parseNumber(data.sellingPrice);
      const margin = parseNumber(data.margin);
      return price !== null && price > 0 && margin !== null && margin > 0;
    },
  },
  {
    component: ReviewStep as StepComponent,
    label: 'Revisar',
    icon: Eye,
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
  canAdvance: boolean;
  isStepComplete: (stepIndex: number) => boolean;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => void;
  stepProps: StepProps;
  CurrentStepComponent: StepComponent;
  goToStep: (step: number) => void;
}

const MultiStepContext = createContext<MultiStepContextType | undefined>(undefined);

const useMultiStepForm = () => {
  const context = useContext(MultiStepContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepRoot');
  }
  return context;
};

export function MultiStepRoot({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const {
    currentStep,
    isSubmitting,
    isLastStep,
    nextStep,
    prevStep,
    submit,
    builderState,
    tempSellingPrice,
    tempMargin,
    getCalculations,
    updateData,
    isEditMode,
    goToStep,
  } = useProductForm(onClose);

  // Função para verificar se um step está completo
  const isStepComplete = (stepIndex: number): boolean => {
    const step = STEPS[stepIndex];
    if (!step.validate) return true;

    const data: StepValidationData = {
      name: builderState.name,
      category: builderState.category,
      image: builderState.image,
      ingredients: builderState.ingredients,
      production: builderState.production,
      sellingPrice: tempSellingPrice,
      margin: tempMargin,
    };

    return step.validate(data);
  };

  // Verificar se pode avançar para o próximo step
  const canAdvance = isStepComplete(currentStep);

  // TAREFA 4: Progress simplificado sem useMemo
  const stepProgress = ((currentStep + 1) / STEPS.length) * 100;
  const realProgress =
    currentStep === STEPS.length - 1
      ? STEPS.slice(0, -1).every((_, idx) => isStepComplete(idx))
        ? 100
        : stepProgress
      : stepProgress;

  // TAREFA 4: CurrentStepComponent simplificado sem useMemo
  const CurrentStepComponent = STEPS[currentStep].component;

  // TAREFA 5: Cálculos sem memoização - chamada direta
  const calculations = getCalculations();

  // TAREFA 5: stepProps mantém useMemo pois updateData vem de useCallback no hook
  const stepProps: StepProps = useMemo(
    () => ({
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
        calculations,
      },
      updateData,
    }),
    [builderState, tempSellingPrice, tempMargin, calculations, updateData]
  );

  const value: MultiStepContextType = {
    currentStep,
    steps: STEPS,
    progress: realProgress,
    isSubmitting,
    isLastStep,
    isEditMode,
    canAdvance,
    isStepComplete,
    nextStep,
    prevStep,
    submit,
    stepProps,
    CurrentStepComponent,
    goToStep,
  };

  return <MultiStepContext.Provider value={value}>{children}</MultiStepContext.Provider>;
}

export function MultiStepHeader() {
  const { currentStep, steps, progress, isStepComplete, isEditMode, goToStep } = useMultiStepForm();

  const handleStepClick = (index: number) => {
    if (isEditMode && index !== currentStep) {
      goToStep(index);
    }
  };

  return (
    <div className="border-border shrink-0 border-b pb-2 sm:pb-4">
      <div className="mb-2 flex items-center justify-end sm:mb-3">
        <div>
          <div className="text-muted-foreground text-[10px] sm:text-xs">Progresso</div>
          <div className="text-foreground text-xs font-semibold sm:text-sm">
            {currentStep + 1}/{steps.length}
          </div>
        </div>
      </div>

      <div className="mb-2 flex justify-between sm:mb-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep && isStepComplete(index);
          const isCurrent = index === currentStep;
          const hasError = index < currentStep && !isStepComplete(index);
          const isClickable = isEditMode && index !== currentStep;

          return (
            <div
              key={step.label}
              className={`flex flex-1 items-center transition-opacity ${
                isClickable ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              onClick={() => handleStepClick(index)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={e => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  handleStepClick(index);
                }
              }}
            >
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`mb-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:mb-1 sm:h-8 sm:w-8 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : isCompleted
                        ? 'bg-great text-on-great-foreground shadow-md'
                        : hasError
                          ? 'bg-red-500 text-white'
                          : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-xs sm:text-sm">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  ) : (
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </div>
                {/* TAREFA 6: aria-current para step atual */}
                <span
                  className={`text-center text-[10px] font-medium sm:text-xs ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-on-great'
                        : hasError
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 transition-all duration-300 sm:mx-2 ${
                    index < currentStep ? 'bg-great' : 'bg-primary/20'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* TAREFA 6: Barra de progresso com ARIA */}
      <div
        className="bg-muted h-1 w-full rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Progresso do cadastro do produto"
      >
        <div
          className="from-muted to-primary h-1 rounded-full bg-linear-to-r transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function MultiStepContent() {
  const { CurrentStepComponent, stepProps, currentStep } = useMultiStepForm();
  return (
    <div className="h-full">
      <div key={currentStep} className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
        <CurrentStepComponent {...stepProps} />
      </div>
    </div>
  );
}

export function MultiStepFooter() {
  const {
    currentStep,
    isLastStep,
    isSubmitting,
    isEditMode,
    canAdvance,
    nextStep,
    prevStep,
    submit,
  } = useMultiStepForm();

  return (
    <div className="flex justify-between gap-2">
      <Button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 0}
        className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
      >
        Voltar
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className="bg-success text-success-foreground hover:bg-success/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-2 sm:text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="border-success-foreground h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
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
          disabled={!canAdvance}
          title={!canAdvance ? 'Complete os campos obrigatórios' : undefined}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
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
