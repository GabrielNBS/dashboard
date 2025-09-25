'use client';

import React, { forwardRef } from 'react';
import CurrencyInput from './CurrencyInput';

interface CurrencyInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  name?: string;
  maxValue?: number;
  minValue?: number;
}

const CurrencyInputField = forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  ({ value = '', onChange, maxValue, minValue, ...props }, ref) => {
    return (
      <CurrencyInput
        value={value}
        onChange={onChange || (() => {})}
        maxValue={maxValue}
        minValue={minValue}
        {...props}
      />
    );
  }
);

CurrencyInputField.displayName = 'CurrencyInputField';

export default CurrencyInputField;
