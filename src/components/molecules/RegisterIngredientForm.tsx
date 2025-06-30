'use client';

import Button from '@/components/atoms/Button';
import { CheckIcon } from 'lucide-react';
import IngredientSelector from './IngredientSelector';
import { useProductBuilderContext } from '@/contexts/ProductBuilderContext';
import { useFinalProductListContext } from '@/hooks/useFinalProductListContext';
import CategoryList from './CategoryList';
import Input from '../atoms/Input';

export default function RegisterIngredientForm({ onClose }: { onClose?: () => void }) {
  const { state: finalProduct, dispatch } = useProductBuilderContext();
  const { state: listState, dispatch: listDispatch } = useFinalProductListContext();

  const total = finalProduct.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
  const lucro = total * 0.2;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!finalProduct.name.trim() && !finalProduct.category.trim()) {
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

    // Salva no contexto
    listDispatch({ type: 'ADD_FINAL_PRODUCT', payload: finalProduct });

    // Limpa o formulário
    dispatch({ type: 'RESET_PRODUCT' });
    if (onClose) onClose();

    alert('Produto cadastrado com sucesso!');
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

        <div className="absolute right-32 bottom-10 flex items-center gap-8">
          <div className="flex flex-col">
            <span>Valor Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span>Margem de lucro</span>
            <span>R$ {lucro.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="absolute right-6 bottom-10 h-16 w-16 rounded-full">
          <CheckIcon className="h-10 w-10" strokeWidth={2} />
        </Button>
      </form>
    </>
  );
}
