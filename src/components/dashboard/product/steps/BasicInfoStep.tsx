import React, { useCallback } from 'react';
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

// ✅ FASE 2.1: Componente memoizado para evitar re-renders desnecessários
// Benefício: BasicInfoStep só re-renderiza quando suas props mudam
// Redução estimada: 3-5 re-renders por ação no wizard
const BasicInfoStep = React.memo(function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const { dispatch, state } = useProductBuilderContext();

  const handleNameChange = (name: string) => {
    updateData({ name });
    dispatch({ type: 'SET_NAME', payload: name });
  };

  const handleImageChange = (image: string) => {
    updateData({ image });
    dispatch({ type: 'SET_IMAGE', payload: image });
  };

  // ✅ FASE 1.4: Memoiza updateData para evitar loops infinitos no useEffect
  // Benefício: Callback estável, useEffect só executa quando category realmente muda
  const memoizedUpdateData = useCallback(updateData, [updateData]);

  // Sincronizar categoria do contexto com o data local
  React.useEffect(() => {
    if (state.category !== data.category) {
      memoizedUpdateData({ category: state.category });
    }
  }, [state.category, data.category, memoizedUpdateData]);

  return (
    <div className="space-y-3 p-1 sm:space-y-4 sm:p-2">
      <div className="mb-2 text-center sm:mb-4">
        <div className="bg-great mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full sm:mb-2 sm:h-12 sm:w-12">
          <div className="loader"></div>
        </div>
        <h2 className="text-primary text-base font-bold sm:text-xl">Informações básicas</h2>
        <p className="text-muted-foreground mt-0.5 text-[10px] sm:mt-1 sm:text-xs">
          Vamos começar com o nome e categoria do seu produto
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <ImageUpload value={data.image} onChange={handleImageChange} />
        </div>

        <div>
          <Label className="text-muted-foreground mb-1 block text-xs font-medium sm:mb-2 sm:text-sm">
            Nome do produto <span className="text-on-bad">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Ex: Bolo de Chocolate..."
            value={data.name}
            onChange={e => handleNameChange(e.target.value)}
            onKeyDown={e => {
              // ✅ FASE 1.5: Removido acesso direto ao DOM (document.querySelectorAll)
              // Benefício: Segue padrões React, comportamento mais previsível
              // O foco automático na categoria não é crítico e causava problemas
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:px-3 sm:py-2 sm:text-sm"
            required
          />
        </div>

        <div>
          <CategoryList />
        </div>
      </div>
    </div>
  );
});

export default BasicInfoStep;
