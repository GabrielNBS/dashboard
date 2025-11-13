'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';
import { emailMask, isValidEmail } from '@/utils/masks';

interface EmailInputProps {
  value: string;
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

export default function EmailInput({
  value,
  onChange,
  placeholder = 'exemplo@email.com',
  className = '',
  disabled = false,
  required = false,
  id,
  'aria-invalid': ariaInvalid,
  label,
  error,
  size = 'md',
}: EmailInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [validationError, setValidationError] = useState('');

  // Atualiza display quando value prop muda
  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Aplica máscara (remove caracteres inválidos)
    const masked = emailMask(inputValue);
    setDisplayValue(masked);
    onChange(masked);
    
    // Limpa erro de validação ao digitar
    if (validationError) {
      setValidationError('');
    }
  };

  const handleBlur = () => {
    // Valida apenas se houver valor
    if (displayValue && !isValidEmail(displayValue)) {
      setValidationError('E-mail inválido');
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
        type="email"
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
      />

      {(error || validationError) && (
        <span className="text-destructive text-sm font-medium">
          {error || validationError}
        </span>
      )}
    </div>
  );
}
