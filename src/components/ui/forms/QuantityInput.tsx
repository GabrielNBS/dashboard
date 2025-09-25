'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/base/Input';

interface QuantityInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  unit?: string;
  allowDecimals?: boolean;
  maxValue?: number;
  minValue?: number;
}

export default function QuantityInput({
  value,
  onChange,
  placeholder = '0',
  className = '',
  disabled = false,
  required = false,
  id,
  'aria-invalid': ariaInvalid,
  unit,
  allowDecimals = true,
  maxValue = 99999, // Limite padrão: 99.999 unidades (adequado para PME)
  minValue = 0,
}: QuantityInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Função para formatar valor como quantidade
  const formatQuantity = (val: string): string => {
    if (!allowDecimals) {
      // Remove tudo que não é dígito
      const numbers = val.replace(/\D/g, '');

      // Aplica limites para números inteiros
      const numValue = parseInt(numbers);
      if (!isNaN(numValue)) {
        const limitedValue = Math.min(Math.max(numValue, minValue), maxValue);
        return limitedValue.toString();
      }

      return numbers;
    }

    // Remove tudo que não é dígito, vírgula ou ponto
    let numbers = val.replace(/[^\d.,]/g, '');

    // Substitui vírgula por ponto para cálculos
    numbers = numbers.replace(',', '.');

    // Garante apenas um ponto decimal e limita casas decimais
    const parts = numbers.split('.');
    if (parts.length > 2) {
      numbers = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limita casas decimais baseado na unidade
    if (parts.length > 1) {
      const maxDecimals = unit === 'kg' || unit === 'l' ? 3 : 2;
      parts[1] = parts[1].substring(0, maxDecimals);
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
    const formatted = formatQuantity(inputValue);
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
        className={unit ? `pr-12 ${className}` : className}
        disabled={disabled}
        required={required}
        id={id}
        aria-invalid={ariaInvalid}
      />
      {unit && (
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-gray-500">
          {unit}
        </div>
      )}
    </div>
  );
}
