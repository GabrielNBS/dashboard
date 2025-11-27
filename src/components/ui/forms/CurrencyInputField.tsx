'use client';

import { forwardRef } from 'react';
import Input from '@/components/ui/base/Input';
import { useRTLMask } from '@/hooks/ui/useRTLMask';

interface CurrencyInputFieldProps {
  placeholder?: string;
  id?: string;
  className?: string;
  maxValue?: number;
  minValue?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const CurrencyInputField = forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  (
    {
      placeholder = 'R$ 0,00',
      id,
      className,
      value,
      onChange,
      disabled,
      maxValue,
      ...props
    },
    ref
  ) => {
    const { displayValue, handleChange } = useRTLMask({
      initialValue: value,
      onChange,
      decimals: 2,
      prefix: 'R$ ',
    });

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          id={id}
          className={`${className || ''}`}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = 'CurrencyInputField';

export default CurrencyInputField;
