import { IngredientFormData } from '@/schemas/validationSchemas';
import { UnitType } from '@/types/ingredients';
import { getQuantityInputConfig } from '@/utils/quantityInputConfig';
import { useFormContext } from 'react-hook-form';
import NumericInput from './NumericInput';
import FormError from './FormError';
import Input from '../base/Input';
import clsx from 'clsx';
import UnitSelect from '../UnitSelect';

const EditFormFields = ({ watchedUnit }: { watchedUnit: UnitType }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<IngredientFormData>();
  const quantityConfig = getQuantityInputConfig(watchedUnit);
  const quantityValue = parseFloat(watch('quantity') || '0');

  const getQuickIncrements = (name: string, value: number) => {
    if (name === 'quantity') {
      if (value < 1) return [0.1, 0.5];
      if (value < 10) return [1, 5];
      return [10, 50];
    }

    if (name === 'buyPrice') {
      if (value < 1) return [0.1, 0.5];
      if (value < 10) return [1, 5];
      if (value < 100) return [10, 25];
      return [50, 100];
    }

    return [1, 10];
  };

  return (
    <div className="flex w-full gap-4">
      {/* Nome */}
      <div className="flex w-full flex-col">
        <label htmlFor="name" className="text-primary block text-center text-base font-medium">
          Nome do ingrediente
        </label>
        <Input
          {...register('name')}
          id="name"
          placeholder="Digite o nome do ingrediente"
          className={clsx(
            'focus:border-primary focus:ring-primary h-14 rounded-xl border-2 px-4 text-lg transition-all focus:ring-2',
            errors.name && 'border-on-critical focus:border-on-critical focus:ring-on-critical'
          )}
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Quantidade */}
      <NumericInput
        name="quantity"
        label="Quantidade"
        step={
          typeof quantityConfig.step === 'string'
            ? parseFloat(quantityConfig.step)
            : quantityConfig.step
        }
        min={quantityConfig.min}
        placeholder={quantityConfig.placeholder}
        error={errors.quantity?.message}
        quickIncrements={getQuickIncrements('quantity', quantityValue)}
      />

      {/* Unidade */}
      <UnitSelect />

      {/* Preço de compra */}
      <NumericInput
        name="buyPrice"
        label="Preço de compra"
        step={0.001}
        min={0}
        placeholder="0,00"
        error={errors.buyPrice?.message}
        quickIncrements={getQuickIncrements('buyPrice', parseFloat(watch('buyPrice') || '0'))}
      />
    </div>
  );
};

export default EditFormFields;
