import React, { useId } from 'react';
import { cn } from '@/utils/utils';

/**
 * Props do componente Input
 *
 * Estende as propriedades nativas do elemento input HTML
 * e adiciona propriedades para label e mensagem de erro.
 */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label do campo */
  label?: string;
  /** Mensagem de erro a ser exibida */
  error?: string;
  /** Variante do tamanho do input */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente Input - Campo de entrada customizável
 *
 * Suporta label, mensagem de erro e todas as propriedades
 * nativas do elemento input HTML.
 *
 * @param label - Label do campo (opcional)
 * @param error - Mensagem de erro (opcional)
 * @param size - Tamanho do input (sm, md, lg)
 * @param className - Classes CSS adicionais
 * @param props - Demais propriedades do elemento input
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Digite seu email"
 *   error="Email inválido"
 *   size="md"
 * />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, size = 'md', className, id, ...props }, ref) => {
    const generatedId = useId();

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-4 py-4 text-base',
    };

    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-foreground mb-1 block text-sm font-medium">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border transition-colors',
            'text-foreground placeholder:text-muted-foreground',
            'border-border bg-background',
            'focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            sizeClasses[size],
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />

        {error && (
          <span id={errorId} className="text-destructive text-sm font-medium" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
