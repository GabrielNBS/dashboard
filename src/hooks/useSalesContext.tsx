import { useContext } from 'react';
import { SalesContext } from '@/contexts/SalesContext';

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext deve ser usado dentro de SalesProvider');
  }
  return context;
};
