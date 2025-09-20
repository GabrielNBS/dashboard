# Sistema de Trending Flexível

## Visão Geral

O sistema de trending foi atualizado para ser flexível e comparativo mensalmente, comparando automaticamente as métricas do período atual com o mesmo período do mês anterior.

## Funcionalidades

### 1. Comparação Mensal Automática

- Compara automaticamente o mês atual com o mês anterior
- Calcula a diferença percentual entre os períodos
- Mostra se a tendência é positiva ou negativa

### 2. Métricas Suportadas

- **Receita Total**: Aumento é positivo
- **Lucro Líquido**: Aumento é positivo
- **Margem de Lucro**: Aumento é positivo
- **Custo Variável**: Redução é positiva (lógica invertida)

### 3. Indicadores Visuais

- ↗️ **Verde**: Tendência positiva
- ↘️ **Vermelho**: Tendência negativa
- Porcentagem exata da variação
- Período de comparação ("vs mês anterior")

## Como Usar

### No CardWrapper

```tsx
// Trending dinâmico (novo)
<CardWrapper
  title="Receita Total"
  value={summary.totalRevenue}
  trending={trending.revenue}
/>

// Trending estático (compatibilidade)
<CardWrapper
  title="Receita Total"
  value={summary.totalRevenue}
  trending={true}
/>
```

### No Dashboard Principal

```tsx
const { summary, trending } = useDashboardMetrics();

<NetProfitCard summary={summary} trending={trending.netProfit} />;
```

## Estrutura de Dados

### TrendingData

```typescript
interface TrendingData {
  percentage: number; // Porcentagem da variação (sempre positiva)
  isPositive: boolean; // Se a tendência é positiva ou negativa
  period: string; // Período de comparação
}
```

### TrendingMetrics

```typescript
interface TrendingMetrics {
  revenue: TrendingData; // Tendência da receita
  netProfit: TrendingData; // Tendência do lucro líquido
  margin: TrendingData; // Tendência da margem
  variableCost: TrendingData; // Tendência dos custos variáveis
}
```

## Lógica de Cálculo

### Para Receita, Lucro e Margem

- **Positivo**: Quando o valor atual é maior que o anterior
- **Negativo**: Quando o valor atual é menor que o anterior

### Para Custos Variáveis

- **Positivo**: Quando o custo atual é menor que o anterior (economia)
- **Negativo**: Quando o custo atual é maior que o anterior (aumento de gasto)

## Casos Especiais

### Sem Dados do Mês Anterior

- Mostra 100% se há vendas no mês atual
- Mostra 0% se não há vendas em nenhum período

### Divisão por Zero

- Tratamento automático para evitar erros
- Fallback para valores padrão seguros

## Benefícios

1. **Automático**: Não precisa configurar períodos manualmente
2. **Flexível**: Funciona com qualquer quantidade de dados
3. **Intuitivo**: Cores e ícones indicam claramente a direção da tendência
4. **Preciso**: Cálculos baseados nos dados reais de vendas
5. **Compatível**: Mantém compatibilidade com o sistema anterior
