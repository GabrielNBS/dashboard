import React, { useState, useEffect } from 'react';
import FormError from './FormError';
import Button from '../base/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IngredientFormData } from '@/schemas/validationSchemas';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/utils';

interface QuantityWithUnitInputProps {
  label?: string;
  quantityError?: string;
  unitError?: string;
  quickIncrements?: number[];
  min?: number;
  placeholder?: string;
  className?: string;
}

const QuantityWithUnitInput = ({
  label = 'Quantidade',
  quantityError,
  unitError,
  quickIncrements = [1, 10],

  min = 0,
  placeholder = '0',
  className,
}: QuantityWithUnitInputProps) => {
  const { register, setValue, watch } = useFormContext<IngredientFormData>();

  const quantityValue = watch('quantity');
  const unitValue = watch('unit');
  const [displayValue, setDisplayValue] = useState('');

  // Sincroniza o valor de exibição com o valor do formulário
  useEffect(() => {
    if (quantityValue !== undefined && quantityValue !== null) {
      setDisplayValue(quantityValue === '0' ? '' : quantityValue);
    }
  }, [quantityValue]);

  const formatQuantity = (val: string): string => {
    const allowDecimals = unitValue !== 'un';

    if (!allowDecimals) {
      const numbers = val.replace(/\D/g, '');
      return numbers;
    }

    let numbers = val.replace(/[^\d.,]/g, '');
    numbers = numbers.replace(',', '.');

    const parts = numbers.split('.');
    if (parts.length > 2) {
      numbers = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts.length > 1) {
      const maxDecimals = unitValue === 'kg' || unitValue === 'l' ? 3 : 2;
      parts[1] = parts[1].substring(0, maxDecimals);
      numbers = parts.join('.');
    }

    return numbers;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (!inputValue) {
      setDisplayValue('');
      setValue('quantity', '', { shouldValidate: true });
      return;
    }

    const allowDecimals = unitValue !== 'un';

    if (!allowDecimals) {
      // Remove tudo que não é dígito
      inputValue = inputValue.replace(/\D/g, '');

      if (!inputValue) {
        setDisplayValue('');
        setValue('quantity', '', { shouldValidate: true });
        return;
      }

      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        const limitedValue = Math.max(numValue, min);
        const limitedStr = limitedValue.toString();
        setDisplayValue(limitedStr);
        setValue('quantity', limitedStr, { shouldValidate: true });
      }
    } else {
      // Remove tudo que não é dígito, vírgula ou ponto
      inputValue = inputValue.replace(/[^\d.,]/g, '');

      // Substitui vírgula por ponto para cálculos
      inputValue = inputValue.replace(',', '.');

      if (!inputValue) {
        setDisplayValue('');
        setValue('quantity', '', { shouldValidate: true });
        return;
      }

      // Garante apenas um ponto decimal
      const parts = inputValue.split('.');
      if (parts.length > 2) {
        inputValue = parts[0] + '.' + parts.slice(1).join('');
      } else if (parts.length === 2) {
        const maxDecimals = unitValue === 'kg' || unitValue === 'l' ? 3 : 2;
        parts[1] = parts[1].substring(0, maxDecimals);
        inputValue = parts.join('.');
      }

      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        const limitedValue = Math.max(numValue, min);
        const limitedStr = limitedValue.toString();
        setDisplayValue(limitedStr);
        setValue('quantity', limitedStr, { shouldValidate: true });
      } else {
        // Permite valores parciais como "5." durante digitação
        setDisplayValue(inputValue);
        setValue('quantity', inputValue, { shouldValidate: true });
      }
    }
  };

  const adjustValue = (delta: number) => {
    const current = parseFloat(quantityValue || '0') || 0;
    const newValue = Math.max(current + delta, min);
    const formatted = newValue.toString();
    setDisplayValue(formatted);
    setValue('quantity', formatted, { shouldValidate: true });
  };

  const hasError = quantityError || unitError;

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Label do campo */}
      {label && (
        <label className="text-primary block text-left text-base font-medium sm:text-center">
          {label}
        </label>
      )}

      <div className="flex w-full flex-col gap-2">
        {/* Input combinado com select */}
        <div className="relative w-full">
          <div
            className={cn(
              'flex h-14 overflow-hidden rounded-xl border-2 transition-all',
              hasError
                ? 'border-on-critical focus-within:border-on-critical focus-within:ring-on-critical focus-within:ring-2'
                : 'border-border focus-within:border-primary focus-within:ring-primary focus-within:ring-2',
              className
            )}
          >
            {/* Input da quantidade */}
            <input
              type="text"
              value={displayValue}
              onChange={handleQuantityChange}
              placeholder={placeholder}
              className={cn(
                'flex-1 border-0 bg-transparent px-4 text-center text-base font-medium outline-none sm:text-lg',
                'placeholder:text-muted-foreground',
                'focus:ring-0 focus:outline-none'
              )}
            />

            {/* Divisor visual */}
            <div className="bg-border w-px" />

            {/* Select da unidade */}
            <select
              {...register('unit')}
              className={cn(
                'min-w-[100px] border-0 bg-transparent px-3 py-2 text-base font-medium outline-none sm:text-sm',
                'focus:ring-0 focus:outline-none',
                !unitValue && 'text-muted-foreground'
              )}
              aria-label="Selecione a unidade de medida"
            >
              <option value="">Unidade</option>
              <option value="kg">kg</option>
              <option value="l">l</option>
              <option value="un">un</option>
            </select>
          </div>
        </div>

        {/* Botões de incremento rápido */}
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {quickIncrements.map(inc => (
            <React.Fragment key={inc}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustValue(-inc)}
                className="h-10 min-w-[70px] px-3 text-sm font-medium sm:h-8 sm:text-xs"
              >
                <ChevronDown className="mr-1 h-4 w-4 sm:h-3 sm:w-3" />-{inc}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustValue(inc)}
                className="h-10 min-w-[70px] px-3 text-sm font-medium sm:h-8 sm:text-xs"
              >
                <ChevronUp className="mr-1 h-4 w-4 sm:h-3 sm:w-3" />+{inc}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mensagens de erro */}
      {(quantityError || unitError) && <FormError message={quantityError || unitError} />}
    </div>
  );
};

export default QuantityWithUnitInput;
