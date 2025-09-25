'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/base/Input';

interface CurrencyInputProps {
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

export default function CurrencyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  className = '',
  disabled = false,
  required = false,
  id,
  'aria-invalid': ariaInvalid,
  maxValue = 999999.99, // Limite padrão: R$ 999.999,99 (adequado para PME)
  minValue = 0,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Função para formatar valor como moeda
  const formatCurrency = (val: string): string => {
    // Remove tudo que não é dígito
    const numbers = val.replace(/\D/g, '');

    if (!numbers) return '';

    // Converte para centavos e depois para reais
    const cents = parseInt(numbers);
    const reais = cents / 100;

    // Aplica limites de valor
    const limitedValue = Math.min(Math.max(reais, minValue), maxValue);

    // Formata como moeda brasileira
    return limitedValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para extrair valor numérico
  const extractNumericValue = (formattedValue: string): string => {
    const numbers = formattedValue.replace(/\D/g, '');
    if (!numbers) return '';

    const cents = parseInt(numbers);
    const reais = cents / 100;
    return reais.toString();
  };

  // Atualiza display quando value prop muda
  useEffect(() => {
    if (typeof value === 'number') {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrency((value * 100).toString()));
      }
    } else if (typeof value === 'string') {
      if (!value || value === '0') {
        setDisplayValue('');
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          setDisplayValue(formatCurrency((numValue * 100).toString()));
        } else {
          setDisplayValue('');
        }
      }
    }
  }, [formatCurrency, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Se o usuário apagou tudo, limpa o campo
    if (!inputValue) {
      setDisplayValue('');
      onChange('');
      return;
    }

    // Formata o valor
    const formatted = formatCurrency(inputValue);
    setDisplayValue(formatted);

    // Extrai o valor numérico e passa para o onChange
    const numericValue = extractNumericValue(formatted);
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
        R$
      </div>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        disabled={disabled}
        required={required}
        id={id}
        aria-invalid={ariaInvalid}
      />
    </div>
  );
}
