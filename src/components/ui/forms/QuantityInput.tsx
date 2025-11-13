'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';

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
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
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
  label,
  error,
  size = 'md',
}: QuantityInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Função para formatar valor como quantidade
  const formatQuantity = (val: string): string => {
    if (!allowDecimals) {
      // Remove tudo que não é dígito
      const numbers = val.replace(/\D/g, '');
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
    let inputValue = e.target.value;

    // Se o usuário apagou tudo, limpa o campo
    if (!inputValue) {
      setDisplayValue('');
      onChange('');
      return;
    }

    if (!allowDecimals) {
      // Remove tudo que não é dígito
      inputValue = inputValue.replace(/\D/g, '');
      
      if (!inputValue) {
        setDisplayValue('');
        onChange('');
        return;
      }

      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        // Impede digitação acima do máximo
        if (numValue > maxValue) {
          return;
        }
        
        const limitedValue = Math.max(numValue, minValue);
        const limitedStr = limitedValue.toString();
        setDisplayValue(limitedStr);
        onChange(limitedStr);
      }
    } else {
      // Remove tudo que não é dígito, vírgula ou ponto
      inputValue = inputValue.replace(/[^\d.,]/g, '');
      
      // Substitui vírgula por ponto para cálculos
      inputValue = inputValue.replace(',', '.');

      if (!inputValue) {
        setDisplayValue('');
        onChange('');
        return;
      }

      // Garante apenas um ponto decimal
      const parts = inputValue.split('.');
      if (parts.length > 2) {
        inputValue = parts[0] + '.' + parts.slice(1).join('');
      } else if (parts.length === 2) {
        // Limita casas decimais baseado na unidade
        const maxDecimals = unit === 'kg' || unit === 'l' ? 3 : 2;
        parts[1] = parts[1].substring(0, maxDecimals);
        inputValue = parts.join('.');
      }

      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        // Impede digitação acima do máximo
        if (numValue > maxValue) {
          return;
        }
        
        const limitedValue = Math.max(numValue, minValue);
        const limitedStr = limitedValue.toString();
        setDisplayValue(limitedStr);
        onChange(limitedStr);
      } else {
        // Permite valores parciais como "5." durante digitação
        setDisplayValue(inputValue);
        onChange(inputValue);
      }
    }
  };

  const paddingClasses = {
    sm: unit ? 'pr-8' : '',
    md: unit ? 'pr-12' : '',
    lg: unit ? 'pr-14' : '',
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconPositions = {
    sm: 'right-2',
    md: 'right-3',
    lg: 'right-4',
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
        {unit && (
          <div
            className={cn(
              'text-muted-foreground pointer-events-none absolute top-1/2 -translate-y-1/2 transform',
              iconPositions[size],
              iconSizes[size]
            )}
          >
            {unit}
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && <span className="text-destructive text-sm font-medium">{error}</span>}
    </div>
  );
}
