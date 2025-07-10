'use client';

import Button from '@/components/ui/Button';
import { CheckIcon } from 'lucide-react';

import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { useFinalProductContext } from '@/contexts/products/useFinalProductContext';
import CategoryList from '@/components/ui/CategoryList';
import IngredientSelector from './IngredientSelector';
import Input from '@/components/ui/Input';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function RegisterIngredientForm({ onClose }: { onClose?: () => void }) {
  const { state: finalProduct, dispatch } = useProductBuilderContext();
  const { state: listState, dispatch: listDispatch } = useFinalProductContext();

  //  Estado local para margem customizável
  const [customMargin, setCustomMargin] = useState(33); // % padrão

  //  Cálculos baseados nos ingredientes
  const totalCost = finalProduct.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
  const sellingPrice = totalCost + totalCost * (customMargin / 100);

  // Se for produção em lote, divide o valor total pelo rendimento
  const unitPrice =
    finalProduct.productionMode === 'lote' && (finalProduct.yieldQuantity ?? 0) > 0
      ? sellingPrice / (finalProduct.yieldQuantity ?? 1)
      : sellingPrice;

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

    const isDuplicate = listState.products.some(
      p =>
        p.name.toLowerCase() === finalProduct.name.toLowerCase() &&
        p.category.toLowerCase() === finalProduct.category.toLowerCase()
    );

    if (isDuplicate) {
      alert('Já existe um produto com esse nome e categoria.');
      return;
    }

    // Salva no contexto com o preço sugerido incluído
    listDispatch({
      type: 'ADD_FINAL_PRODUCT',
      payload: {
        ...finalProduct,
        totalCost,
        sellingPrice: unitPrice,
        profitMargin: customMargin,
      },
    });

    dispatch({ type: 'RESET_PRODUCT' });
    if (onClose) onClose();

    toast({
      title: 'Produto adicionado com sucesso!',
      description: `\"${finalProduct.name}\" foi adicionado à lista de produtos.`,
      variant: 'accept',
    });
  };

  return (
    <>
      <h2 className="p-default text-hero-2xl font-bold">Adicionar produto</h2>

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
          <label className="block font-medium">Margem de Lucro (%):</label>
          <Input
            type="number"
            min={0}
            step={1}
            value={customMargin}
            onChange={e => setCustomMargin(Number(e.target.value))}
            className="w-24 rounded border p-2"
          />
        </div>

        <div className="absolute right-32 bottom-10 flex flex-col gap-2">
          <div>
            <span className="text-sm font-semibold">Custo Total:</span>
            <span className="block text-xl">R$ {totalCost.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-sm font-semibold">Preço de Venda Sugerido:</span>
            <span className="block text-xl text-green-700">R$ {unitPrice.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="absolute right-6 bottom-10 h-16 w-16 rounded-full">
          <CheckIcon className="h-10 w-10" strokeWidth={2} />
        </Button>
      </form>
    </>
  );
}
