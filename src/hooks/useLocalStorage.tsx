import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  function checkReceivedItem() {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Erro ao recuperar o valor do localStorage', error);
      return initialValue;
    }
  }

  const [storedValue, setStoredValue] = useState<T>(checkReceivedItem);
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar o valor no localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}
