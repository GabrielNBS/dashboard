/**
 * Formata unidade automaticamente com base na quantidade.
 *
 * Converte automaticamente para unidades maiores quando apropriado
 * para melhor legibilidade (ex: 1500g vira 1.50 kg).
 *
 * @param quantity - Quantidade em unidade base
 * @param unit - Unidade de medida
 * @returns String formatada para exibição
 *
 * @example
 * formatUnitDisplay(1500, 'g') // "1.50 kg"
 * formatUnitDisplay(500, 'g') // "500 g"
 * formatUnitDisplay(10, 'un') // "10 un"
 */
export function formatUnitDisplay(quantity: number, unit: string): string {
  if (unit === 'g') {
    return quantity >= 1000 ? `${(quantity / 1000).toFixed(2)} kg` : `${quantity} g`;
  }

  if (unit === 'ml') {
    return quantity >= 1000 ? `${(quantity / 1000).toFixed(2)} l` : `${quantity} ml`;
  }

  if (unit === 'un') {
    return `${Math.floor(quantity)} un`;
  }

  return `${quantity} ${unit}`;
}

/**
 * Retorna status de estoque com base na quantidade disponível.
 *
 * Define automaticamente thresholds apropriados para cada tipo
 * de unidade para determinar se o estoque está baixo.
 *
 * @param quantity - Quantidade disponível em estoque
 * @param unit - Unidade de medida
 * @returns Status do estoque
 *
 * @example
 * getStockStatus(0, 'un') // "Sem estoque"
 * getStockStatus(2, 'un') // "Estoque baixo"
 * getStockStatus(10, 'un') // "Em estoque"
 */
export function getStockStatus(
  quantity: number,
  unit: string
): 'Em estoque' | 'Estoque baixo' | 'Sem estoque' {
  // Define threshold baseado na unidade
  // Para unidades: 3 unidades
  // Para peso/volume: 300g ou 300ml (equivalente a ~3 unidades)
  const threshold = unit === 'un' ? 3 : 300;

  if (quantity === 0) return 'Sem estoque';
  if (quantity < threshold) return 'Estoque baixo';
  return 'Em estoque';
}
