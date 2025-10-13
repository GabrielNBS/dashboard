import { IngredientFormData } from '@/schemas/validationSchemas';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import clsx from 'clsx';

interface UnitSelectProps {
  register: UseFormRegister<IngredientFormData>;
  errors: FieldErrors<IngredientFormData>;
  className?: string;
}

const UnitSelect = ({ register, errors, className }: UnitSelectProps) => {
  return (
    <select
      {...register('unit')}
      id="unit"
      className={clsx(
        'focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground border-border w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        errors.unit && 'border-destructive',
        className
      )}
      aria-label="Selecione a unidade de medida"
    >
      <option value="">Selecione a unidade</option>
      <option value="kg">Quilograma (kg)</option>
      <option value="l">Litro (l)</option>
      <option value="un">Unidade (un)</option>
    </select>
  );
};

export default UnitSelect;
