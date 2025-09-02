import { UnitType } from '@/types/ingredients';

export function getQuantityInputConfig(unit: UnitType) {
  switch (unit) {
    case 'un':
      return {
        step: 1,
        min: 1,
        placeholder: 'Ex: 3 unidades',
      };
    case 'kg':
    case 'l':
      return {
        step: 0.001,
        min: 0.001,
        placeholder: unit === 'kg' ? 'Ex: 0.5 kg' : 'Ex: 0.75 l',
      };
    default:
      return {
        step: 'any',
        min: 0.001,
        placeholder: `Quantidade (${unit})`,
      };
  }
}
