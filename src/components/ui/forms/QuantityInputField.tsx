'use client';

import React, { forwardRef } from 'react';
import QuantityInput from './QuantityInput';

interface QuantityInputFieldProps {
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
  unit?: string;
  allowDecimals?: boolean;
  maxValue?: number;
  minValue?: number;
}

const QuantityInputField = forwardRef<HTMLInputElement, QuantityInputFieldProps>(
  ({ value = '', onChange, unit, allowDecimals = true, maxValue, minValue, ...props }, ref) => {
    return (
      <QuantityInput
        value={value}
        onChange={onChange || (() => {})}
        unit={unit}
        allowDecimals={allowDecimals}
        maxValue={maxValue}
        minValue={minValue}
        {...props}
      />
    );
  }
);

QuantityInputField.displayName = 'QuantityInputField';

export default QuantityInputField;
