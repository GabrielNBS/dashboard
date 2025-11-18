import React from 'react';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import CategoryList from '@/components/ui/CategoryList';
import Input from '@/components/ui/base/Input';
import { Label } from '@/components/ui/base/label';
import { ImageUpload } from '@/components/products/ImageUpload';

interface BasicInfoStepProps {
  data: {
    name: string;
    category: string;
    image?: string;
  };
  updateData: (data: Partial<{ name: string; category: string; image?: string }>) => void;
}

export default function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const { dispatch, state } = useProductBuilderContext();

  const handleNameChange = (name: string) => {
    updateData({ name });
    dispatch({ type: 'SET_NAME', payload: name });
  };

  const handleImageChange = (image: string) => {
    updateData({ image });
    dispatch({ type: 'SET_IMAGE', payload: image });
  };

  // Sincronizar categoria do contexto com o data local
  React.useEffect(() => {
    if (state.category !== data.category) {
      updateData({ category: state.category });
    }
  }, [state.category, data.category, updateData]);

  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-4">
      <div className="mb-4 text-center sm:mb-8">
        <div className="bg-great mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-16 sm:w-16">
          <div className="loader"></div>
        </div>
        <h2 className="text-primary text-lg font-bold sm:text-2xl">Informações básicas</h2>
        <p className="text-muted-foreground mt-1 text-xs sm:mt-2 sm:text-sm">
          Vamos começar com o nome e categoria do seu produto
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <ImageUpload value={data.image} onChange={handleImageChange} />
        </div>

        <div>
          <Label className="text-muted-foreground mb-2 block text-xs font-medium sm:mb-3 sm:text-sm">
            Nome do produto <span className="text-on-bad">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Ex: Bolo de Chocolate..."
            value={data.name}
            onChange={e => handleNameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:px-4 sm:py-3 sm:text-sm"
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
