// Exemplo de testes para demonstrar o funcionamento do sistema
// Este arquivo não é executado, apenas para documentação

import {
  normalizeQuantity,
  denormalizeQuantity,
  calculateUnitCost,
  formatQuantity,
  getBaseUnit,
} from './normalizeQuantity';
import { validateQuantityByUnit } from '../schemas/validationSchemas';

// Testes de normalização
console.log('=== Testes de Normalização ===');
console.log('1.5 kg →', normalizeQuantity(1.5, 'kg'), 'g'); // 1500 g
console.log('0.75 l →', normalizeQuantity(0.75, 'l'), 'ml'); // 750 ml
console.log('10 un →', normalizeQuantity(10, 'un'), 'un'); // 10 un

// Testes de desnormalização
console.log('\n=== Testes de Desnormalização ===');
console.log('1500 g →', denormalizeQuantity(1500, 'kg'), 'kg'); // 1.5 kg
console.log('750 ml →', denormalizeQuantity(750, 'l'), 'l'); // 0.75 l
console.log('10 un →', denormalizeQuantity(10, 'un'), 'un'); // 10 un

// Testes de validação
console.log('\n=== Testes de Validação ===');
console.log('0.5 kg:', validateQuantityByUnit(0.5, 'kg')); // null (válido)
console.log('0.0001 kg:', validateQuantityByUnit(0.0001, 'kg')); // erro
console.log('5 un:', validateQuantityByUnit(5, 'un')); // null (válido)
console.log('5.5 un:', validateQuantityByUnit(5.5, 'un')); // erro

// Testes de formatação
console.log('\n=== Testes de Formatação ===');
console.log('1.5 kg:', formatQuantity(1.5, 'kg')); // "1.500 kg"
console.log('0.75 l:', formatQuantity(0.75, 'l')); // "0.750 l"
console.log('10 un:', formatQuantity(10, 'un')); // "10 un"

// Testes de custo unitário
console.log('\n=== Testes de Custo Unitário ===');
console.log('Custo por grama (1kg = R$10):', calculateUnitCost(10, 1, 'kg')); // 0.01 por grama
console.log('Custo por ml (1l = R$5):', calculateUnitCost(5, 1, 'l')); // 0.005 por ml
console.log('Custo por unidade (10un = R$20):', calculateUnitCost(20, 10, 'un')); // 2 por unidade

// Testes de unidade base
console.log('\n=== Testes de Unidade Base ===');
console.log('kg →', getBaseUnit('kg')); // g
console.log('l →', getBaseUnit('l')); // ml
console.log('un →', getBaseUnit('un')); // un

/*
Exemplo de saída esperada:

=== Testes de Normalização ===
1.5 kg → 1500 g
0.75 l → 750 ml
10 un → 10 un

=== Testes de Desnormalização ===
1500 g → 1.5 kg
750 ml → 0.75 l
10 un → 10 un

=== Testes de Validação ===
0.5 kg: null
0.0001 kg: Quantidade em kg deve ser pelo menos 0.001
5 un: null
5.5 un: Quantidade em unidades deve ser um número inteiro

=== Testes de Formatação ===
1.5 kg: 1.500 kg
0.75 l: 0.750 l
10 un: 10 un

=== Testes de Custo Unitário ===
Custo por grama (1kg = R$10): 0.01
Custo por ml (1l = R$5): 0.005
Custo por unidade (10un = R$20): 2

=== Testes de Unidade Base ===
kg → g
l → ml
un → un
*/
