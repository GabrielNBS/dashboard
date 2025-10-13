import React from 'react';

/**
 * Props do componente Input
 *
 * Estende as propriedades nativas do elemento input HTML
 * e adiciona propriedades para label e mensagem de erro.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label do campo */
  label?: string;
  /** Mensagem de erro a ser exibida */
  error?: string;
}

/**
 * Componente Input - Campo de entrada customizável
 *
 * Suporta label, mensagem de erro e todas as propriedades
 * nativas do elemento input HTML.
 *
 * @param label - Label do campo (opcional)
 * @param error - Mensagem de erro (opcional)
 * @param className - Classes CSS adicionais
 * @param props - Demais propriedades do elemento input
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Digite seu email"
 *   error="Email inválido"
 * />
 */
export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label do campo */}
      {label && <label className="text-subtitle font-medium">{label}</label>}

      {/* Campo de entrada */}
      <input
        className={`focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground border-border w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />

      {/* Mensagem de erro */}
      {error && <span className="text-foreground text-destructive">{error}</span>}
    </div>
  );
}
