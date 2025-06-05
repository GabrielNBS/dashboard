import { useContext } from 'react';
import { ProductContext } from '@/context/store';

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext deve ser usado dentro de ProductProvider');
  }
  return context;
};
