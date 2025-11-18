'use client';

import { forwardRef, useCallback, useState } from 'react';
import Input from '@/components/ui/base/Input';

interface CurrencyInputFieldProps {
  placeholder?: string;
  id?: string;
  className?: string;
  maxValue?: number;
  minValue?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const CurrencyInputField = forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  (
    {
      placeholder = 'R$ 0,00',
      id,
      className,
      maxValue = 999999.99,
      minValue = 0,
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(() => {
      if (!value || value === '0' || value === '') return '';
      return formatCurrencyDisplay(value);
    });

    const formatCurrencyDisplay = useCallback((val: string): string => {
      if (!val || val === '0' || val === '') return '';

      // Remove tudo exceto números e vírgula/ponto
      const cleaned = val.replace(/[^\d,\.]/g, '');

      // Se estiver vazio após limpeza, retorna vazio
      if (!cleaned || cleaned === '0') return '';

      // Substitui ponto por vírgula
      const withComma = cleaned.replace('.', ',');

      // Se terminar com vírgula, mantém
      if (withComma.endsWith(',')) return withComma;

      // Parse para número
      const number = parseFloat(withComma.replace(',', '.'));
      if (isNaN(number) || number === 0) return '';

      return number.toFixed(2).replace('.', ',');
    }, []);

    const parseValue = useCallback(
      (input: string): string => {
        if (!input || input.trim() === '') return '';

        // Remove tudo exceto números e vírgula/ponto
        const cleaned = input.replace(/[^\d,\.]/g, '');

        if (!cleaned) return '';

        // Se for apenas vírgula ou ponto, retorna vazio
        if (cleaned === ',' || cleaned === '.') return '';

        // Substitui vírgula por ponto para parsing
        const normalized = cleaned.replace(',', '.');

        // Se terminar com ponto, mantém estado intermediário
        if (normalized.endsWith('.')) {
          const beforeDot = normalized.slice(0, -1);
          if (!beforeDot) return '';
          return beforeDot;
        }

        const number = parseFloat(normalized);

        if (isNaN(number)) return '';
        if (number === 0) return '';
        if (number < minValue) return minValue.toString();
        if (number > maxValue) return maxValue.toString();

        return number.toString();
      },
      [minValue, maxValue]
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

        // Remove "R$" e espaços
        const cleanInput = inputValue.replace(/R\$\s*/g, '').trim();

        // Permite digitar vírgula
        if (cleanInput === ',' || cleanInput === '.') {
          setDisplayValue('0,');
          return;
        }

        // Permite estados intermediários (ex: "10,")
        if (cleanInput.endsWith(',') || cleanInput.endsWith('.')) {
          setDisplayValue(cleanInput.replace('.', ','));
          return;
        }

        // Parse e valida o valor
        const parsedValue = parseValue(cleanInput);

        if (parsedValue === '') {
          setDisplayValue('');
          onChange('');
          return;
        }

        // Atualiza o estado
        const formattedDisplay = formatCurrencyDisplay(parsedValue);
        setDisplayValue(formattedDisplay);
        onChange(parsedValue);
      },
      [parseValue, formatCurrencyDisplay, onChange]
    );

    const handleBlur = useCallback(() => {
      if (!displayValue || displayValue === '0,') {
        setDisplayValue('');
        onChange('');
        return;
      }

      // Formata o valor final ao sair do campo
      const parsedValue = parseValue(displayValue);
      if (parsedValue && parsedValue !== '0') {
        const formatted = formatCurrencyDisplay(parsedValue);
        setDisplayValue(formatted);
      } else {
        setDisplayValue('');
        onChange('');
      }
    }, [displayValue, parseValue, formatCurrencyDisplay, onChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permite: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].includes(e.keyCode)) return;

        // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if (e.ctrlKey || e.metaKey) return;

        // Permite: home, end, left, right
        if (e.keyCode >= 35 && e.keyCode <= 39) return;

        // Permite vírgula e ponto apenas uma vez
        if ((e.key === ',' || e.key === '.') && !displayValue.includes(',')) return;

        // Bloqueia se não for número
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      },
      [displayValue]
    );

    return (
      <div className="relative">
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          R$
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          id={id}
          className={`pl-10 ${className || ''}`}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = 'CurrencyInputField';

export default CurrencyInputField;
