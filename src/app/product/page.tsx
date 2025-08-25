'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import ProductsList from '@/components/dashboard/product/ProductsList';
import { useProductContext } from '@/contexts/products/ProductContext';
import { CheckIcon, X } from 'lucide-react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CategoryList from '@/components/ui/CategoryList';
import Input from '@/components/ui/Input';
import { toast } from '@/components/ui/use-toast';
import IngredientSelector from '@/components/dashboard/product/IngredientSelector';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function Product() {
  const [openForm, setOpenForm] = useState(false);
  const [customMargin, setCustomMargin] = useState(33);
  const [manualSellingPrice, setManualSellingPrice] = useState(0);

  const { state, dispatch } = useProductContext();
  const { productToEdit, products, isEditMode } = state;

  const { state: builderState, dispatch: builderDispatch } = useProductBuilderContext();
  const finalProduct = builderState;

  // Calcular custo total
  const totalCost = finalProduct.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);

  // Calcular preço sugerido
  const suggestedPrice =
    finalProduct.productionMode === 'lote' && (finalProduct.yieldQuantity ?? 0) > 0
      ? (totalCost + totalCost * (customMargin / 100)) / finalProduct.yieldQuantity!
      : totalCost + totalCost * (customMargin / 100);

  // Calcular margem de lucro real
  const realProfitMargin =
    manualSellingPrice > 0 ? ((manualSellingPrice - totalCost) / manualSellingPrice) * 100 : 0;

  // Abrir formulário quando houver produto para editar
  useEffect(() => {
    if (productToEdit) {
      setOpenForm(true);
    }
  }, [productToEdit]);

  // Pré-carrega o formulário se estiver editando
  useEffect(() => {
    if (!isEditMode || !productToEdit) return;

    builderDispatch({ type: 'SET_NAME', payload: productToEdit.name });
    builderDispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
    builderDispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.productionMode });
    builderDispatch({ type: 'SET_YIELD_QUANTITY', payload: productToEdit.yieldQuantity ?? 1 });
    builderDispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });

    setManualSellingPrice(productToEdit.sellingPrice ?? 0);
    setCustomMargin(productToEdit.profitMargin ?? 33);
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
    setCustomMargin(33);
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

    if (isEditMode && productToEdit) {
      // Modo edição
      dispatch({
        type: 'EDIT_PRODUCT',
        payload: {
          ...productToEdit,
          ...finalProduct,
          totalCost,
          sellingPrice: manualSellingPrice,
          profitMargin: realProfitMargin,
          uid: productToEdit.uid,
        },
      });

      toast({
        title: 'Produto atualizado!',
        description: `"${finalProduct.name}" foi editado com sucesso.`,
        variant: 'accept',
      });
    } else {
      // Modo criação
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

      dispatch({
        type: 'ADD_PRODUCT',
        payload: {
          ...finalProduct,
          totalCost,
          sellingPrice: manualSellingPrice,
          profitMargin: realProfitMargin,
          uid: Date.now().toString(),
        },
      });

      toast({
        title: 'Produto adicionado com sucesso!',
        description: `"${finalProduct.name}" foi adicionado à lista de produtos.`,
        variant: 'accept',
      });
    }

    handleCloseForm();
  };

  return (
    <div className="w-full rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Produtos Cadastrados</h2>
        <Button size="md" onClick={handleOpenNewForm} className="fixed right-15 bottom-4 z-10">
          <Plus className="mr-1" />
          Novo Produto
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-muted rounded-lg py-12 text-center">
          <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          <Button size="md" onClick={handleOpenNewForm} className="fixed right-15 bottom-4 z-10">
            Criar Primeiro Produto
          </Button>
        </div>
      ) : (
        <ProductsList />
      )}

      <Sheet open={openForm} onOpenChange={setOpenForm}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
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
                  title="Modo de produção"
                  value={finalProduct.productionMode}
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

              {finalProduct.productionMode === 'lote' && (
                <div>
                  <label className="mb-1 block font-medium">Rendimento do lote:</label>
                  <Input
                    type="number"
                    value={finalProduct.yieldQuantity || 1}
                    min={1}
                    placeholder="Quantidade total produzida"
                    onChange={e =>
                      builderDispatch({
                        type: 'SET_YIELD_QUANTITY',
                        payload: Number(e.target.value),
                      })
                    }
                    className="w-full rounded border p-2"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block font-medium">Preço de Venda (R$):</label>
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
                  step={1}
                  value={customMargin}
                  onChange={e => setCustomMargin(Number(e.target.value))}
                  className="w-full rounded border p-2"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-muted rounded-lg p-3">
                  <span className="mb-1 block text-sm font-semibold">Custo Total:</span>
                  <span className="text-on-red text-xl font-bold">R$ {totalCost.toFixed(2)}</span>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <span className="mb-1 block text-sm font-semibold">Preço Sugerido:</span>
                  <span className="text-muted-foreground text-xl font-bold">
                    R$ {suggestedPrice.toFixed(2)}
                  </span>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <span className="mb-1 block text-sm font-semibold">Margem Real:</span>
                  <span
                    className={`text-xl font-bold ${realProfitMargin >= 0 ? 'text-on-great' : 'text-on-red'}`}
                  >
                    {realProfitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-on-great hover:bg-great-hover flex items-center gap-2"
                >
                  <CheckIcon className="h-5 w-5" />
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
