'use client';

import { forwardRef, useCallback, useState } from 'react';
import Input from '@/components/ui/base/Input';

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
}

const QuantityInputField = forwardRef<HTMLInputElement, QuantityInputFieldProps>(
  (
    {
      placeholder = '0',
      id,
      className,
      unit = '',
      allowDecimals = true,
      maxValue = 1000,
      minValue = 0,
      value,
      onChange,
      disabled,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(() => {
      if (!value || value === '0' || value === '') return '';
      return formatDisplay(value, allowDecimals);
    });

    const formatDisplay = useCallback((val: string, decimals: boolean): string => {
      if (!val || val === '0' || val === '') return '';

      const cleaned = val.replace(/[^\d,\.]/g, '');
      if (!cleaned || cleaned === '0') return '';

      const withComma = cleaned.replace('.', ',');
      if (withComma.endsWith(',') && decimals) return withComma;

      const number = parseFloat(withComma.replace(',', '.'));
      if (isNaN(number) || number === 0) return '';

      if (decimals) {
        return number
          .toFixed(3)
          .replace(/\.?0+$/, '')
          .replace('.', ',');
      }

      return Math.floor(number).toString();
    }, []);

    const parseValue = useCallback(
      (input: string): string => {
        if (!input || input.trim() === '') return '';

        const cleaned = input.replace(/[^\d,\.]/g, '');
        if (!cleaned) return '';

        // Se for apenas vírgula ou ponto, retorna vazio
        if (cleaned === ',' || cleaned === '.') return '';

        const normalized = cleaned.replace(',', '.');

        // Mantém estado intermediário
        if (normalized.endsWith('.') && allowDecimals) {
          const beforeDot = normalized.slice(0, -1);
          if (!beforeDot) return '';
          return beforeDot;
        }

        let number = parseFloat(normalized);

        if (isNaN(number)) return '';
        if (number === 0) return '';

        // Aplica limites
        if (number < minValue) number = minValue;
        if (number > maxValue) number = maxValue;

        // Arredonda se não permite decimais
        if (!allowDecimals) {
          number = Math.floor(number);
        }

        return number.toString();
      },
      [allowDecimals, minValue, maxValue]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Permite campo vazio
        if (inputValue === '') {
          setDisplayValue('');
          onChange('');
          return;
        }

        const cleanInput = inputValue.trim();

        // Permite digitar vírgula/ponto se decimais habilitados
        if ((cleanInput === ',' || cleanInput === '.') && allowDecimals) {
          setDisplayValue('0,');
          return;
        }

        // Permite estados intermediários
        if ((cleanInput.endsWith(',') || cleanInput.endsWith('.')) && allowDecimals) {
          setDisplayValue(cleanInput.replace('.', ','));
          return;
        }

        const parsedValue = parseValue(cleanInput);

        if (parsedValue === '') {
          setDisplayValue('');
          onChange('');
          return;
        }

        const formattedDisplay = formatDisplay(parsedValue, allowDecimals);
        setDisplayValue(formattedDisplay);
        onChange(parsedValue);
      },
      [parseValue, formatDisplay, onChange, allowDecimals]
    );

    const handleBlur = useCallback(() => {
      if (!displayValue || displayValue === '0,') {
        setDisplayValue('');
        onChange('');
        return;
      }

      const parsedValue = parseValue(displayValue);
      if (parsedValue && parsedValue !== '0') {
        const formatted = formatDisplay(parsedValue, allowDecimals);
        setDisplayValue(formatted);
      } else {
        setDisplayValue('');
        onChange('');
      }
    }, [displayValue, parseValue, formatDisplay, onChange, allowDecimals]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permite: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].includes(e.keyCode)) return;

        // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if (e.ctrlKey || e.metaKey) return;

        // Permite: home, end, left, right
        if (e.keyCode >= 35 && e.keyCode <= 39) return;

        // Permite vírgula/ponto apenas se decimais habilitados e não existe ainda
        if (allowDecimals && (e.key === ',' || e.key === '.') && !displayValue.includes(',')) {
          return;
        }

        // Bloqueia se não for número
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      },
      [allowDecimals, displayValue]
    );

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode={allowDecimals ? 'decimal' : 'numeric'}
          placeholder={placeholder}
          id={id}
          className={`${unit ? 'pr-12' : ''} ${className || ''}`}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />
        {unit && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            {unit}
          </span>
        )}
      </div>
    );
  }
);

QuantityInputField.displayName = 'QuantityInputField';

export default QuantityInputField;
