import React, { useMemo } from 'react';
import FormError from './FormError';
import Button from '../base/Button';
import { Minus, Plus } from 'lucide-react';


import Input from '../base/Input';
import { IngredientFormData } from '@/schemas/validationSchemas';
import { useFormContext } from 'react-hook-form';
import { NumericInputProps } from '@/types/components';
import { cn } from '@/utils/utils';
import { useRTLMask } from '@/hooks/ui/useRTLMask';

interface ExtendedNumericInputProps extends Omit<NumericInputProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
}

const NumericInput = ({
  label,
  error,
  quickIncrements = [1, 10],
  size = 'lg',
  ...props
}: ExtendedNumericInputProps) => {
  const { register, setValue, watch } = useFormContext<IngredientFormData>();
  const name = props.name as keyof IngredientFormData;

  if (!name) {
    console.error('NumericInput: name prop is required');
    return null;
  }
  const value = watch(name);

  // Determina decimais baseado no step ou nome
  const decimals = useMemo(() => {
    if (props.step && parseFloat(props.step.toString()) < 1) return 3;
    if (name === 'buyPrice') return 2;
    return 0;
  }, [props.step, name]);

  const { displayValue, handleChange } = useRTLMask({
    initialValue: value || '',
    onChange: (val) => setValue(name, val, { shouldValidate: true }),
    decimals,
  });

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Label do campo */}
      {label && (
        <label className="text-primary block text-left text-base font-medium sm:text-center md:text-left">
          {label}
        </label>
      )}

      <div className="flex w-full flex-col gap-2">
        <div className="relative w-full">
          <Input
            {...props}
            size={size}
            error={error}
            value={displayValue}
            onChange={handleChange}
            inputMode={decimals > 0 ? 'decimal' : 'numeric'}
            style={{
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              ...props.style,
            }}
            className={cn(
              'h-14 text-center text-base font-medium sm:text-lg md:text-left',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              props.className
            )}
          />
          
          {name === 'buyPrice' && (
            <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-[50%] text-base font-medium sm:text-lg">
              R$
            </span>
          )}
        </div>
      </div>

      <FormError message={error} />
    </div>
  );
};

export default NumericInput;
