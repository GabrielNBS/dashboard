import React, { useMemo } from 'react';
import FormError from './FormError';
import Button from '../base/Button';
import { Minus, Plus } from 'lucide-react';

import { IngredientFormData } from '@/schemas/validationSchemas';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/utils';
import { useRTLMask } from '@/hooks/ui/useRTLMask';

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

  // Determina o número de casas decimais
  const decimals = useMemo(() => {
    if (unitValue === 'kg' || unitValue === 'l') return 3;
    return 0;
  }, [unitValue]);

  // Determina se deve usar formatação de unidade pequena (ex: g ao invés de kg)
  const isSmallUnit = useMemo(() => {
    if (decimals === 0 || !quantityValue) return false;
    const numValue = parseFloat(quantityValue);
    return !isNaN(numValue) && numValue < 1 && numValue > 0;
  }, [decimals, quantityValue]);

  // Unidade a ser exibida (badge)
  const displayUnitBadge = useMemo(() => {
    if (!unitValue) return '';
    if (isSmallUnit) {
      if (unitValue === 'kg') return 'g';
      if (unitValue === 'l') return 'ml';
    }
    return ''; // Se não for pequena, a unidade já está no select
  }, [unitValue, isSmallUnit]);

  const { displayValue, handleChange } = useRTLMask({
    initialValue: quantityValue || '',
    onChange: (val) => setValue('quantity', val, { shouldValidate: true }),
    decimals,
    autoAdjustSmallValues: ['kg', 'l'].includes(unitValue),
    maxValue: unitValue === 'kg' || unitValue === 'l' ? 1000 : undefined,
  });

  const adjustValue = (delta: number) => {
    const current = parseFloat(quantityValue || '0') || 0;
    const newValue = Math.max(current + delta, min);
    const formatted = newValue.toString();
    setValue('quantity', formatted, { shouldValidate: true });
  };

  const hasError = quantityError || unitError;

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Label do campo */}
      {label && (
        <label className="text-primary block text-left text-base font-medium sm:text-center md:text-left">
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
              inputMode={decimals > 0 ? 'decimal' : 'numeric'}
              value={displayValue}
              onChange={handleChange}
              placeholder={placeholder}
              className={cn(
                'flex-1 border-0 bg-transparent px-4 text-center text-base font-medium outline-none sm:text-lg md:text-left',
                'placeholder:text-muted-foreground',
                'focus:ring-0 focus:outline-none'
              )}
            />


            {displayUnitBadge && (
               <span className="text-muted-foreground pointer-events-none flex items-center pr-2 text-sm">
                 {displayUnitBadge}
               </span>
            )}

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
              <option value="kg">Peso</option>
              <option value="l">Litro</option>
              <option value="un">Unidade (un)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensagens de erro */}
      {(quantityError || unitError) && <FormError message={quantityError || unitError} />}
    </div>
  );
};

export default QuantityWithUnitInput;
