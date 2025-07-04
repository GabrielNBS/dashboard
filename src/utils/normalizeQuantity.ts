import { UnitType } from '@/types/ingredients';

export function normalizeQuantity(quantity: number, unit: UnitType): number {
  switch (unit) {
    case 'kg':
    case 'l':
      return quantity * 1000; // converte para gramas ou mililitros
    case 'un':
    default:
      return Math.round(quantity); // unidade inteira
  }
}
