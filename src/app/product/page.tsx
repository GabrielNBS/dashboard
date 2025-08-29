'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { CheckCheck, Plus, X } from 'lucide-react';
import ProductsList from '@/components/dashboard/product/ProductsList';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CategoryList from '@/components/ui/CategoryList';
import IngredientSelector from '@/components/dashboard/product/IngredientSelector';
import Input from '@/components/ui/Input';
import { toast } from '@/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSettings } from '@/contexts/settings/SettingsContext';

import {
  calculateSuggestedPrice,
  calculateRealProfitMargin,
  calculateUnitCost,
} from '@/utils/calcSale';

export default function Product() {
  const { state, dispatch } = useProductContext();
  const { productToEdit, products, isEditMode } = state;
  const { state: settingsState } = useSettings();
  const defaultMargin = settingsState.financial.defaultProfitMargin;

  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const finalProduct = builderState;

  const [openForm, setOpenForm] = useState(false);
  const [manualSellingPrice, setManualSellingPrice] = useState(0);
  const [customMargin, setCustomMargin] = useState(defaultMargin);

  // Custo total baseado no priceInStock dos ingredientes (custo proporcional de cada ingrediente usado)
  const totalCost = finalProduct.ingredients.reduce(
    (acc, ing) => acc + (ing.buyPrice * ing.quantity || 0),
    0
  );

  // Calcula preço sugerido baseado no production
  const suggestedPrice = calculateSuggestedPrice(
    totalCost,
    customMargin,
    finalProduct.production.mode,
    finalProduct.production.yieldQuantity
  );

  // Calcula margem real
  const realProfitMargin = calculateRealProfitMargin(
    totalCost,
    manualSellingPrice,
    finalProduct.production.mode,
    finalProduct.production.yieldQuantity
  );

  useEffect(() => {
    if (productToEdit) setOpenForm(true);
  }, [productToEdit]);

  useEffect(() => {
    if (!isEditMode || !productToEdit) return;

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
  }, [isEditMode, productToEdit, builderDispatch]);

  const handleOpenNewForm = () => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    builderDispatch({ type: 'RESET_PRODUCT' });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    builderDispatch({ type: 'RESET_PRODUCT' });
    setOpenForm(false);
    setManualSellingPrice(0);
    setCustomMargin(defaultMargin);
  };

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

    handleCloseForm();
  };

  // Calcula o custo unitário baseado no modo de produção
  const getUnitCost = () => {
    return calculateUnitCost(
      totalCost,
      finalProduct.production.mode,
      finalProduct.production.yieldQuantity
    );
  };

  return (
    <div className="w-full rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Produtos Cadastrados</h2>
        <Button size="md" onClick={handleOpenNewForm}>
          <Plus className="mr-1" />
          Novo Produto
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-muted rounded-lg py-12 text-center">
          <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          <Button size="md" onClick={handleOpenNewForm}>
            Criar Primeiro Produto
          </Button>
        </div>
      ) : (
        <ProductsList />
      )}

      <Sheet open={openForm} onOpenChange={setOpenForm}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="text-center">
            <SheetTitle>{isEditMode ? 'Editar produto' : 'Adicionar produto'}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? 'Atualize as informações do produto existente'
                : 'Preencha as informações para criar um novo produto'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {isEditMode && productToEdit && (
              <div className="bg-warning text-on-warning mb-4 rounded p-2 text-sm">
                Editando: <strong>{productToEdit.name}</strong> — qualquer alteração será aplicada
                ao produto existente.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Campos: nome, categoria, ingredientes, modo de produção, rendimento, preço, margem */}
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

              <div>
                <label className="mb-1 block font-medium">Modo de produção:</label>
                <select
                  title="Selecione o modo de produção"
                  value={finalProduct.production.mode}
                  onChange={e =>
                    builderDispatch({
                      type: 'SET_PRODUCTION_MODE',
                      payload: e.target.value as 'individual' | 'lote',
                    })
                  }
                  className="w-full rounded border p-2"
                  required
                >
                  <option value="individual">Individual</option>
                  <option value="lote">Lote</option>
                </select>
              </div>

              {finalProduct.production.mode === 'lote' && (
                <div>
                  <label className="mb-1 block font-medium">Rendimento do lote:</label>
                  <Input
                    type="number"
                    min={1}
                    value={finalProduct.production.yieldQuantity || 1}
                    onChange={e =>
                      builderDispatch({
                        type: 'SET_YIELD_QUANTITY',
                        payload: Number(e.target.value),
                      })
                    }
                    placeholder="Quantidade total produzida"
                    className="w-full rounded border p-2"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block font-medium">
                  {finalProduct.production.mode === 'lote'
                    ? 'Preço de Venda por Unidade (R$):'
                    : 'Preço de Venda (R$):'}
                </label>
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={manualSellingPrice}
                  onChange={e => setManualSellingPrice(Number(e.target.value))}
                  className="w-full rounded border p-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Margem Sugerida (%):</label>
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={customMargin}
                  onChange={e => setCustomMargin(Number(e.target.value))}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Previews de custo, preço sugerido e margem */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-muted flex flex-col rounded-lg p-3">
                  <span className="mb-1 block text-sm font-semibold">
                    {finalProduct.production.mode === 'individual'
                      ? 'Custo total:'
                      : 'Custo por unidade:'}
                  </span>
                  <span className="text-on-red text-xl font-bold">
                    R$ {getUnitCost().toFixed(2)}
                  </span>
                </div>

                <div className="bg-muted flex flex-col rounded-lg p-3">
                  <span className="mb-1 block text-sm font-semibold">
                    {finalProduct.production.mode === 'individual'
                      ? 'Preço Sugerido:'
                      : 'Preço Sugerido por unidade:'}
                  </span>
                  <span className="text-muted-foreground text-xl font-bold">
                    R$ {suggestedPrice.toFixed(2)}
                  </span>
                </div>

                <div className="bg-muted flex flex-col rounded-lg p-3">
                  <span className="mb-1 block text-sm font-semibold">Margem Real:</span>
                  <span
                    className={`text-xl font-bold ${
                      realProfitMargin >= 0 ? 'text-on-great' : 'text-on-red'
                    }`}
                  >
                    {realProfitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>

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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
