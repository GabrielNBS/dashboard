import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook customizado para gerenciar estado no localStorage com debounce
 *
 * @template T - Tipo do valor armazenado
 * @param key - Chave única para armazenar no localStorage
 * @param initialValue - Valor inicial caso não exista no localStorage
 * @param debounceMs - Tempo de debounce em ms (padrão: 300ms)
 * @returns [storedValue, setValue] - Valor atual e função para atualizar
 *
 * @example
 * const [user, setUser] = useLocalStorage('user', { name: '', email: '' });
 * const [sales, setSales] = useLocalStorage('sales', [], 500); // 500ms debounce
 */
export function useLocalStorage<T>(key: string, initialValue: T, debounceMs: number = 300) {
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
  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue());

  // Ref para debounce
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Função para atualizar o valor no estado e localStorage (com debounce)
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Use functional update to avoid dependency on storedValue
        setStoredValue(prevValue => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;

          // Limpar timeout anterior
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Debounce para salvar no localStorage
          timeoutRef.current = setTimeout(() => {
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(key, JSON.stringify(valueToStore));
              } catch (error) {
                console.error(`Erro ao salvar valor no localStorage para chave "${key}":`, error);
              }
            }
          }, debounceMs);

          return valueToStore;
        });
      } catch (error) {
        console.error(`Erro ao processar valor para chave "${key}":`, error);
      }
    },
    [key, debounceMs]
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

  /**
   * Cleanup do timeout ao desmontar
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        // Salvar imediatamente ao desmontar para não perder dados
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(key, JSON.stringify(storedValue));
          } catch (error) {
            console.error(`Erro ao salvar valor final no localStorage para chave "${key}":`, error);
          }
        }
      }
    };
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
