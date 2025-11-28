'use client';

import React from 'react';
import Input from '@/components/ui/base/Input';
import { cn } from '@/utils/utils';
import { useRTLMask } from '@/hooks/ui/useRTLMask';
import { UnitType } from '@/types/ingredients';

interface QuantityInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  unit?: UnitType;
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
  maxValue = 99999,
  label,
  error,
  size = 'md',
}: QuantityInputProps) {
  const getDecimals = () => {
    if (!allowDecimals || unit === 'un') return 0;
    return 3;
  };

  const decimals = getDecimals();

  const { displayValue, handleChange } = useRTLMask({
    initialValue: value,
    onChange,
    decimals,
    maxValue,
  });

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
          inputMode={decimals > 0 ? 'decimal' : 'numeric'}
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
