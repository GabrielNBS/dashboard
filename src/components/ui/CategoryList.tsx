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
            className={`relative rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              state.category === category
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {state.category === category && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-75"></div>
              </div>
            )}
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
