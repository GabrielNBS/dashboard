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
    return `R$ ${value.toFixed(3).replace('.', ',')}`;
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

  try {
    return `${value.toFixed(2).replace('.', ',')}%`;
  } catch (error) {
    console.error('Erro ao formatar percentual:', error);
    return '0,00%';
  }
}
