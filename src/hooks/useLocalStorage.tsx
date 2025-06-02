import { useState, useEffect } from 'react';

// Hook para armazenar e recuperar valores do localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error ao recuperar o valor do localStorage', error);
    }
  }, [key]);

  // Função para salvar o valor no localStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error ao salvar o valor no localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}
