import { IngredientFormData } from '@/schemas/validationSchemas';
import { UnitType } from '@/types/ingredients';

import { useFormContext } from 'react-hook-form';
import NumericInput from './NumericInput';
import FormError from './FormError';
import Input from '../base/Input';
import clsx from 'clsx';
import QuantityWithUnitInput from './QuantityWithUnitInput';
import { getQuantityInputConfig } from '@/utils/helpers/quantityInputConfig';

const EditFormFields = ({ watchedUnit }: { watchedUnit: UnitType }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IngredientFormData>();
  const quantityConfig = getQuantityInputConfig(watchedUnit);

  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      {/* Nome */}
      <div className="flex w-full flex-col gap-2 md:flex-1">
        <label
          htmlFor="name"
          className="text-primary block text-left text-base font-medium sm:text-center md:text-left"
        >
          Nome do ingrediente
        </label>
        <Input
          {...register('name')}
          id="name"
          placeholder="Digite o nome do ingrediente"
          className={clsx(
            'focus:border-primary focus:ring-primary h-14 rounded-xl border-2 px-4 text-base transition-all focus:ring-2 sm:h-14 sm:text-lg',
            errors.name && 'border-on-critical focus:border-on-critical focus:ring-on-critical'
          )}
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Quantidade com Unidade */}
      <div className="w-full">
        <QuantityWithUnitInput
          label="Quantidade"
          min={quantityConfig.min}
          placeholder="0,000"
          quantityError={errors.quantity?.message}
          unitError={errors.unit?.message}
        />
      </div>

      {/* Preço de compra */}
      <div className="w-full">
        <NumericInput
          name="buyPrice"
          label="Preço de compra"
          step={0.001}
          min={0}
          placeholder="0,00"
          error={errors.buyPrice?.message}
        />
      </div>

      {/* Min Quantity */}
      <div className="w-full">
        <NumericInput
          name="minQuantity"
          label="Qtd. Mínima"
          step={quantityConfig.step}
          min={0}
          placeholder="0,000"
          error={errors.minQuantity?.message}
        />
      </div>

      {/* Max Quantity */}
      <div className="w-full">
        <NumericInput
          name="maxQuantity"
          label="Qtd. Máxima"
          step={quantityConfig.step}
          min={0}
          placeholder="0,000"
          error={errors.maxQuantity?.message}
        />
      </div>
    </div>
  );
};

export default EditFormFields;
