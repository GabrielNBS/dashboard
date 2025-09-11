import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para gerenciar estado no localStorage
 *
 * @template T - Tipo do valor armazenado
 * @param key - Chave única para armazenar no localStorage
 * @param initialValue - Valor inicial caso não exista no localStorage
 * @returns [storedValue, setValue] - Valor atual e função para atualizar
 *
 * @example
 * const [user, setUser] = useLocalStorage('user', { name: '', email: '' });
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  /**
   * Função para recuperar valor do localStorage com tratamento de erros
   */
  const getStoredValue = useCallback((): T => {
    // Verifica se está no ambiente do servidor (SSR)
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      const parsedValue = JSON.parse(item);
      return parsedValue;
    } catch (error) {
      console.error(`Erro ao recuperar valor do localStorage para chave "${key}":`, error);
      // Remove o item corrompido do localStorage
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.error('Erro ao remover item corrompido do localStorage:', removeError);
      }
      return initialValue;
    }
  }, [key, initialValue]);

  // Estado inicial
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  /**
   * Função para atualizar o valor no estado e localStorage
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permite passar uma função para atualizar baseado no valor anterior
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Atualiza o estado
        setStoredValue(valueToStore);

        // Atualiza o localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Erro ao salvar valor no localStorage para chave "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Efeito para sincronizar com mudanças externas no localStorage
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(
            `Erro ao processar mudança externa no localStorage para chave "${key}":`,
            error
          );
        }
      }
    };

    // Adiciona listener para mudanças no localStorage
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue] as const;
}
