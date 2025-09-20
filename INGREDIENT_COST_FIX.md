# Correção da Lógica de Custos Variáveis dos Ingredientes

## Problema Identificado

Havia uma desconexão na lógica de negócio onde:

1. **Ingredientes cadastrados** tinham preços reais (`averageUnitPrice`) usados para calcular custos dos produtos
2. **Custos variáveis** eram calculados apenas com base em configurações manuais, ignorando os custos reais dos ingredientes
3. **Resultado**: As métricas financeiras não refletiam os custos reais dos ingredientes utilizados nas vendas

## Solução Implementada

### 1. Nova Função: `getRealIngredientsCost()`

```typescript
export function getRealIngredientsCost(sales: Sale[]): number {
  return sales.reduce((totalCost, sale) => {
    const saleCost = sale.items.reduce((itemsCost, item) => {
      const ingredientsCost =
        item.product?.production?.ingredients?.reduce((ingCost, ingredient) => {
          const unitIngredientCost =
            (ingredient.averageUnitPrice || 0) * (ingredient.totalQuantity || 0);

          const unitCost =
            item.product.production.mode === 'lote' && item.product.production.yieldQuantity > 0
              ? unitIngredientCost / item.product.production.yieldQuantity
              : unitIngredientCost;

          return ingCost + unitCost;
        }, 0) || 0;

      return itemsCost + ingredientsCost * item.quantity;
    }, 0);

    return totalCost + saleCost;
  }, 0);
}
```

### 2. Nova Função: `getIntegratedVariableCost()`

```typescript
export function getIntegratedVariableCost(
  variableCosts: VariableCostSettings[],
  sales: Sale[],
  totalRevenue: number,
  totalUnitsSold: number
): number {
  // Filtra custos que não são ingredientes (evita duplicação)
  const nonIngredientCosts = variableCosts.filter(cost => cost.type !== 'ingredientes');

  // Custos configurados (embalagens, comissões, etc.)
  const configuredCosts = getTotalVariableCost(nonIngredientCosts, totalRevenue, totalUnitsSold);

  // Custos reais dos ingredientes
  const realIngredientsCost = getRealIngredientsCost(sales);

  return configuredCosts + realIngredientsCost;
}
```

### 3. Atualização dos Hooks

- **`useSummaryFinance`**: Agora usa `getIntegratedVariableCost()` em vez de `getTotalVariableCost()`
- **`useDashboardMetrics`**: Também atualizado para usar a nova função integrada

### 4. Componente de Análise

Criado `IngredientCostBreakdownCard` que mostra:

- Custo real dos ingredientes (baseado nas vendas)
- Custo configurado manualmente
- Diferença entre eles
- Alertas quando há discrepâncias significativas

## Como Usar

### Para Desenvolvedores

```typescript
import { getIntegratedVariableCost, getRealIngredientsCost } from '@/utils/calculations/finance';

// Usar a função integrada em vez da antiga
const totalVariableCost = getIntegratedVariableCost(
  variableCosts,
  sales,
  totalRevenue,
  totalUnitsSold
);

// Ou apenas o custo dos ingredientes
const ingredientsCost = getRealIngredientsCost(sales);
```

### Para Usuários

1. **Automático**: Os custos dos ingredientes agora são calculados automaticamente baseado nos produtos vendidos
2. **Configuração**: Mantenha as configurações de custos variáveis apenas para itens que não são ingredientes (embalagens, comissões, etc.)
3. **Monitoramento**: Use o novo card de análise para verificar se há discrepâncias entre custos reais e configurados

## Benefícios

1. **Precisão**: Métricas financeiras agora refletem custos reais dos ingredientes
2. **Automação**: Não precisa atualizar manualmente custos de ingredientes nas configurações
3. **Transparência**: Visibilidade clara da diferença entre custos reais e configurados
4. **Flexibilidade**: Mantém a possibilidade de configurar outros custos variáveis

## Migração

- **Compatibilidade**: A mudança é retrocompatível
- **Configurações existentes**: Custos variáveis do tipo 'ingredientes' são automaticamente filtrados para evitar duplicação
- **Dados históricos**: Vendas antigas continuam funcionando normalmente

## Próximos Passos

1. Testar com dados reais
2. Ajustar configurações de custos variáveis removendo entradas manuais de ingredientes
3. Monitorar as métricas usando o novo componente de análise
4. Considerar alertas automáticos quando há grandes discrepâncias
