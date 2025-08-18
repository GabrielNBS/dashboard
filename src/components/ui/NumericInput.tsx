import React from 'react';
import FormError from './FormError';
import Button from './Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from './label';
import Input from './Input';
import { IngredientFormData } from '@/schemas/validationSchemas';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { NumericInputProps } from '@/types/components';

const NumericInput = ({ label, error, quickIncrements = [1, 10], ...props }: NumericInputProps) => {
  const { register, setValue, watch } = useFormContext<IngredientFormData>();
  const name = props.name as keyof IngredientFormData;
  const value = watch(name);

  const adjustValue = (delta: number) => {
    const current = parseFloat(value || '0') || 0;
    const newValue = Math.max(current + delta, props.min ? +props.min : 0);
    setValue(name, newValue.toString(), { shouldValidate: true });
  };

  return (
    <div className="flex w-full flex-col">
      <Label
        htmlFor={props.id}
        className="text-primary font-foreground block text-center text-base"
      >
        {label}
      </Label>

      <div className="flex w-full flex-col gap-2">
        <div className="relative w-full max-w-[400px]">
          <Input
            {...register(name)}
            {...props}
            style={{
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              ...props.style,
            }}
            className={clsx(
              'border-input bg-background h-14 w-full rounded-xl border-2 px-4 py-3 text-center text-lg font-medium',
              'focus:border-primary focus:ring-primary transition-all focus:ring-2',
              'placeholder:text-gray-400',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              error && 'border-on-critical focus:border-on-critical focus:ring-on-critical',
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
            <span className="absolute top-1/2 right-4 -translate-y-[120%] text-lg font-medium text-gray-500">
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
