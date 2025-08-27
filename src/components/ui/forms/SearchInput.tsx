'use client';

import { InputHTMLAttributes } from 'react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

/**
 * 🔎 SearchInput
 * - Campo simples de busca
 * - Componente controlado: quem usa controla `value` e `onChange`
 * - Ideal para filtros rápidos (ex: buscar ingrediente)
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  ...props
}: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring ${className}`}
      {...props}
    />
  );
}
