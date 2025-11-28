import { useEffect, useState } from 'react';

//  FASE 2.2: Hook de debounce reutilizável
// Benefício: Previne cálculos excessivos durante digitação rápida
// Reduz chamadas de cálculo de ~10 por segundo para ~1 a cada 300ms
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
