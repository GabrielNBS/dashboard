import React from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CategoryList from '@/components/ui/CategoryList';

interface BasicInfoStepProps {
  data: {
    name: string;
    category: string;
  };
  updateData: (data: Partial<{ name: string; category: string }>) => void;
}

export default function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const { dispatch, state } = useProductBuilderContext();

  const handleNameChange = (name: string) => {
    updateData({ name });
    dispatch({ type: 'SET_NAME', payload: name });
  };

  // Sincronizar categoria do contexto com o data local
  React.useEffect(() => {
    if (state.category !== data.category) {
      updateData({ category: state.category });
    }
  }, [state.category, data.category, updateData]);

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <div className="loader"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Informações Básicas</h2>
        <p className="mt-2 text-gray-600">Vamos começar com o nome e categoria do seu produto</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Nome do produto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Bolo de Chocolate, Pizza Margherita..."
            value={data.name}
            onChange={e => handleNameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
          {data.name && <p className="mt-2 text-sm text-green-600">✓ Nome definido</p>}
        </div>

        <div>
          <CategoryList />
          {data.category && (
            <p className="mt-2 text-sm text-green-600">✓ Categoria selecionada: {data.category}</p>
          )}
        </div>
      </div>
    </div>
  );
}
