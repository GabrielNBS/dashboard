import React from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CategoryList from '@/components/ui/CategoryList';
import Input from '@/components/ui/base/Input';
import { Label } from '@/components/ui/base/label';

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
    <div className="space-y-6 p-4">
      <div className="mb-8 text-center">
        <div className="bg-great mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <div className="loader"></div>
        </div>
        <h2 className="text-primary text-2xl font-bold">Informações básicas</h2>
        <p className="text-muted-foreground mt-2">
          Vamos começar com o nome e categoria do seu produto
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-muted-foreground mb-3 block text-sm font-medium">
            Nome do produto <span className="text-on-bad">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Ex: Bolo de Chocolate, Pizza Margherita..."
            value={data.name}
            onChange={e => handleNameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <CategoryList />
        </div>
      </div>
    </div>
  );
}
