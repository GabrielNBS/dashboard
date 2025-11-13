'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';

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
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
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
  label,
  error,
  size = 'md',
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [rawDigits, setRawDigits] = useState(''); // Mantém apenas os dígitos puros

  // Função para formatar centavos como moeda
  const formatCentsAsCurrency = useCallback((cents: number): string => {
    const reais = cents / 100;
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  // Atualiza display quando value prop muda externamente
  useEffect(() => {
    if (typeof value === 'number') {
      if (value === 0) {
        setDisplayValue('');
        setRawDigits('');
      } else {
        const cents = Math.round(value * 100);
        setRawDigits(cents.toString());
        setDisplayValue(formatCentsAsCurrency(cents));
      }
    } else if (typeof value === 'string') {
      if (!value || value === '0') {
        setDisplayValue('');
        setRawDigits('');
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const cents = Math.round(numValue * 100);
          setRawDigits(cents.toString());
          setDisplayValue(formatCentsAsCurrency(cents));
        } else {
          setDisplayValue('');
          setRawDigits('');
        }
      }
    }
  }, [formatCentsAsCurrency, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove tudo que não é dígito do input
    const newDigits = inputValue.replace(/\D/g, '');

    // Se o usuário apagou tudo, limpa o campo
    if (!newDigits) {
      setRawDigits('');
      setDisplayValue('');
      onChange('');
      return;
    }

    // Converte para centavos (número inteiro)
    const cents = parseInt(newDigits, 10);
    const reais = cents / 100;

    // Aplica limites de valor - impede digitação acima do limite
    if (reais > maxValue) {
      // Não permite digitar mais se já atingiu o máximo
      return;
    }

    const limitedReais = Math.max(reais, minValue);
    const limitedCents = Math.round(limitedReais * 100);

    // Atualiza os estados
    setRawDigits(limitedCents.toString());
    setDisplayValue(formatCentsAsCurrency(limitedCents));

    // Passa o valor numérico para o onChange
    onChange(limitedReais.toString());
  };

  const paddingClasses = {
    sm: 'pl-8',
    md: 'pl-10',
    lg: 'pl-12',
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconPositions = {
    sm: 'left-2',
    md: 'left-3',
    lg: 'left-4',
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label do campo */}
      {label && (
        <label className="text-foreground mb-1 block text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={cn(
            'text-muted-foreground pointer-events-none absolute top-1/2 -translate-y-1/2 transform',
            iconPositions[size],
            iconSizes[size]
          )}
        >
          R$
        </div>
        <Input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(paddingClasses[size], className)}
          disabled={disabled}
          required={required}
          id={id}
          aria-invalid={ariaInvalid}
          error={error}
          size={size}
        />
      </div>

      {/* Mensagem de erro */}
      {error && <span className="text-destructive text-sm font-medium">{error}</span>}
    </div>
  );
}
