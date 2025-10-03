import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { showValidationToast, showSuccessToast } from '@/components/ui/GenericFormUtils';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';

// Importar os steps
import BasicInfoStep from './steps/BasicInfoStep';
import IngredientsStep from './steps/IngredientsStep';
import ProductionStep from './steps/ProductionStep';
import PricingStep from './steps/PricingStep';
import ReviewStep from './steps/ReviewStep';

// Configuração dos steps
const STEPS = [
  {
    component: BasicInfoStep,
    label: 'Básico',
    icon: '📝',
    description: 'Nome e categoria',
  },
  {
    component: IngredientsStep,
    label: 'Ingredientes',
    icon: '🥘',
    description: 'Adicionar ingredientes',
  },
  {
    component: ProductionStep,
    label: 'Produção',
    icon: '⚙️',
    description: 'Modo de produção',
  },
  {
    component: PricingStep,
    label: 'Preços',
    icon: '💰',
    description: 'Preços e margens',
  },
  {
    component: ReviewStep,
    label: 'Revisar',
    icon: '✅',
    description: 'Confirmar dados',
  },
];

interface MultiStepProductFormProps {
  onClose: () => void;
}

export default function MultiStepProductForm({ onClose }: MultiStepProductFormProps) {
  const { state: productState, dispatch: productDispatch } = useProductContext();
  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const { state: settingsState } = useSettings();
  const { productToEdit, products, isEditMode } = productState;

  // Estado do multi-step
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Estado centralizado do formulário
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    ingredientsCount: 0,
    productionMode: '' as 'individual' | 'lote' | '',
    yieldQuantity: 1,
    sellingPrice: '',
    margin: settingsState.financial.defaultProfitMargin.toString(),
  });

  // Função para atualizar dados
  const updateData = useCallback((newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);

  // Reset quando o componente é desmontado ou quando sai do modo de edição
  useEffect(() => {
    return () => {
      setIsInitialized(false);
      // Reset completo do builder context ao desmontar
      builderDispatch({ type: 'RESET_PRODUCT' });
    };
  }, [builderDispatch]);

  // Inicialização do formulário - executa apenas uma vez quando o componente monta
  useEffect(() => {
    if (!isInitialized) {
      if (productToEdit) {
        // Modo de edição - carregar dados existentes
        setFormData({
          name: productToEdit.name,
          category: productToEdit.category,
          ingredientsCount: productToEdit.ingredients.length,
          productionMode: productToEdit.production.mode,
          yieldQuantity: productToEdit.production.yieldQuantity,
          sellingPrice: productToEdit.production.sellingPrice.toString(),
          margin: productToEdit.production.unitMargin.toString(),
        });

        // Configurar builder context com dados existentes
        builderDispatch({ type: 'SET_NAME', payload: productToEdit.name });
        builderDispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
        builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.production.mode });
        builderDispatch({
          type: 'SET_YIELD_QUANTITY',
          payload: productToEdit.production.yieldQuantity,
        });
        builderDispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });
      } else {
        // Modo de criação - garantir reset completo
        setCurrentStep(0);
        builderDispatch({ type: 'RESET_PRODUCT' });
        setFormData({
          name: '',
          category: '',
          ingredientsCount: 0,
          productionMode: '',
          yieldQuantity: 1,
          sellingPrice: '',
          margin: settingsState.financial.defaultProfitMargin.toString(),
        });
      }
      setIsInitialized(true);
    }
  }, [productToEdit, isInitialized, builderDispatch, settingsState.financial.defaultProfitMargin]);

  // Cálculos
  const calculations = useMemo(() => {
    const totalCost = builderState.ingredients.reduce(
      (acc, ing) => acc + (ing.averageUnitPrice * ing.totalQuantity || 0),
      0
    );

    const suggestedPrice = calculateSuggestedPrice(
      totalCost,
      parseFloat(formData.margin) || 0,
      builderState.production.mode,
      builderState.production.yieldQuantity
    );

    const realProfitMargin = calculateRealProfitMargin(
      totalCost,
      parseFloat(formData.sellingPrice) || 0,
      builderState.production.mode,
      builderState.production.yieldQuantity
    );

    const unitCost = calculateUnitCost(
      totalCost,
      builderState.production.mode,
      builderState.production.yieldQuantity
    );

    return { totalCost, suggestedPrice, realProfitMargin, unitCost };
  }, [builderState.ingredients, builderState.production, formData.margin, formData.sellingPrice]);

  // Validação por step
  const validateStep = useCallback(
    (step: number) => {
      switch (step) {
        case 0: // Básico
          if (!formData.name.trim()) {
            showValidationToast({
              title: 'Nome obrigatório',
              description: 'Informe o nome do produto.',
            });
            return false;
          }
          if (!formData.category.trim()) {
            showValidationToast({
              title: 'Categoria obrigatória',
              description: 'Selecione uma categoria.',
            });
            return false;
          }
          return true;

        case 1: // Ingredientes
          if (builderState.ingredients.length === 0) {
            showValidationToast({
              title: 'Ingredientes necessários',
              description: 'Adicione pelo menos um ingrediente.',
            });
            return false;
          }
          return true;

        case 2: // Produção
          if (!builderState.production.mode) {
            showValidationToast({
              title: 'Modo de produção obrigatório',
              description: 'Selecione o modo de produção.',
            });
            return false;
          }
          return true;

        case 3: // Preços
          const priceValue = parseFloat(formData.sellingPrice);
          if (!formData.sellingPrice || isNaN(priceValue) || priceValue <= 0) {
            showValidationToast({
              title: 'Preço inválido',
              description: 'Informe um preço válido.',
            });
            return false;
          }
          return true;

        default:
          return true;
      }
    },
    [formData, builderState]
  );

  // Navegação
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Verificar duplicatas
  const checkForDuplicate = useCallback(() => {
    return products.some(
      p =>
        p.name.toLowerCase() === formData.name.toLowerCase() &&
        p.category.toLowerCase() === formData.category.toLowerCase() &&
        (!isEditMode || p.uid !== productToEdit?.uid)
    );
  }, [products, formData.name, formData.category, isEditMode, productToEdit]);

  // Submit final
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
      const sellingPriceValue = parseFloat(formData.sellingPrice) || 0;
      const customMarginValue = parseFloat(formData.margin) || 0;

      const production = {
        ...builderState.production,
        totalCost: calculations.totalCost,
        sellingPrice: sellingPriceValue,
        unitSellingPrice:
          builderState.production.mode === 'lote'
            ? sellingPriceValue / builderState.production.yieldQuantity
            : sellingPriceValue,
        unitMargin: customMarginValue,
        profitMargin: calculations.realProfitMargin,
      };

      const productPayload = {
        ...builderState,
        production,
        uid: isEditMode && productToEdit ? productToEdit.uid : Date.now().toString(),
      };

      const action = isEditMode ? 'EDIT_PRODUCT' : 'ADD_PRODUCT';
      const successMessage = isEditMode
        ? `"${formData.name}" foi editado com sucesso.`
        : `"${formData.name}" foi adicionado à lista de produtos.`;

      productDispatch({ type: action, payload: productPayload });

      showSuccessToast({
        title: isEditMode ? 'Produto atualizado!' : 'Produto adicionado com sucesso!',
        description: successMessage,
      });

      // Reset completo após sucesso
      setCurrentStep(0);
      setIsInitialized(false);
      builderDispatch({ type: 'RESET_PRODUCT' });
      onClose();
    } catch {
      showValidationToast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar o produto. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentStep,
    validateStep,
    isEditMode,
    checkForDuplicate,
    formData,
    builderState,
    calculations,
    productToEdit,
    productDispatch,
    builderDispatch,
    onClose,
  ]);

  // Calcular progresso baseado apenas no step atual
  // A barra vai até o início do step atual, não até o final
  const progress = useMemo(() => {
    return (currentStep / STEPS.length) * 100;
  }, [currentStep]);

  // Renderização
  const CurrentStepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="flex h-full max-h-[calc(100dvh-8rem)] flex-col overflow-hidden">
      {/* Header com progresso - altura fixa */}
      <div className="flex-shrink-0 border-b border-gray-200 pb-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{STEPS[currentStep].description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Progresso</div>
            <div className="text-sm font-semibold text-gray-900">
              {currentStep + 1}/{STEPS.length}
            </div>
          </div>
        </div>

        {/* Indicador de steps - compacto */}
        <div className="mb-3 flex justify-between">
          {STEPS.map((step, index) => (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : index < currentStep
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <span className="text-sm">{step.icon}</span>
                  )}
                </div>
                <span
                  className={`text-center text-xs font-medium ${
                    index === currentStep
                      ? 'text-blue-600'
                      : index < currentStep
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all duration-300 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Barra de progresso - compacta */}
        <div className="h-1 w-full rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Conteúdo do step atual - área flexível com scroll controlado */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="h-full">
          <CurrentStepComponent data={formData} updateData={updateData} />
        </div>
      </div>

      {/* Botões de navegação - altura fixa */}
      <div className="flex-shrink-0 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Voltar
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  <span>✅</span>
                  {isEditMode ? 'Atualizar Produto' : 'Criar Produto'}
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Próximo
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
