import { useCallback, useMemo, useState, useEffect } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { showValidationToast, showSuccessToast } from '@/components/ui/GenericFormUtils';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';
import { validateStep } from '@/services/productValidation';
import { useWizardNavigation } from './useWizardNavigation';
import { ProductionMode, WizardStep } from '@/types/products';
import { Ingredient } from '@/types/ingredients';

export function useProductForm(onClose: () => void) {
  const { state: productState, dispatch: productDispatch } = useProductContext();
  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const { state: settingsState } = useSettings();
  const { productToEdit, products, isEditMode } = productState;

  const defaultMargin = settingsState?.financial?.defaultProfitMargin ?? 0;
  const [tempSellingPrice, setTempSellingPrice] = useState<string>('');
  const [tempMargin, setTempMargin] = useState<string>(defaultMargin.toString());

  // --- Initialization ---
  useEffect(() => {
    if (productToEdit) {
      builderDispatch({ type: 'SET_NAME', payload: productToEdit.name });
      builderDispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
      if (productToEdit.image) builderDispatch({ type: 'SET_IMAGE', payload: productToEdit.image });
      builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.production.mode });
      builderDispatch({
        type: 'SET_YIELD_QUANTITY',
        payload: productToEdit.production.yieldQuantity,
      });
      builderDispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });
      setTempSellingPrice(productToEdit.production.sellingPrice.toString());
      setTempMargin(productToEdit.production.unitMargin.toString());
    } else {
      builderDispatch({ type: 'RESET_PRODUCT' });
      setTempSellingPrice('');
      setTempMargin((settingsState.financial.defaultProfitMargin ?? 0).toString());
    }
  }, [productToEdit, settingsState, builderDispatch]);

  // --- Calculations ---
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

  // --- Validation ---
  const handleValidateStep = useCallback(
    (step: number): boolean => {
      const data = {
        name: builderState.name,
        category: builderState.category,
        ingredients: builderState.ingredients,
        productionMode: builderState.production.mode,
        yieldQuantity: builderState.production.yieldQuantity,
        margin: tempMargin,
        sellingPrice: tempSellingPrice,
      };

      const error = validateStep(step as WizardStep, data);

      if (error) {
        showValidationToast({
          title: 'Erro de validação',
          description: error.message,
        });
        return false;
      }
      return true;
    },
    [builderState, tempMargin, tempSellingPrice]
  );

  // --- Duplicate Check ---
  const checkForDuplicate = useCallback((): boolean => {
    const normalizeText = (value?: string | null): string => (value ?? '').trim().toLowerCase();
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

  // --- Submission ---
  const handleSubmit = useCallback(async () => {
    if (!isEditMode && checkForDuplicate()) {
      showValidationToast({
        title: 'Produto duplicado',
        description: 'Já existe um produto com esse nome e categoria.',
      });
      return;
    }

    const calculations = getCalculations();
    const sellingPriceValue = parseFloat(tempSellingPrice) || 0;
    const customMarginValue = parseFloat(tempMargin) || 0;
    const isBatch = builderState.production.mode === 'lote';

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
    onClose();
  }, [
    isEditMode,
    checkForDuplicate,
    getCalculations,
    tempSellingPrice,
    tempMargin,
    builderState,
    productToEdit,
    productDispatch,
    builderDispatch,
    onClose,
  ]);

  // --- Wizard Integration ---
  const wizard = useWizardNavigation({
    totalSteps: 5,
    onSubmit: handleSubmit,
    validateStep: handleValidateStep,
  });

  // --- Data Update Handlers ---
  const updateData = useCallback(
    (data: {
      name?: string;
      category?: string;
      image?: string;
      sellingPrice?: string;
      margin?: string;
      productionMode?: ProductionMode;
      yieldQuantity?: number;
      ingredients?: Ingredient[];
    }) => {
      if (data.name !== undefined) builderDispatch({ type: 'SET_NAME', payload: data.name });
      if (data.category !== undefined)
        builderDispatch({ type: 'SET_CATEGORY', payload: data.category });
      if (data.image !== undefined) builderDispatch({ type: 'SET_IMAGE', payload: data.image });
      if (data.sellingPrice !== undefined) setTempSellingPrice(data.sellingPrice);
      if (data.margin !== undefined) setTempMargin(data.margin);
      if (data.productionMode !== undefined)
        builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: data.productionMode });
      if (data.yieldQuantity !== undefined)
        builderDispatch({ type: 'SET_YIELD_QUANTITY', payload: data.yieldQuantity });
    },
    [builderDispatch]
  );

  return {
    ...wizard,
    builderState,
    tempSellingPrice,
    tempMargin,
    getCalculations,
    updateData,
    isEditMode,
  };
}
