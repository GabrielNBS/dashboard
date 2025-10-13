'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/base/Input';

interface PercentageInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  maxValue?: number;
  minValue?: number;
}

export default function PercentageInput({
  value,
  onChange,
  placeholder = '0%',
  className = '',
  disabled = false,
  required = false,
  id,
  'aria-invalid': ariaInvalid,
  maxValue = 100,
  minValue = 0,
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Função para formatar valor como percentual
  const formatPercentage = (val: string): string => {
    // Remove tudo que não é dígito ou vírgula/ponto
    let numbers = val.replace(/[^\d.,]/g, '');

    // Substitui vírgula por ponto para cálculos
    numbers = numbers.replace(',', '.');

    if (!numbers) return '';

    // Limita casas decimais para percentuais (máximo 2 casas)
    const parts = numbers.split('.');
    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 2); // Máximo 2 casas decimais
      numbers = parts.join('.');
    }

    // Aplica limites de valor
    const numValue = parseFloat(numbers);
    if (!isNaN(numValue)) {
      const limitedValue = Math.min(Math.max(numValue, minValue), maxValue);
      return limitedValue.toString();
    }

    return numbers;
  };

  // Atualiza display quando value prop muda
  useEffect(() => {
    if (typeof value === 'number') {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(value.toString());
      }
    } else if (typeof value === 'string') {
      if (!value || value === '0') {
        setDisplayValue('');
      } else {
        setDisplayValue(value);
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Se o usuário apagou tudo, limpa o campo
    if (!inputValue) {
      setDisplayValue('');
      onChange('');
      return;
    }

    // Formata o valor
    const formatted = formatPercentage(inputValue);
    setDisplayValue(formatted);
    onChange(formatted);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pr-8 ${className}`}
        disabled={disabled}
        required={required}
        id={id}
        aria-invalid={ariaInvalid}
      />
      <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
        %
      </div>
    </div>
  );
}
