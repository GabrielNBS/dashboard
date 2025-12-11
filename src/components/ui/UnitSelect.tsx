import { IngredientFormData } from '@/schemas/validationSchemas';
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import clsx from 'clsx';
import { UnitType } from '@/types/ingredients';

interface UnitSelectProps {
  register: UseFormRegister<IngredientFormData>;
  errors: FieldErrors<IngredientFormData>;
  className?: string;
  disabled?: boolean;
  name?: Path<IngredientFormData>;
  options?: UnitType[];
}

const UnitSelect = ({
  register,
  errors,
  className,
  disabled,
  name = 'unit',
  options,
}: UnitSelectProps) => {
  const defaultOptions = [
    { value: 'kg', label: 'Peso (kg)' },
    { value: 'l', label: 'Volume (l)' },
    { value: 'un', label: 'Unidade (un)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'ml', label: 'Mililitro (ml)' },
  ];

  const displayOptions = options
    ? defaultOptions.filter(opt => options.includes(opt.value as UnitType))
    : defaultOptions.filter(opt => ['kg', 'l', 'un'].includes(opt.value));

  return (
    <select
      {...register(name)}
      id={name}
      className={clsx(
        'focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground border-border w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        errors[name] && 'border-destructive',
        className
      )}
      aria-label="Selecione a unidade de medida"
      disabled={disabled}
    >
      <option value="">Selecione a unidade</option>
      {displayOptions.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default UnitSelect;
