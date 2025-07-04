'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Tipos para o toast
export type ToastVariant = 'default' | 'accept' | 'edit' | 'destructive';

export type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

export type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
}

// ToastProvider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);
  const [id, setId] = useState(0);

  const toast = useCallback(
    (props: ToastProps) => {
      const toastId = id + 1;
      setId(toastId);
      setToasts(prev => [...prev, { ...props, id: toastId }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, props.duration || 3500);
    },
    [id]
  );

  const removeToast = (toastId: number) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Container de toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(({ id, title, description, variant = 'default' }) => (
          <div
            key={id}
            className={`relative flex max-w-xs min-w-[260px] flex-col gap-1 rounded-lg border px-4 py-3 shadow-lg ${
              variant === 'accept'
                ? 'border-green-600 bg-green-400'
                : variant === 'edit'
                  ? 'border-yellow-600 bg-yellow-400'
                  : variant === 'destructive'
                    ? 'border-red-600 bg-red-400'
                    : 'border-accent'
            } `}
          >
            <strong className="text-base font-semibold">{title}</strong>
            {description && <span className="text-sm text-white">{description}</span>}
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-700"
              onClick={() => removeToast(id)}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Função global para uso fora de componentes
let toastFn: ((props: ToastProps) => void) | null = null;
export function toast(props: ToastProps) {
  if (toastFn) toastFn(props);
  else console.warn('ToastProvider não está montado.');
}

// Hook para registrar a função global
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
