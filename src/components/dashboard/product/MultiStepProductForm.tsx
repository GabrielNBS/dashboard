import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
import { Check, CheckCheck } from 'lucide-react';

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

/**
 * DECISÃO: Extrair validações para funções puras
 * RAZÃO: Separar lógica de negócio da UI, facilitar testes e reutilização
 */
const validateBasicInfo = (name: string, category: string): boolean => {
  if (!name?.trim()) {
    showValidationToast({
      title: 'Nome obrigatório',
      description: 'Informe o nome do produto.',
    });
    return false;
  }
  if (!category?.trim()) {
    showValidationToast({
      title: 'Categoria obrigatória',
      description: 'Selecione uma categoria.',
    });
    return false;
  }
  return true;
};

const validateIngredients = (ingredientsCount: number): boolean => {
  if (ingredientsCount === 0) {
    showValidationToast({
      title: 'Ingredientes necessários',
      description: 'Adicione pelo menos um ingrediente.',
    });
    return false;
  }
  return true;
};

const validateProduction = (mode: string | null): boolean => {
  if (!mode) {
    showValidationToast({
      title: 'Modo de produção obrigatório',
      description: 'Selecione o modo de produção.',
    });
    return false;
  }
  return true;
};

const validatePricing = (sellingPrice: number): boolean => {
  if (!sellingPrice || isNaN(sellingPrice) || sellingPrice <= 0) {
    showValidationToast({
      title: 'Preço inválido',
      description: 'Informe um preço válido.',
    });
    return false;
  }
  return true;
};

export default function MultiStepProductForm({ onClose }: MultiStepProductFormProps) {
  const { state: productState, dispatch: productDispatch } = useProductContext();
  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const { state: settingsState } = useSettings();
  const { productToEdit, products, isEditMode } = productState;

  // DECISÃO: Usar useRef para controlar inicialização única
  // RAZÃO: Evita re-inicializações em re-renders e é mais confiável que useState
  const isInitializedRef = useRef(false);

  // DECISÃO: Manter apenas estado de UI no componente
  // RAZÃO: builderState já gerencia os dados do produto. formData duplicava informação
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * DECISÃO: Estado local mínimo para preços (UI temporária)
   * RAZÃO: Preço e margem são editados antes de serem commitados ao builderState
   * Mantemos aqui apenas para controle de input, não como fonte de verdade
   */
  const [tempSellingPrice, setTempSellingPrice] = useState<string>('');
  const [tempMargin, setTempMargin] = useState<string>(
    settingsState.financial.defaultProfitMargin.toString()
  );

  /**
   * DECISÃO: Inicialização em useEffect com array vazio
   * RAZÃO: Garante que rode apenas uma vez na montagem
   * useRef previne re-execuções em re-renders
   */
  useEffect(() => {
    if (!isInitializedRef.current) {
      if (productToEdit) {
        // Modo edição: Popular builderState com dados existentes
        builderDispatch({ type: 'SET_NAME', payload: productToEdit.name });
        builderDispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
        builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.production.mode });
        builderDispatch({
          type: 'SET_YIELD_QUANTITY',
          payload: productToEdit.production.yieldQuantity,
        });
        builderDispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });

        // Popular valores temporários de preço
        setTempSellingPrice(productToEdit.production.sellingPrice.toString());
        setTempMargin(productToEdit.production.unitMargin.toString());
      } else {
        // Modo criação: Reset completo
        builderDispatch({ type: 'RESET_PRODUCT' });
        setTempSellingPrice('');
        setTempMargin(settingsState.financial.defaultProfitMargin.toString());
      }
      isInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vazio intencional - roda apenas na montagem

  /**
   * DECISÃO: Cleanup simplificado sem dependências
   * RAZÃO: Executar apenas na desmontagem, sem causar cleanups intermediários
   */
  useEffect(() => {
    return () => {
      builderDispatch({ type: 'RESET_PRODUCT' });
      isInitializedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * DECISÃO: Memoizar apenas cálculo de custo total
   * RAZÃO: Outros cálculos dependem de inputs temporários, melhor calcular sob demanda
   */
  const totalCost = useMemo(() => {
    return builderState.ingredients.reduce(
      (acc, ing) => acc + (ing.averageUnitPrice * ing.totalQuantity || 0),
      0
    );
  }, [builderState.ingredients]);

  /**
   * DECISÃO: Calcular valores derivados sob demanda
   * RAZÃO: Evita re-cálculos desnecessários e simplifica dependências
   */
  const getCalculations = useCallback(() => {
    const margin = parseFloat(tempMargin) || 0;
    const sellingPrice = parseFloat(tempSellingPrice) || 0;

    return {
      totalCost,
      suggestedPrice: calculateSuggestedPrice(
        totalCost,
        margin,
        builderState.production.mode,
        builderState.production.yieldQuantity
      ),
      realProfitMargin: calculateRealProfitMargin(
        totalCost,
        sellingPrice,
        builderState.production.mode,
        builderState.production.yieldQuantity
      ),
      unitCost: calculateUnitCost(
        totalCost,
        builderState.production.mode,
        builderState.production.yieldQuantity
      ),
    };
  }, [totalCost, tempMargin, tempSellingPrice, builderState.production]);

  /**
   * DECISÃO: Validação via switch case com funções especializadas
   * RAZÃO: Cada step tem suas próprias regras, funções puras são testáveis
   */
  const validateStep = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0:
          return validateBasicInfo(builderState.name, builderState.category);
        case 1:
          return validateIngredients(builderState.ingredients.length);
        case 2:
          return validateProduction(builderState.production.mode);
        case 3:
          return validatePricing(parseFloat(tempSellingPrice));
        default:
          return true;
      }
    },
    [
      builderState.name,
      builderState.category,
      builderState.ingredients.length,
      builderState.production.mode,
      tempSellingPrice,
    ]
  );

  /**
   * DECISÃO: Navegação com validação inline
   * RAZÃO: Simplifica fluxo e garante que só avança com dados válidos
   */
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

  /**
   * DECISÃO: Verificação de duplicatas como função separada
   * RAZÃO: Lógica de negócio isolada, reutilizável e testável
   */
  const checkForDuplicate = useCallback((): boolean => {
    return products.some(
      p =>
        p.name.toLowerCase() === builderState.name.toLowerCase() &&
        p.category.toLowerCase() === builderState.category.toLowerCase() &&
        (!isEditMode || p.uid !== productToEdit?.uid)
    );
  }, [products, builderState.name, builderState.category, isEditMode, productToEdit?.uid]);

  /**
   * DECISÃO: Submit com tratamento de erro detalhado
   * RAZÃO: Capturar e logar erros reais ajuda no debugging
   */
  const handleSubmit = useCallback(async () => {
    // Validação final
    if (!validateStep(currentStep)) return;

    // Verificar duplicatas apenas em modo criação
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

      // DECISÃO: Construir objeto de produção completo aqui
      // RAZÃO: Centraliza lógica de negócio e garante consistência
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

      // Dispatch da ação apropriada
      const action = isEditMode ? 'EDIT_PRODUCT' : 'ADD_PRODUCT';
      productDispatch({ type: action, payload: productPayload });

      // Feedback de sucesso
      showSuccessToast({
        title: isEditMode ? 'Produto atualizado!' : 'Produto adicionado com sucesso!',
        description: isEditMode
          ? `"${builderState.name}" foi editado com sucesso.`
          : `"${builderState.name}" foi adicionado à lista de produtos.`,
      });

      // DECISÃO: Reset completo e fechamento
      // RAZÃO: Limpar estado evita dados residuais em próximas aberturas
      builderDispatch({ type: 'RESET_PRODUCT' });
      isInitializedRef.current = false;
      onClose();
    } catch (error) {
      // DECISÃO: Capturar e logar erro real
      // RAZÃO: Facilita debugging em produção
      console.error('Erro ao salvar produto:', error);
      showValidationToast({
        title: 'Erro ao salvar',
        description:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao salvar o produto. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentStep,
    validateStep,
    isEditMode,
    checkForDuplicate,
    builderState,
    tempSellingPrice,
    tempMargin,
    getCalculations,
    productToEdit,
    productDispatch,
    builderDispatch,
    onClose,
  ]);

  /**
   * DECISÃO: Progresso baseado em (currentStep + 1) / total
   * RAZÃO: No step 0, mostra 20% (1/5). No último step, mostra 100% (5/5)
   * Anterior mostrava 0% no primeiro e 80% no último
   */
  const progress = useMemo(() => {
    return ((currentStep + 1) / STEPS.length) * 100;
  }, [currentStep]);

  /**
   * DECISÃO: Memoizar componente do step atual
   * RAZÃO: Evita re-criação desnecessária do componente
   */
  const CurrentStepComponent = useMemo(() => {
    return STEPS[currentStep].component;
  }, [currentStep]);

  const isLastStep = currentStep === STEPS.length - 1;

  /**
   * DECISÃO: Props wrapper para steps
   * RAZÃO: Encapsula lógica de atualização e fornece interface consistente
   */
  const stepProps = useMemo(() => {
    const updateData = (data: Record<string, unknown>) => {
      // Atualizar dados baseado no step atual
      if (data.name !== undefined) {
        builderDispatch({ type: 'SET_NAME', payload: data.name as string });
      }
      if (data.category !== undefined) {
        builderDispatch({ type: 'SET_CATEGORY', payload: data.category as string });
      }
      if (data.sellingPrice !== undefined) {
        setTempSellingPrice(data.sellingPrice as string);
      }
      if (data.margin !== undefined) {
        setTempMargin(data.margin as string);
      }
      if (data.productionMode !== undefined) {
        builderDispatch({
          type: 'SET_PRODUCTION_MODE',
          payload: data.productionMode as ProductionMode,
        });
      }
      if (data.yieldQuantity !== undefined) {
        builderDispatch({ type: 'SET_YIELD_QUANTITY', payload: data.yieldQuantity as number });
      }
    };

    return {
      data: {
        name: builderState.name,
        category: builderState.category,
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
  }, [
    builderState.name,
    builderState.category,
    builderState.ingredients,
    builderState.production,
    tempSellingPrice,
    tempMargin,
    builderDispatch,
    getCalculations,
  ]);

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
                      ? 'bg-primary text-secondary shadow-lg'
                      : index < currentStep
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <span className="text-sm">
                      <Check />
                    </span>
                  ) : (
                    <span className="text-sm">{step.icon}</span>
                  )}
                </div>
                <span
                  className={`text-center text-xs font-medium ${
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
          <CurrentStepComponent {...stepProps} />
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
                  <span>
                    <CheckCheck />
                  </span>
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
