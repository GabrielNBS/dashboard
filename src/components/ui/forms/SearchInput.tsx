import { InputHTMLAttributes, useState, useRef, useCallback } from 'react';
import LordIcon, { LordIconRef } from '../LordIcon';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'>;

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
  label,
  error,
  size = 'md',
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

  const paddingClasses = {
    sm: 'pl-8',
    md: 'pl-10',
    lg: 'pl-12',
  };

  const iconSizes = {
    sm: { width: 16, height: 16 },
    md: { width: 20, height: 20 },
    lg: { width: 24, height: 24 },
  };

  const iconPositions = {
    sm: 'left-2',
    md: 'left-3',
    lg: 'left-4',
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label do campo */}
      {label && <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>}

      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <LordIcon
          ref={iconRef}
          src="https://cdn.lordicon.com/vayiyuqd.json"
          width={iconSizes[size].width}
          height={iconSizes[size].height}
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2',
            iconPositions[size]
          )}
          isHovered={isHovered || isFocused}
        />

        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(paddingClasses[size], className)}
          error={error}
          size={size}
          {...props}
        />
      </div>

      {/* Mensagem de erro */}
      {error && <span className="text-destructive text-sm font-medium">{error}</span>}
    </div>
  );
}
