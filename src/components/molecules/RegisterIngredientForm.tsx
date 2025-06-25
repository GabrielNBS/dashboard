'use client';

import Button from '@/components/atoms/Button';
import { CheckIcon } from 'lucide-react';
import IngredientSelector from './IngredientSelector';
import { useProductBuilderContext } from '@/contexts/ProductBuilderContext';
import { useFinalProductListContext } from '@/contexts/FinalProductListContext';
import CategoryList from './CategoryList';

export default function RegisterIngredientForm() {
  const { state: finalProduct, dispatch } = useProductBuilderContext();
  const { state: listState, dispatch: listDispatch } = useFinalProductListContext();

  const total = finalProduct.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
  const lucro = total * 0.2;

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

    // Verifica duplicidade
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
