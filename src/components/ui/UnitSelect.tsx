// ===================== COMPONENTES REUTILIZÁVEIS =====================

import { IngredientFormData } from '@/schemas/validationSchemas';
import { useFormContext } from 'react-hook-form';
import FormError from './FormError';
import clsx from 'clsx';
import { Label } from './label';

const UnitSelect = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  return (
    <div className="flex w-full flex-col">
      <Label htmlFor="unit" className="text-primary block text-center text-base font-medium">
        Unidade de medida
      </Label>
      <select
        {...register('unit')}
        id="unit"
        className={clsx(
          'border-input bg-background h-14 w-full rounded-xl border-2 px-4 py-3 text-center text-lg font-medium',
          'focus:border-primary focus:ring-primary transition-all focus:ring-2 focus:outline-none',
          'appearance-none bg-white',
          errors.unit && 'border-on-critical focus:border-on-critical focus:ring-on-critical'
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 12px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px',
        }}
      >
        <option value="kg">Quilograma (kg)</option>
        <option value="l">Litro (l)</option>
        <option value="un">Unidade (un)</option>
      </select>
      <FormError message={errors.unit?.message} />
    </div>
  );
};

export default UnitSelect;
