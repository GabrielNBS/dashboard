# Sistema de Validação e Tratamento de Unidades

## Visão Geral

Este sistema implementa validação robusta com Zod e React Hook Form, além de um tratamento especializado para diferentes tipos de unidades de medida.

## Componentes Principais

### 1. Validação com Zod (`validationSchemas.ts`)

- **Schema de validação**: Define regras para nome, quantidade, unidade e preço
- **Validação em tempo real**: Verifica valores conforme o usuário digita
- **Validação específica por unidade**: Diferentes regras para kg, l e un

### 2. Tratamento de Unidades (`normalizeQuantity.ts`)

#### Tipos de Unidade:

**Quilos (kg)**
- Convertido para gramas internamente (1kg = 1000g)
- Valores mínimos: 0.001 kg
- Valores máximos: 1000 kg
- Precisão: 3 casas decimais

**Litros (l)**
- Convertido para mililitros internamente (1l = 1000ml)
- Valores mínimos: 0.001 l
- Valores máximos: 1000 l
- Precisão: 3 casas decimais

**Unidades (un)**
- Valores inteiros apenas
- Valores mínimos: 1 un
- Valores máximos: 10000 un
- Sem casas decimais

### 3. Funções Utilitárias

#### `normalizeQuantity(quantity, unit)`
Converte a quantidade para a unidade base interna:
- kg → gramas
- l → mililitros
- un → unidades (mantém inteiro)

#### `denormalizeQuantity(normalizedQuantity, unit)`
Converte de volta para a unidade original:
- gramas → kg
- mililitros → l
- unidades → un

#### `calculateUnitCost(totalValue, quantity, unit)`
Calcula o custo por unidade base:
- kg: custo por grama
- l: custo por mililitro
- un: custo por unidade

#### `formatQuantity(quantity, unit)`
Formata a quantidade para exibição:
- kg: "1.500 kg"
- l: "0.750 l"
- un: "10 un"

## Como Usar

### 1. Formulário com Validação

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ingredientSchema } from '@/utils/validationSchemas';

const {
  register,
  handleSubmit,
  formState: { errors },
  watch,
} = useForm({
  resolver: zodResolver(ingredientSchema),
});
```

### 2. Validação em Tempo Real

```tsx
const watchedUnit = watch('unit');

// Validação específica por unidade
const validateQuantity = (value: string) => {
  const numValue = parseFloat(value);
  const unitError = validateQuantityByUnit(numValue, watchedUnit);
  if (unitError) {
    setError('quantity', { message: unitError });
  }
};
```

### 3. Processamento de Dados

```tsx
const onSubmit = (data: IngredientFormData) => {
  const normalizedQuantity = normalizeQuantity(
    parseFloat(data.quantity), 
    data.unit
  );
  
  const newIngredient = {
    // ... outros campos
    quantity: normalizedQuantity,
    unit: data.unit,
    totalValue: normalizedQuantity * parseFloat(data.buyPrice),
  };
};
```

## Vantagens do Sistema

1. **Validação Robusta**: Zod garante tipos seguros e validação completa
2. **UX Melhorada**: Feedback em tempo real sobre erros
3. **Flexibilidade**: Diferentes regras para diferentes tipos de unidade
4. **Precisão**: Conversões automáticas para cálculos precisos
5. **Manutenibilidade**: Código organizado e bem documentado

## Exemplos de Uso

### Validação de Quantidade por Unidade

```tsx
// Para kg: aceita 0.001 a 1000
validateQuantityByUnit(0.5, 'kg'); // null (válido)
validateQuantityByUnit(0.0001, 'kg'); // "Quantidade em kg deve ser pelo menos 0.001"

// Para un: aceita apenas inteiros de 1 a 10000
validateQuantityByUnit(5, 'un'); // null (válido)
validateQuantityByUnit(5.5, 'un'); // "Quantidade em unidades deve ser um número inteiro"
```

### Conversão de Unidades

```tsx
// Normalização
normalizeQuantity(1.5, 'kg'); // 1500 (gramas)
normalizeQuantity(0.75, 'l'); // 750 (mililitros)
normalizeQuantity(10, 'un'); // 10 (unidades)

// Desnormalização
denormalizeQuantity(1500, 'kg'); // 1.5
denormalizeQuantity(750, 'l'); // 0.75
denormalizeQuantity(10, 'un'); // 10
``` 