import React from 'react';
import FormError from './FormError';
import Button from '../base/Button';
import { Minus, Plus } from 'lucide-react';


import Input from '../base/Input';
import { IngredientFormData } from '@/schemas/validationSchemas';
import { useFormContext } from 'react-hook-form';
import { NumericInputProps } from '@/types/components';
import { cn } from '@/utils/utils';

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

  const adjustValue = (delta: number) => {
    const current = parseFloat(value || '0') || 0;
    const newValue = Math.max(current + delta, props.min ? +props.min : 0);
    setValue(name, newValue.toString(), { shouldValidate: true });
  };

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
            {...register(name)}
            {...props}
            size={size}
            error={error}
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

          <div className="mt-3 flex flex-wrap lg:flex-nowrap md:flex-nowrap justify-center gap-2 md:justify-start">
            {quickIncrements.map(inc => (
              <div
                key={inc}
                className="border-input bg-background flex items-center rounded-md border"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustValue(-inc)}
                  className="h-8 w-8 rounded-none rounded-l-md p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="min-w-[2rem] px-2 text-center text-xs font-medium">
                  {inc}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustValue(inc)}
                  className="h-8 w-8 rounded-none rounded-r-md p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {name === 'buyPrice' && (
            <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-[120%] text-base font-medium sm:text-lg">
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
