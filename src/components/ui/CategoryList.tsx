'use client';

import { useProductBuilderContext } from '@/contexts/ProductBuilderContext';

const categories = ['Tradicionais', 'Especiais', 'Gourmet', 'Bebidas'];

export default function CategoryList() {
  const { state, dispatch } = useProductBuilderContext();

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
          className={`rounded px-4 py-2 text-sm font-medium ${
            state.category === category ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
