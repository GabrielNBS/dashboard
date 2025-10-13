import { InputHTMLAttributes, useState, useRef, useCallback } from 'react';
import LordIcon, { LordIconRef } from '../LordIcon';
import Input from '@/components/ui/base/Input';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const iconRef = useRef<LordIconRef>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <LordIcon
        ref={iconRef}
        src="https://cdn.lordicon.com/vayiyuqd.json"
        width={20}
        height={20}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        isHovered={isHovered || isFocused}
      />

      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-2 pr-4 pl-10 text-sm shadow-sm transition-colors focus:ring ${className}`}
        {...props}
      />
    </div>
  );
}
