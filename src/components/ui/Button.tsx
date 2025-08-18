import React from 'react';
import { tv } from 'tailwind-variants';
import { ButtonProps } from '@/types/components';

export const button = tv({
  base: 'inline-flex cursor-pointer items-center justify-center rounded-md font-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      default: 'bg-accent hover:bg-accent/80 text-primary',
      accept: 'bg-great hover:bg-great-hover text-on-great',
      edit: 'bg-warning hover:bg-warning-hover text-on-warning',
      destructive: 'bg-critical hover:bg-critical-hover text-on-critical',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      link: 'bg-transparent underline-offset-4 hover:underline text-blue-600 hover:bg-transparent',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-lg',
      lg: 'px-6 py-3 text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});

/**
 * Componente Button - Botão customizável com variantes
 *
 * Suporta diferentes variantes visuais, tamanhos e todas as
 * propriedades nativas do elemento button HTML.
 *
 * @param variant - Variante visual do botão
 * @param size - Tamanho do botão
 * @param className - Classes CSS adicionais
 * @param disabled - Se o botão está desabilitado
 * @param children - Conteúdo do botão
 * @param props - Demais propriedades do elemento button
 *
 * @example
 * <Button variant="accept" size="md" onClick={handleClick}>
 *   Salvar
 * </Button>
 */
export default function Button({
  children,
  variant,
  size,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
