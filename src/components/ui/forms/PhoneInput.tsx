'use client';

import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';
import { unmaskPhone, isValidPhone } from '@/utils/masks';

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
  const [mask, setMask] = useState('(99) 99999-9999');
  const [validationError, setValidationError] = useState('');

  // Determine mask based on value length or current input
  const updateMask = (val: string) => {
    const digits = val.replace(/\D/g, '');
    // If we have more than 10 digits, it's definitely a cellphone (11 digits).
    // If we have 10 or less, it could be landline (10 digits) or incomplete.
    // However, as we type, we want to allow typing the 11th digit.
    // Strategy:
    // Display (99) 9999-99999 normally? NO, hyphen position matters.
    // If digits > 10, use (99) 99999-9999.
    // Else use (99) 9999-99999 (allow 5th digit at end to trigger shift?)
    // Actually, react-input-mask works well if we just start with one and switch.
    if (digits.length > 10) {
      setMask('(99) 99999-9999');
    } else {
      setMask('(99) 9999-99999');
    }
  };

  useEffect(() => {
    const strVal = value?.toString() || '';
    updateMask(strVal);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    updateMask(inputValue);

    const unmasked = unmaskPhone(inputValue);
    onChange(unmasked);

    if (validationError) {
      setValidationError('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Check if it's a valid phone number
    if (val && !isValidPhone(val)) {
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

      <InputMask
        mask={mask}
        value={value as string}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        maskChar="_"
        alwaysShowMask={false}
      >
        {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
          <Input
            {...inputProps}
            type="tel"
            placeholder={placeholder}
            className={cn(className)}
            disabled={disabled}
            required={required}
            id={id}
            aria-invalid={ariaInvalid || !!validationError}
            error={error || validationError}
            size={size}
          />
        )}
      </InputMask>

      {(error || validationError) && (
        <span className="text-destructive text-sm font-medium">{error || validationError}</span>
      )}
    </div>
  );
}
