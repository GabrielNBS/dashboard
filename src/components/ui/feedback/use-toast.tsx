'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastProps = {
  title: string;
  description?: string;
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
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
 * toast({ title: 'Sucesso!', type: 'success' });
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

      <div
        className="fixed top-4 left-4 z-100 flex flex-col gap-2"
        aria-live="polite"
        aria-label="Notificações"
        role="region"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((data) => {
            const { id, title, description, type = 'info' } = data;
            const handleClose = () => removeToast(id);

            // Mapa de cores para evitar muitos if/else
            const colors = {
              success: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800', icon: <CheckCircle className="text-green-500" /> },
              error: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: <XCircle className="text-red-500" /> },
              warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800', icon: <AlertTriangle className="text-yellow-500" /> },
              info: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', icon: <Info className="text-blue-500" /> }
            };

            const theme = colors[type];

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`flex w-full max-w-md bg-white rounded-lg shadow-lg border-l-4 ${theme.border} overflow-hidden mb-3 ml-auto`}
              >
                <div className={`flex items-center justify-center w-12 flex-shrink-0 ${theme.bg}`}>
                  {theme.icon}
                </div>
                <div className="px-4 py-3 flex-1">
                  <p className={`text-sm font-bold ${theme.text}`}>{title}</p>
                  {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
                </div>
                <button onClick={handleClose} className="pr-3 text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
 * toast({ title: 'Erro!', type: 'error' });
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
