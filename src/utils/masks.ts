/**
 * Utilitários de máscaras para inputs
 * Centraliza todas as funções de formatação e validação de entrada
 */

/**
 * Máscara para telefone brasileiro
 * Formatos: (11) 98888-8888 ou (11) 3888-8888
 */
export function phoneMask(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 10) {
    // Telefone fixo: (11) 3888-8888
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14);
  }

  // Celular: (11) 98888-8888
  return numbers
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
}

/**
 * Máscara para e-mail (validação básica)
 */
export function emailMask(value: string): string {
  // Remove espaços e caracteres inválidos
  return value
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/[^a-z0-9@._-]/g, '');
}

/**
 * Máscara para CPF
 * Formato: 123.456.789-01
 */
export function cpfMask(value: string): string {
  const numbers = value.replace(/\D/g, '');

  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}

/**
 * Máscara para CNPJ
 * Formato: 12.345.678/0001-90
 */
export function cnpjMask(value: string): string {
  const numbers = value.replace(/\D/g, '');

  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
}

/**
 * Máscara para CEP
 * Formato: 12345-678
 */
export function cepMask(value: string): string {
  const numbers = value.replace(/\D/g, '');

  return numbers.replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
}

/**
 * Máscara para moeda (R$)
 * Formato: R$ 1.234,56
 */
export function currencyMask(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'R$ 0,00';

  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Remove máscara de telefone
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Remove máscara de CPF
 */
export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Remove máscara de CNPJ
 */
export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Remove máscara de CEP
 */
export function unmaskCEP(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida e-mail
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, '');

  if (numbers.length !== 14) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let size = numbers.length - 2;
  let nums = numbers.substring(0, size);
  const digits = numbers.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(nums.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  nums = numbers.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(nums.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
}

/**
 * Valida CEP
 */
export function isValidCEP(cep: string): boolean {
  const numbers = cep.replace(/\D/g, '');
  return numbers.length === 8;
}
