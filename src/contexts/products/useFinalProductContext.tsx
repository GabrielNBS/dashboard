import { useContext } from 'react';
import { FinalProductListContext } from '@/contexts/products/FinalProductContext';

export const useFinalProductContext = () => {
  const context = useContext(FinalProductListContext);
  if (!context)
    throw new Error('useFinalProductListContext deve ser usado dentro de FinalProductListProvider');
  return context;
};
