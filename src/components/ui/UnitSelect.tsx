import { IngredientFormData } from '@/schemas/validationSchemas';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import clsx from 'clsx';

interface UnitSelectProps {
  register: UseFormRegister<IngredientFormData>;
  errors: FieldErrors<IngredientFormData>;
  className?: string;
  disabled?: boolean;
}

const UnitSelect = ({ register, errors, className, disabled }: UnitSelectProps) => {
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
      disabled={disabled}
    >
      <option value="">Selecione a unidade</option>
      <option value="kg">Peso</option>
      <option value="l">Litro</option>
      <option value="un">Unidade (un)</option>
    </select>
  );
};

export default UnitSelect;
