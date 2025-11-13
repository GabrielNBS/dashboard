'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';
import { phoneMask, unmaskPhone, isValidPhone } from '@/utils/masks';

interface PhoneInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = '(00) 00000-0000',
  className = '',
  disabled = false,
  required = false,
  id,
  'aria-invalid': ariaInvalid,
  label,
  error,
  size = 'md',
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [validationError, setValidationError] = useState('');

  // Atualiza display quando value prop muda
  useEffect(() => {
    const stringValue = typeof value === 'number' ? value.toString() : value;
    if (!stringValue) {
      setDisplayValue('');
    } else {
      setDisplayValue(phoneMask(stringValue));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Aplica máscara
    const masked = phoneMask(inputValue);
    setDisplayValue(masked);
    
    // Remove máscara para passar valor limpo
    const unmasked = unmaskPhone(masked);
    onChange(unmasked);
    
    // Limpa erro de validação ao digitar
    if (validationError) {
      setValidationError('');
    }
  };

  const handleBlur = () => {
    // Valida apenas se houver valor
    if (displayValue && !isValidPhone(displayValue)) {
      setValidationError('Telefone inválido');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-foreground mb-1 block text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(className)}
        disabled={disabled}
        required={required}
        id={id}
        aria-invalid={ariaInvalid || !!validationError}
        error={error || validationError}
        size={size}
        maxLength={15}
      />

      {(error || validationError) && (
        <span className="text-destructive text-sm font-medium">
          {error || validationError}
        </span>
      )}
    </div>
  );
}
