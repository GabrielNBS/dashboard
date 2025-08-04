'use client';

import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';

/**
 * Lista de categorias disponíveis para produtos
 */
const categories = ['Tradicionais', 'Especiais', 'Gourmet', 'Bebidas'];

/**
 * Componente CategoryList - Lista de categorias selecionáveis
 *
 * Permite selecionar uma categoria para o produto sendo construído.
 * A categoria selecionada é destacada visualmente.
 *
 * @example
 * <CategoryList />
 */
export default function CategoryList() {
  const { state, dispatch } = useProductBuilderContext();

  /**
   * Função para selecionar uma categoria
   *
   * @param category - Categoria selecionada
   */
  const handleSelect = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  return (
    <div className="p-default text-paragraph flex gap-4 text-base">
      {categories.map(category => (
        <button
          type="button"
          key={category}
          onClick={() => handleSelect(category)}
          className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
            state.category === category
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
