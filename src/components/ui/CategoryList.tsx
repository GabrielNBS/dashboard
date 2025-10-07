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
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        Categoria <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(category => (
          <button
            type="button"
            key={category}
            onClick={() => handleSelect(category)}
            className={`relative rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              state.category === category
                ? 'text-secondary bg-primary shadow-md'
                : 'bg-muted text-muted-foreground hover:contrast-90'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {!state.category && (
        <p className="mt-2 text-xs text-gray-500">Selecione uma categoria para o produto</p>
      )}
    </div>
  );
}
