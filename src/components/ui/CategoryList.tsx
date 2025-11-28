'use client';

import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import Button from '@/components/ui/base/Button';
import { Label } from '@/components/ui/base/label';

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
      <Label className="text-foreground mb-3 block text-sm font-medium">
        Categoria <span className="text-destructive">*</span>
      </Label>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(category => (
          <Button
            type="button"
            key={category}
            onClick={() => handleSelect(category)}
            variant={state.category === category ? 'default' : 'outline'}
            size="md"
            data-category-button
            className={`relative rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              state.category === category
                ? 'text-secondary bg-primary shadow-md'
                : 'bg-muted text-muted-foreground hover:contrast-90'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
