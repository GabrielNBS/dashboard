import { useEffect, useState, useCallback, useMemo } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import {
  ProductBuilderAction,
  useProductBuilderContext,
} from '@/contexts/products/ProductBuilderContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { toast } from '@/components/ui/feedback/use-toast';
import Button from '@/components/ui/base/Button';
import { CheckCheck, X } from 'lucide-react';
import CategoryList from '@/components/ui/CategoryList';
import IngredientSelector from '@/components/dashboard/product/IngredientSelector';
import ProductionSelector from '@/components/dashboard/product/ProductionSelector';
import PriceAndMarginInputs from '@/components/dashboard/product/PriceAndMarginInputs';
import CostPreviews from '@/components/dashboard/product/CostPreviews';
import {
  calculateRealProfitMargin,
  calculateSuggestedPrice,
  calculateUnitCost,
} from '@/utils/calculations';

// Constantes para evitar re-criação
const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: {
    title: 'Campos obrigatórios',
    description: 'Preencha o nome e a categoria do produto.',
  },
  NO_INGREDIENTS: {
    title: 'Ingredientes necessários',
    description: 'Adicione pelo menos um ingrediente.',
  },
  INVALID_PRICE: {
    title: 'Preço inválido',
    description: 'Informe um preço de venda válido.',
  },
  DUPLICATE_PRODUCT: {
    title: 'Produto duplicado',
    description: 'Já existe um produto com esse nome e categoria.',
  },
} as const;

export default function ProductForm() {
  const { state, dispatch } = useProductContext();
  const { productToEdit, products, isEditMode } = state;
  const { state: settingsState } = useSettings();
  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();

  const [manualSellingPrice, setManualSellingPrice] = useState(0);
  const defaultMargin = settingsState.financial.defaultProfitMargin;
  const [customMargin, setCustomMargin] = useState(defaultMargin);

  // Memoização dos cálculos pesados
  const calculations = useMemo(() => {
    const totalCost = builderState.ingredients.reduce(
      (acc, ing) => acc + (ing.averageUnitPrice * ing.totalQuantity || 0),
      0
    );

    const suggestedPrice = calculateSuggestedPrice(
      totalCost,
      customMargin,
      builderState.production.mode,
      builderState.production.yieldQuantity
    );

    const realProfitMargin = calculateRealProfitMargin(
      totalCost,
      manualSellingPrice,
      builderState.production.mode,
      builderState.production.yieldQuantity
    );

    const unitCost = calculateUnitCost(
      totalCost,
      builderState.production.mode,
      builderState.production.yieldQuantity
    );

    return {
      totalCost,
      suggestedPrice,
      realProfitMargin,
      unitCost,
    };
  }, [
    builderState.ingredients,
    builderState.production.mode,
    builderState.production.yieldQuantity,
    customMargin,
    manualSellingPrice,
  ]);

  // Função de validação extraída
  const validateForm = useCallback(() => {
    if (!builderState.name.trim() || !builderState.category.trim()) {
      toast({ ...VALIDATION_MESSAGES.REQUIRED_FIELDS, variant: 'destructive' });
      return false;
    }

    if (builderState.ingredients.length === 0) {
      toast({ ...VALIDATION_MESSAGES.NO_INGREDIENTS, variant: 'destructive' });
      return false;
    }

    if (manualSellingPrice <= 0) {
      toast({ ...VALIDATION_MESSAGES.INVALID_PRICE, variant: 'destructive' });
      return false;
    }

    return true;
  }, [builderState.name, builderState.category, builderState.ingredients, manualSellingPrice]);

  const checkForDuplicate = useCallback(() => {
    return products.some(
      p =>
        p.name.toLowerCase() === builderState.name.toLowerCase() &&
        p.category.toLowerCase() === builderState.category.toLowerCase()
    );
  }, [products, builderState.name, builderState.category]);

  const resetForm = useCallback(() => {
    builderDispatch({ type: 'RESET_PRODUCT' });
    setManualSellingPrice(0);
    setCustomMargin(defaultMargin);
  }, [builderDispatch, defaultMargin]);

  const setupFormForEdit = useCallback(() => {
    if (!productToEdit) return;

    const actions: ProductBuilderAction[] = [
      { type: 'SET_NAME', payload: productToEdit.name },
      { type: 'SET_CATEGORY', payload: productToEdit.category },
      { type: 'SET_PRODUCTION_MODE', payload: productToEdit.production.mode },
      { type: 'SET_YIELD_QUANTITY', payload: productToEdit.production.yieldQuantity },
      { type: 'SET_INGREDIENTS', payload: productToEdit.ingredients },
    ];

    actions.forEach(action => builderDispatch(action));
    setManualSellingPrice(productToEdit.production.sellingPrice);
    setCustomMargin(productToEdit.production.unitMargin);
  }, [productToEdit, builderDispatch]);

  // Criação do payload do produto
  const createProductPayload = useCallback(() => {
    const production = {
      ...builderState.production,
      totalCost: calculations.totalCost,
      sellingPrice: manualSellingPrice,
      unitSellingPrice:
        builderState.production.mode === 'lote'
          ? manualSellingPrice / builderState.production.yieldQuantity
          : manualSellingPrice,
      unitMargin: customMargin,
      profitMargin: calculations.realProfitMargin,
    };

    return {
      ...builderState,
      production,
      uid: isEditMode && productToEdit ? productToEdit.uid : Date.now().toString(),
    };
  }, [builderState, calculations, manualSellingPrice, customMargin, isEditMode, productToEdit]);

  const handleCloseForm = useCallback(() => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    resetForm();
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  }, [dispatch, resetForm]);

  // Effect otimizado
  useEffect(() => {
    if (productToEdit) {
      setupFormForEdit();
    } else {
      resetForm();
    }
  }, [productToEdit, setupFormForEdit, resetForm]);

  // Handler de submit otimizado
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Verificação de duplicata apenas para novos produtos
      if (!isEditMode && checkForDuplicate()) {
        toast({ ...VALIDATION_MESSAGES.DUPLICATE_PRODUCT, variant: 'destructive' });
        return;
      }

      const productPayload = createProductPayload();
      const action = isEditMode ? 'EDIT_PRODUCT' : 'ADD_PRODUCT';
      const successMessage = isEditMode
        ? `"${builderState.name}" foi editado com sucesso.`
        : `"${builderState.name}" foi adicionado à lista de produtos.`;

      dispatch({ type: action, payload: productPayload });

      toast({
        title: isEditMode ? 'Produto atualizado!' : 'Produto adicionado com sucesso!',
        description: successMessage,
        variant: 'accept',
      });

      handleCloseForm();
    },
    [
      validateForm,
      isEditMode,
      checkForDuplicate,
      createProductPayload,
      builderState.name,
      dispatch,
      handleCloseForm,
    ]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isEditMode && productToEdit && (
        <div className="bg-warning text-on-warning mb-4 rounded p-2 text-sm">
          Editando: <strong>{productToEdit.name}</strong> — qualquer alteração será aplicada ao
          produto existente.
        </div>
      )}

      <div>
        <label className="mb-1 block font-medium">Nome do produto:</label>
        <input
          type="text"
          placeholder="Nome do produto"
          value={builderState.name}
          onChange={e => builderDispatch({ type: 'SET_NAME', payload: e.target.value })}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <CategoryList />
      <IngredientSelector />
      <ProductionSelector />

      <PriceAndMarginInputs
        mode={builderState.production.mode}
        sellingPrice={manualSellingPrice}
        onSellingPriceChange={setManualSellingPrice}
        margin={customMargin}
        onMarginChange={setCustomMargin}
      />

      <CostPreviews
        unitCost={calculations.unitCost}
        suggestedPrice={calculations.suggestedPrice}
        realProfitMargin={calculations.realProfitMargin}
        mode={builderState.production.mode}
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleCloseForm}>
          <X className="h-5 w-5" />
          Cancelar
        </Button>
        <Button type="submit" variant="accept">
          <CheckCheck className="h-5 w-5" />
          {isEditMode ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}
