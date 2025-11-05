/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada em reais brasileiros
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(0) // "R$ 0,00"
 */
export function formatCurrency(value: number): string {
  // Validação de entrada
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('formatCurrency: valor inválido fornecido, retornando R$ 0,00');
    return 'R$ 0,00';
  }

  // Trata valores infinitos
  if (!isFinite(value)) {
    return value === Infinity ? 'R$ ∞' : value === -Infinity ? 'R$ -∞' : 'R$ N/A';
  }

  // Trata valores muito grandes (acima de 1 trilhão)
  if (Math.abs(value) >= 1e12) {
    const simplified = value / 1e12;
    return `R$ ${simplified.toFixed(1).replace('.', ',')}T`;
  }

  // Trata valores muito grandes (acima de 1 bilhão)
  if (Math.abs(value) >= 1e9) {
    const simplified = value / 1e9;
    return `R$ ${simplified.toFixed(1).replace('.', ',')}B`;
  }

  // Trata valores grandes (acima de 1 milhão)
  if (Math.abs(value) >= 1e6) {
    const simplified = value / 1e6;
    return `R$ ${simplified.toFixed(1).replace('.', ',')}M`;
  }

  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    // Fallback para formatação manual
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
}

/**
 * Formata um valor percentual para exibição
 * @param value - Valor percentual (0-100)
 * @returns String formatada com símbolo de porcentagem
 * @example
 * formatPercent(25.5) // "25,50%"
 */
export function formatPercent(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('formatPercent: valor inválido fornecido, retornando 0,00%');
    return '0,00%';
  }

  // Trata valores infinitos
  if (!isFinite(value)) {
    return value === Infinity ? '∞%' : value === -Infinity ? '-∞%' : 'N/A%';
  }

  // Trata valores muito grandes (acima de 10000%)
  if (Math.abs(value) >= 10000) {
    const simplified = value / 1000;
    return `${simplified.toFixed(1).replace('.', ',')}k%`;
  }

  try {
    return `${value.toFixed(2).replace('.', ',')}%`;
  } catch (error) {
    console.error('Erro ao formatar percentual:', error);
    return '0,00%';
  }
}
