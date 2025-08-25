'use client';

import Button from '@/components/ui/Button';
import { CheckIcon, X } from 'lucide-react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CategoryList from '@/components/ui/CategoryList';
import IngredientSelector from './IngredientSelector';
import Input from '@/components/ui/Input';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useProductContext } from '@/contexts/products/ProductContext';

export default function RegisterIngredientForm({ onClose }: { onClose?: () => void }) {
  const { state: finalProduct, dispatch } = useProductBuilderContext();
  const { state: listState, dispatch: listDispatch } = useProductContext();

  const [customMargin, setCustomMargin] = useState(33);
  const [manualSellingPrice, setManualSellingPrice] = useState(0);

  const { isEditMode, productToEdit } = listState;

  const totalCost = finalProduct.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);

  const suggestedPrice =
    finalProduct.productionMode === 'lote' && (finalProduct.yieldQuantity ?? 0) > 0
      ? (totalCost + totalCost * (customMargin / 100)) / finalProduct.yieldQuantity!
      : totalCost + totalCost * (customMargin / 100);

  const realProfitMargin =
    manualSellingPrice > 0 ? ((manualSellingPrice - totalCost) / totalCost) * 100 : 0;

  // Pré-carrega o formulário se estiver editando
  useEffect(() => {
    if (!isEditMode || !productToEdit) return;
    dispatch({ type: 'SET_NAME', payload: productToEdit.name });
    dispatch({ type: 'SET_CATEGORY', payload: productToEdit.category });
    dispatch({ type: 'SET_PRODUCTION_MODE', payload: productToEdit.productionMode });
    dispatch({ type: 'SET_YIELD_QUANTITY', payload: productToEdit.yieldQuantity ?? 1 });
    dispatch({ type: 'SET_INGREDIENTS', payload: productToEdit.ingredients });

    setManualSellingPrice(productToEdit.sellingPrice ?? 0);
    setCustomMargin(productToEdit.profitMargin ?? 33);
  }, [isEditMode, productToEdit, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!finalProduct.name.trim() || !finalProduct.category.trim()) {
      alert('Preencha o nome e a categoria do produto.');
      return;
    }

    if (finalProduct.ingredients.length === 0) {
      alert('Adicione pelo menos um ingrediente.');
      return;
    }

    if (manualSellingPrice <= 0) {
      alert('Informe um preço de venda válido.');
      return;
    }

    if (isEditMode && productToEdit) {
      listDispatch({
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

      listDispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });

      toast({
        title: 'Produto atualizado!',
        description: `"${finalProduct.name}" foi editado com sucesso.`,
        variant: 'accept',
      });
    } else {
      const isDuplicate = listState.products.some(
        p =>
          p.name.toLowerCase() === finalProduct.name.toLowerCase() &&
          p.category.toLowerCase() === finalProduct.category.toLowerCase()
      );

      if (isDuplicate) {
        alert('Já existe um produto com esse nome e categoria.');
        return;
      }

      listDispatch({
        type: 'ADD_PRODUCT',
        payload: {
          ...finalProduct,
          totalCost,
          sellingPrice: manualSellingPrice,
          profitMargin: realProfitMargin,
        },
      });

      toast({
        title: 'Produto adicionado com sucesso!',
        description: `"${finalProduct.name}" foi adicionado à lista de produtos.`,
        variant: 'accept',
      });
    }

    dispatch({ type: 'RESET_PRODUCT' });
    if (onClose) onClose();
  };

  const handleCloseForm = () => {
    dispatch({ type: 'RESET_PRODUCT' });
    listDispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    if (onClose) onClose();
  };

  return (
    <>
      <h2 className="p-default text-hero-2xl font-bold">
        {isEditMode ? 'Editar produto' : 'Adicionar produto'}
      </h2>

      {isEditMode && productToEdit && (
        <div className="bg-warning text-on-warning rounded p-2 text-sm">
          Editando: <strong>{productToEdit.name}</strong> — qualquer alteração será aplicada ao
          produto existente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome do produto"
          value={finalProduct.name}
          onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })}
          className="rounded border p-2"
        />

        <CategoryList />
        <IngredientSelector />

        <label className="block font-medium">Modo de produção:</label>
        <select
          title="Selecione o modo de produção"
          value={finalProduct.productionMode}
          onChange={e =>
            dispatch({
              type: 'SET_PRODUCTION_MODE',
              payload: e.target.value as 'individual' | 'lote',
            })
          }
          className="w-full rounded border p-2"
        >
          <option value="individual">Individual</option>
          <option value="lote">Lote</option>
        </select>

        {finalProduct.productionMode === 'lote' && (
          <div className="flex items-center gap-4">
            <label className="block font-medium">Rendimento do lote:</label>
            <Input
              type="number"
              value={finalProduct.yieldQuantity}
              min={1}
              placeholder="Quantidade total produzida"
              onChange={e =>
                dispatch({ type: 'SET_YIELD_QUANTITY', payload: Number(e.target.value) })
              }
              className="w-24 rounded border p-2"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="block font-medium">Preço de Venda (R$):</label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={manualSellingPrice}
            onChange={e => setManualSellingPrice(Number(e.target.value))}
            className="w-32 rounded border p-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="block font-medium">Margem Sugerida (%):</label>
          <Input
            type="number"
            min={0}
            step={1}
            value={customMargin}
            onChange={e => setCustomMargin(Number(e.target.value))}
            className="w-24 rounded border p-2"
          />
        </div>

        <div className="absolute right-48 bottom-10 flex gap-8">
          <div>
            <span className="text-sm font-semibold">Custo Total:</span>
            <span className="block text-xl">R$ {totalCost.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-sm font-semibold">Preço Sugerido:</span>
            <span className="text-muted-foreground block text-xl">
              R$ {suggestedPrice.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold">Lucro Real:</span>
            <span className="text-on-great block text-xl">{realProfitMargin.toFixed(2)}%</span>
          </div>
        </div>

        <Button
          type="submit"
          className="absolute right-6 bottom-10 h-16 w-16 rounded-full bg-green-300 hover:bg-green-400"
        >
          <CheckIcon className="h-10 w-10" strokeWidth={2} />
        </Button>
        <Button
          type="button"
          className="absolute right-26 bottom-10 h-16 w-16 rounded-full bg-red-300 hover:bg-red-400"
          onClick={handleCloseForm}
        >
          <X className="h-10 w-10" strokeWidth={2} />
        </Button>
      </form>
    </>
  );
}
