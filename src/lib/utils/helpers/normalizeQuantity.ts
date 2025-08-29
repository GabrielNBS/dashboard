import { UnitType } from '@/types/ingredients';

/**
 * Normaliza quantidade para uma unidade base para facilitar cálculos.
 *
 * Converte kg para gramas e litros para mililitros para padronizar
 * os cálculos internos do sistema.
 *
 * @param quantity - Quantidade a ser normalizada
 * @param unit - Unidade de medida original
 * @returns Quantidade normalizada na unidade base
 *
 * @example
 * normalizeQuantity(1.5, 'kg') // 1500 (gramas)
 * normalizeQuantity(2.5, 'l') // 2500 (mililitros)
 * normalizeQuantity(10, 'un') // 10 (unidades)
 */
export function normalizeQuantity(quantity: number, unit: UnitType): number {
  switch (unit) {
    case 'kg':
      // Converte kg para gramas (1000g = 1kg)
      return Math.round(quantity * 1000);

    case 'l':
      // Converte litros para mililitros (1000ml = 1l)
      return Math.round(quantity * 1000);

    case 'un':
    default:
      // Unidades permanecem como números inteiros
      return Math.round(quantity);
  }
}

/**
 * Converte quantidade normalizada de volta para a unidade original.
 *
 * @param normalizedQuantity - Quantidade normalizada
 * @param unit - Unidade de medida original
 * @returns Quantidade na unidade original
 *
 * @example
 * denormalizeQuantity(1500, 'kg') // 1.5
 * denormalizeQuantity(2500, 'l') // 2.5
 * denormalizeQuantity(10, 'un') // 10
 */
export function denormalizeQuantity(normalizedQuantity: number, unit: UnitType): number {
  switch (unit) {
    case 'kg':
      // Converte gramas de volta para kg
      return normalizedQuantity / 1000;

    case 'l':
      // Converte mililitros de volta para litros
      return normalizedQuantity / 1000;

    case 'un':
    default:
      // Unidades permanecem como estão
      return normalizedQuantity;
  }
}

/**
 * Calcula o custo por unidade baseada no tipo de unidade.
 *
 * @param buyPrice - Valor total pago
 * @param quantity - Quantidade comprada
 * @param unit - Unidade de medida
 * @returns Custo por unidade base
 *
 * @example
 * calculateUnitCost(100, 2, 'kg') // 0.05 (custo por grama)
 * calculateUnitCost(50, 10, 'un') // 5 (custo por unidade)
 */
export function calculateUnitCost(buyPrice: number, quantity: number, unit: UnitType): number {
  const normalizedQty = normalizeQuantity(quantity, unit);

  if (normalizedQty === 0) return 0;

  switch (unit) {
    case 'kg':
      // Custo por grama
      return buyPrice / normalizedQty;

    case 'l':
      // Custo por mililitro
      return buyPrice / normalizedQty;

    case 'un':
    default:
      // Custo por unidade
      return buyPrice / normalizedQty;
  }
}

/**
 * Formata quantidade para exibição com unidade apropriada.
 *
 * Converte automaticamente para unidades maiores quando apropriado
 * (ex: 1500g vira 1.50 kg).
 *
 * @param quantity - Quantidade em unidade base
 * @param unit - Unidade de medida original
 * @returns String formatada para exibição
 *
 * @example
 * formatQuantity(1500, 'g') // "1.50 kg"
 * formatQuantity(500, 'g') // "500 g"
 * formatQuantity(10, 'un') // "10 un"
 */
export function formatQuantity(quantity: number, unit: string): string {
  const baseUnit = getBaseUnit(unit as UnitType);

  if (baseUnit === 'g') {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(2)} kg`;
    return `${quantity} g`;
  }

  if (baseUnit === 'ml') {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(2)} l`;
    return `${quantity} ml`;
  }

  if (baseUnit === 'un') {
    return `${quantity} un`;
  }

  return `${quantity} ${unit}`; // fallback
}

/**
 * Obtém a unidade de medida base para cálculos internos.
 *
 * @param unit - Unidade de medida
 * @returns Unidade base para cálculos
 *
 * @example
 * getBaseUnit('kg') // 'g'
 * getBaseUnit('l') // 'ml'
 * getBaseUnit('un') // 'un'
 */
export function getBaseUnit(unit: UnitType): string {
  switch (unit) {
    case 'kg':
      return 'g'; // gramas
    case 'l':
      return 'ml'; // mililitros
    case 'un':
    default:
      return 'un'; // unidades
  }
}
