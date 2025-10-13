import React from 'react';
import FormError from './FormError';
import Button from '../base/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="flex w-full flex-col gap-1">
      {/* Label do campo */}
      {label && (
        <label className="text-foreground mb-1 block text-center text-sm font-medium">
          {label}
        </label>
      )}

      <div className="flex w-full flex-col gap-2">
        <div className="relative w-full max-w-[400px]">
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
              'text-center text-lg font-medium',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              props.className
            )}
          />

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {quickIncrements.map(inc => (
              <React.Fragment key={inc}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustValue(-inc)}
                  className="h-8 px-3 text-xs font-medium"
                >
                  <ChevronDown className="mr-1 h-3 w-3" />-{inc}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustValue(inc)}
                  className="h-8 px-3 text-xs font-medium"
                >
                  <ChevronUp className="mr-1 h-3 w-3" />+{inc}
                </Button>
              </React.Fragment>
            ))}
          </div>

          {name === 'buyPrice' && (
            <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-[120%] text-lg font-medium">
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
