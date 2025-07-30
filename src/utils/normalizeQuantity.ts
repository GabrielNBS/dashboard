import { UnitType } from '@/types/ingredients';

// Função para normalizar quantidade baseada na unidade
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

// Função para converter quantidade normalizada de volta para a unidade original
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

// Função para calcular o custo por unidade baseada no tipo
export function calculateUnitCost(totalValue: number, quantity: number, unit: UnitType): number {
  const normalizedQty = normalizeQuantity(quantity, unit);

  if (normalizedQty === 0) return 0;

  switch (unit) {
    case 'kg':
      // Custo por grama
      return totalValue / normalizedQty;

    case 'l':
      // Custo por mililitro
      return totalValue / normalizedQty;

    case 'un':
    default:
      // Custo por unidade
      return totalValue / normalizedQty;
  }
}

// Função para formatar quantidade para exibição
export function formatQuantity(quantity: number, unit: UnitType): string {
  switch (unit) {
    case 'kg':
      return `${quantity.toFixed(3)} kg`;

    case 'l':
      return `${quantity.toFixed(3)} l`;

    case 'un':
    default:
      return `${Math.round(quantity)} un`;
  }
}

// Função para obter a unidade de medida base para cálculos
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
