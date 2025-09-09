import { useEffect, useState } from 'react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
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
  calculateSuggestedPrice,
  calculateRealProfitMargin,
  calculateUnitCost,
} from '@/utils/calcSale';

export default function ProductForm() {
  const { state, dispatch } = useProductContext();
  const { productToEdit, products, isEditMode } = state;
  const { state: settingsState } = useSettings();
  const defaultMargin = settingsState.financial.defaultProfitMargin;

  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const finalProduct = builderState;

  const [manualSellingPrice, setManualSellingPrice] = useState(0);
  const [customMargin, setCustomMargin] = useState(defaultMargin);

  // Cálculo de totalCost (mantido aqui, pois é central)
  const totalCost = finalProduct.ingredients.reduce(
    (acc, ing) => acc + (ing.averageUnitPrice * ing.totalQuantity || 0),
    0
  );

  const suggestedPrice = calculateSuggestedPrice(
    totalCost,
    customMargin,
    finalProduct.production.mode,
    finalProduct.production.yieldQuantity
  );

  const realProfitMargin = calculateRealProfitMargin(
    totalCost,
    manualSellingPrice,
    finalProduct.production.mode,
    finalProduct.production.yieldQuantity
  );

  const onClose = () => {
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  useEffect(() => {
    if (productToEdit) {
      // Lógica de edição
      builderDispatch({ type: 'SET_NAME', payload: productToEdit.name });
      builderDispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
      builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.production.mode });
      builderDispatch({
        type: 'SET_YIELD_QUANTITY',
        payload: productToEdit.production.yieldQuantity,
      });
      builderDispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });

      setManualSellingPrice(productToEdit.production.sellingPrice);
      setCustomMargin(productToEdit.production.unitMargin);
    } else {
      builderDispatch({ type: 'RESET_PRODUCT' });
      setManualSellingPrice(0);
      setCustomMargin(defaultMargin);
    }
  }, [productToEdit, builderDispatch, defaultMargin]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!finalProduct.name.trim() || !finalProduct.category.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome e a categoria do produto.',
        variant: 'destructive',
      });
      return;
    }

    if (finalProduct.ingredients.length === 0) {
      toast({
        title: 'Ingredientes necessários',
        description: 'Adicione pelo menos um ingrediente.',
        variant: 'destructive',
      });
      return;
    }

    if (manualSellingPrice <= 0) {
      toast({
        title: 'Preço inválido',
        description: 'Informe um preço de venda válido.',
        variant: 'destructive',
      });
      return;
    }

    const production = {
      ...finalProduct.production,
      totalCost,
      sellingPrice: manualSellingPrice,
      unitSellingPrice:
        finalProduct.production.mode === 'lote'
          ? manualSellingPrice / finalProduct.production.yieldQuantity
          : manualSellingPrice,
      unitMargin: customMargin,
      profitMargin: realProfitMargin,
    };

    const payloadProduct = {
      ...finalProduct,
      production,
      uid: isEditMode && productToEdit ? productToEdit.uid : Date.now().toString(),
    };

    if (isEditMode && productToEdit) {
      dispatch({ type: 'EDIT_PRODUCT', payload: payloadProduct });
      toast({
        title: 'Produto atualizado!',
        description: `"${finalProduct.name}" foi editado com sucesso.`,
        variant: 'accept',
      });
    } else {
      const isDuplicate = products.some(
        p =>
          p.name.toLowerCase() === finalProduct.name.toLowerCase() &&
          p.category.toLowerCase() === finalProduct.category.toLowerCase()
      );

      if (isDuplicate) {
        toast({
          title: 'Produto duplicado',
          description: 'Já existe um produto com esse nome e categoria.',
          variant: 'destructive',
        });
        return;
      }

      dispatch({ type: 'ADD_PRODUCT', payload: payloadProduct });
      toast({
        title: 'Produto adicionado com sucesso!',
        description: `"${finalProduct.name}" foi adicionado à lista de produtos.`,
        variant: 'accept',
      });
    }

    onClose();
  };

  const handleCloseForm = () => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    builderDispatch({ type: 'RESET_PRODUCT' });
    setManualSellingPrice(0);
    setCustomMargin(defaultMargin);
    onClose();
  };

  const unitCost = calculateUnitCost(
    totalCost,
    finalProduct.production.mode,
    finalProduct.production.yieldQuantity
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
          value={finalProduct.name}
          onChange={e => builderDispatch({ type: 'SET_NAME', payload: e.target.value })}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <CategoryList />
      <IngredientSelector />
      <ProductionSelector />
      <PriceAndMarginInputs
        mode={finalProduct.production.mode}
        sellingPrice={manualSellingPrice}
        onSellingPriceChange={setManualSellingPrice}
        margin={customMargin}
        onMarginChange={setCustomMargin}
      />
      <CostPreviews
        unitCost={unitCost}
        suggestedPrice={suggestedPrice}
        realProfitMargin={realProfitMargin}
        mode={finalProduct.production.mode}
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
