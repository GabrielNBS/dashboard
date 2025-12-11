import { UnitType } from '@/types/ingredients';

export function normalizeQuantity(quantity: number, unit: UnitType): number {
  switch (unit) {
    case 'kg':
      return Math.round(quantity * 1000);

    case 'l':
      return Math.round(quantity * 1000);

    case 'g':
    case 'ml':
      return Math.round(quantity);

    case 'un':
    default:
      return Math.round(quantity);
  }
}

export function denormalizeQuantity(normalizedQuantity: number, unit: UnitType): number {
  switch (unit) {
    case 'kg':
      return normalizedQuantity / 1000;

    case 'l':
      return normalizedQuantity / 1000;

    case 'g':
    case 'ml':
      return normalizedQuantity;

    case 'un':
    default:
      return normalizedQuantity;
  }
}

export function calculateUnitCost(buyPrice: number, quantity: number, unit: UnitType): number {
  const normalizedQty = normalizeQuantity(quantity, unit);

  if (normalizedQty === 0) return 0;

  return buyPrice / normalizedQty;
}

export function formatQuantity(quantity: number, unit: string): string {
  const baseUnit = getBaseUnit(unit as UnitType);

  if (baseUnit === 'g') {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(2)} kg`;
    if (quantity < 1 && quantity > 0) return `${quantity.toFixed(2)} g`;
    return `${Math.round(quantity)} g`;
  }

  if (baseUnit === 'ml') {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(2)} l`;
    if (quantity < 1 && quantity > 0) return `${quantity.toFixed(2)} ml`;
    return `${Math.round(quantity)} ml`;
  }

  if (baseUnit === 'un') {
    if (quantity % 1 !== 0) return `${quantity.toFixed(2)} un`;
    return `${Math.round(quantity)} un`;
  }

  return `${quantity} ${unit}`;
}

export function getBaseUnit(unit: UnitType): UnitType {
  switch (unit) {
    case 'kg':
    case 'g':
      return 'g';
    case 'l':
    case 'ml':
      return 'ml';
    case 'un':
    default:
      return 'un';
  }
}

export function formatStockDisplay(
  quantity: number,
  unit: string,
  weightPerUnit?: number,
  weightUnit?: string
): string {
  if (unit === 'un' && weightPerUnit && weightUnit) {
    const fullUnits = Math.floor(quantity);
    const remainder = quantity - fullUnits;

    if (remainder > 0.001) {
      const remainderWeight = remainder * weightPerUnit;
      const formattedWeight = formatQuantity(remainderWeight, weightUnit);

      if (fullUnits === 0) {
        return `0 un + ${formattedWeight}`;
      }

      return `${fullUnits} un + ${formattedWeight}`;
    }
  }

  return formatQuantity(quantity, unit);
}

export function weightToUnits(weight: number, weightPerUnit: number): number {
  if (weightPerUnit <= 0) return 0;
  return weight / weightPerUnit;
}

export function unitsToWeight(units: number, weightPerUnit: number): number {
  return units * weightPerUnit;
}

export function calculateWeightCost(
  weight: number,
  weightPerUnit: number,
  pricePerUnit: number
): number {
  const unitsUsed = weightToUnits(weight, weightPerUnit);
  return unitsUsed * pricePerUnit;
}
