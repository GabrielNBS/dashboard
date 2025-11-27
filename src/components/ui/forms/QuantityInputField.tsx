'use client';

import { forwardRef, useMemo } from 'react';
import Input from '@/components/ui/base/Input';
import { useRTLMask } from '@/hooks/ui/useRTLMask';

interface QuantityInputFieldProps {
  placeholder?: string;
  id?: string;
  className?: string;
  unit?: string;
  allowDecimals?: boolean;
  maxValue?: number;
  minValue?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  [key: string]: any;
}

const QuantityInputField = forwardRef<HTMLInputElement, QuantityInputFieldProps>(
  (
    {
      placeholder = '0',
      id,
      className,
      unit = '',
      allowDecimals = true,
      value,
      onChange,
      disabled,
      maxValue,
      ...props
    },
    ref
  ) => {
    // Determina o número de casas decimais
    const decimals = useMemo(() => {
      if (!allowDecimals) return 0;
      // Se a unidade for 'un', 'g', 'ml', geralmente não tem decimais ou tem poucos
      // Mas aqui vamos respeitar o allowDecimals. Se true, usa 3 (padrão para kg/l)
      // Se a unidade for específica, poderíamos refinar, mas allowDecimals já vem do pai
      return 3;
    }, [allowDecimals]);

    // Determina se deve usar formatação de unidade pequena (ex: g ao invés de kg)
    const isSmallUnit = useMemo(() => {
      if (!allowDecimals || !value) return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue < 1 && numValue > 0;
    }, [allowDecimals, value]);

    // Unidade a ser exibida
    const displayUnit = useMemo(() => {
      if (!unit) return '';
      if (isSmallUnit) {
        if (unit === 'kg') return 'g';
        if (unit === 'l') return 'ml';
      }
      return unit;
    }, [unit, isSmallUnit]);

    const { displayValue, handleChange } = useRTLMask({
      initialValue: value,
      onChange,
      decimals,
      // Removemos o suffix do mask para evitar bug de deleção
      autoAdjustSmallValues: ['kg', 'l'].includes(unit),
      maxValue,
    });

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode={decimals > 0 ? 'decimal' : 'numeric'}
          placeholder={placeholder}
          id={id}
          className={`${unit ? 'pr-12' : ''} ${className || ''}`}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          {...props}
        />
        {unit && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transition-all duration-200">
            {displayUnit}
          </span>
        )}
      </div>
    );
  }
);

QuantityInputField.displayName = 'QuantityInputField';

export default QuantityInputField;
