import { useContext } from 'react';
import { IngredientContext } from '@/contexts/IngredientContext';

export const useIngredientContext = () => {
  const context = useContext(IngredientContext);
  if (!context) {
    throw new Error('useIngredientContext deve ser usado dentro de IngredientProvider');
  }
  return context;
};
