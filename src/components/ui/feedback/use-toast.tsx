'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Button } from '../base';

export type ToastVariant = 'default' | 'accept' | 'edit' | 'destructive';

export type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook para usar o sistema de toast
 *
 * @returns Função para criar toasts
 * @throws Error se usado fora do ToastProvider
 *
 * @example
 * const { toast } = useToast();
 * toast({ title: 'Sucesso!', variant: 'accept' });
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
}

/**
 * Provider do sistema de toast
 *
 * Gerencia o estado dos toasts e fornece a funcionalidade
 * de exibição e remoção automática.
 *
 * @param children - Componentes filhos
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);
  const [id, setId] = useState(0);

  /**
   * Função para criar um novo toast
   */
  const toast = useCallback(
    (props: ToastProps) => {
      const toastId = id + 1;
      setId(toastId);

      // Adiciona o toast à lista
      setToasts(prev => [...prev, { ...props, id: toastId }]);

      // Remove automaticamente após a duração especificada
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, props.duration || 3500);
    },
    [id]
  );

  /**
   * Função para remover um toast manualmente
   */
  const removeToast = (toastId: number) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Container de toasts - posicionado no canto superior direito */}
      <div className="fixed top-4 left-4 z-100 flex flex-col gap-2">
        {toasts.map(({ id, title, description, variant = 'default' }) => (
          <div
            key={id}
            className={`relative flex max-w-xs min-w-[260px] flex-col gap-1 rounded-lg border px-4 py-3 shadow-md ${
              variant === 'accept'
                ? 'bg-great'
                : variant === 'edit'
                  ? 'bg-warning'
                  : variant === 'destructive'
                    ? 'bg-bad'
                    : 'bg-muted'
            } `}
          >
            <strong className="text-base font-semibold">{title}</strong>
            {description && <span className="text-primary text-sm">{description}</span>}

            {/* Botão para fechar o toast */}
            <Button
              className="text-surface hover:bg-muted-foreground absolute top-2 right-2"
              onClick={() => removeToast(id)}
              aria-label="Fechar"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Função global para uso fora de componentes
 *
 * Permite criar toasts de qualquer lugar da aplicação,
 * mesmo fora de componentes React.
 */
let toastFn: ((props: ToastProps) => void) | null = null;

/**
 * Função global para criar toasts
 *
 * @param props - Props do toast
 *
 * @example
 * import { toast } from '@/components/ui/use-toast';
 * toast({ title: 'Erro!', variant: 'destructive' });
 */
export function toast(props: ToastProps) {
  if (toastFn) toastFn(props);
  else console.warn('ToastProvider não está montado.');
}

/**
 * Hook para registrar a função global
 *
 * Deve ser usado dentro do ToastProvider para conectar
 * a função global com o contexto.
 */
export function ToastGlobalRegister() {
  const { toast } = useToast();
  React.useEffect(() => {
    toastFn = toast;
    return () => {
      toastFn = null;
    };
  }, [toast]);
  return null;
}
