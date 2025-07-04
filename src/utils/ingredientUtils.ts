// Formata unidade automaticamente com base na quantidade
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

// Retorna status de estoque com base na unidade
export function getStockStatus(
  quantity: number,
  unit: string
): 'Em estoque' | 'Estoque baixo' | 'Sem estoque' {
  const threshold = unit === 'un' ? 3 : 300; // ex: 300g ou 300ml ≈ 3 unidades
  if (quantity === 0) return 'Sem estoque';
  if (quantity < threshold) return 'Estoque baixo';
  return 'Em estoque';
}
