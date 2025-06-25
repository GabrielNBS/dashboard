import { useContext } from 'react';
import { FinalProductListContext } from '@/contexts/FinalProductListContext';

export const useFinalProductListContext = () => {
  const context = useContext(FinalProductListContext);
  if (!context)
    throw new Error('useFinalProductListContext deve ser usado dentro de FinalProductListProvider');
  return context;
};
