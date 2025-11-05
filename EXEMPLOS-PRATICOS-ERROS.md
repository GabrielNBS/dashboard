# 📊 Exemplos Práticos dos Erros e Correções

## Exemplo 1: Erro no Cálculo de Margem

### Cenário

Produto em lote: **Bolo de Chocolate**

- Custo total dos ingredientes: R$ 80,00
- Custo de embalagem e outros: R$ 20,00
- **Custo total (totalCost):** R$ 100,00
- Rendimento (yieldQuantity): 10 fatias
- **Custo unitário (unitCost):** R$ 10,00 por fatia
- Preço de venda unitário: R$ 15,00 por fatia

### ❌ ANTES (Incorreto)

**Venda de 5 fatias:**

```typescript
// calculateProportionalIngredientCost (ERRADO)
const totalLotIngredientCost = 80.00  // Apenas ingredientes
const proportion = 5 / 10 = 0.5
const proportionalCost = 80.00 × 0.5 = R$ 40,00

// calculateProportionalProfitMargin (ERRADO)
const totalRevenue = 15.00 × 5 = R$ 75,00
const margin = ((75 - 40) / 75) × 100 = 46.67%
```

**Problema:** Margem de 46.67% está **ERRADA** porque ignora os R$ 20,00 de outros custos!

### ✅ DEPOIS (Correto)

**Venda de 5 fatias:**

```typescript
// calculateProportionalIngredientCost (CORRETO)
const proportionalCost = unitCost × soldQuantity
const proportionalCost = 10.00 × 5 = R$ 50,00

// calculateProportionalProfitMargin (CORRETO)
const totalRevenue = 15.00 × 5 = R$ 75,00
const totalCost = 10.00 × 5 = R$ 50,00
const margin = ((75 - 50) / 75) × 100 = 33.33%
```

**Resultado:** Margem de 33.33% está **CORRETA** e considera todos os custos!

**Diferença:** 46.67% - 33.33% = **13.34% de erro** na margem!

---

## Exemplo 2: Erro no Uso de Preços

### Cenário

**Produto Individual:** Suco Natural

- Custo total: R$ 5,00
- Rendimento: 1 unidade
- Custo unitário: R$ 5,00
- **sellingPrice:** R$ 8,00 (campo legado)
- **unitSellingPrice:** R$ 8,00

**Produto em Lote:** Pizza

- Custo total: R$ 40,00
- Rendimento: 8 fatias
- Custo unitário: R$ 5,00
- **sellingPrice:** R$ 40,00 (preço do lote completo)
- **unitSellingPrice:** R$ 6,00 (preço por fatia)

### ❌ ANTES (Inconsistente)

```typescript
// UnifiedShoppingCart.tsx (ERRADO)
const unitPrice = isBatchProduct
  ? product.production.unitSellingPrice // Pizza: R$ 6,00 ✓
  : product.production.sellingPrice; // Suco: R$ 8,00 ✓

// Funciona, mas é inconsistente!
```

**Problema:** Usa campos diferentes para produtos diferentes. Se `sellingPrice` for o preço do lote completo para produtos individuais, daria erro!

### ✅ DEPOIS (Consistente)

```typescript
// UnifiedShoppingCart.tsx (CORRETO)
const unitPrice = product.production.unitSellingPrice;
// Pizza: R$ 6,00 ✓
// Suco: R$ 8,00 ✓

// Sempre usa o mesmo campo!
```

**Resultado:** Código mais simples, previsível e sem condicionais desnecessárias.

---

## Exemplo 3: Impacto Financeiro Real

### Cenário Real

Padaria vendendo **Pão Francês** em lote

**Dados do Produto:**

- Farinha: R$ 20,00
- Fermento: R$ 5,00
- Sal: R$ 1,00
- Água: R$ 0,50
- **Custo ingredientes:** R$ 26,50
- Energia elétrica: R$ 8,00
- Gás: R$ 5,00
- Embalagem: R$ 2,50
- **Custo total:** R$ 42,00
- Rendimento: 50 pães
- **Custo unitário:** R$ 0,84 por pão
- Preço de venda: R$ 1,50 por pão

### ❌ Cálculo ERRADO (Antes)

**Venda de 30 pães:**

```
Receita: 30 × R$ 1,50 = R$ 45,00
Custo (ERRADO): 26,50 × (30/50) = R$ 15,90
Lucro (ERRADO): R$ 45,00 - R$ 15,90 = R$ 29,10
Margem (ERRADA): (29,10 / 45,00) × 100 = 64.67%
```

**Decisão baseada no erro:**

- "Estou tendo 64.67% de margem!"
- "Posso dar desconto de 20%!"
- "Vou vender a R$ 1,20 e ainda ter 44.67% de margem!"

### ✅ Cálculo CORRETO (Depois)

**Venda de 30 pães:**

```
Receita: 30 × R$ 1,50 = R$ 45,00
Custo (CORRETO): 0,84 × 30 = R$ 25,20
Lucro (CORRETO): R$ 45,00 - R$ 25,20 = R$ 19,80
Margem (CORRETA): (19,80 / 45,00) × 100 = 44.00%
```

**Decisão baseada no correto:**

- "Estou tendo 44% de margem"
- "Desconto de 20% me deixaria com 24% de margem"
- "Preciso avaliar se vale a pena"

### 💰 Impacto Financeiro

**Se der desconto de 20% baseado no cálculo errado:**

```
Novo preço: R$ 1,20 por pão
Receita: 30 × R$ 1,20 = R$ 36,00
Custo real: R$ 25,20
Lucro real: R$ 36,00 - R$ 25,20 = R$ 10,80
Margem real: (10,80 / 36,00) × 100 = 30.00%
```

**Comparação:**

- Pensava ter: 44.67% de margem
- Tem na verdade: 30.00% de margem
- **Diferença: 14.67% de margem perdida!**

**Em um mês (vendendo 900 pães):**

```
Lucro esperado (errado): R$ 873,00
Lucro real: R$ 324,00
Prejuízo por decisão errada: R$ 549,00 por mês!
```

---

## Exemplo 4: Venda Parcial de Lote

### Cenário

**Torta de Frango** (produto em lote)

- Custo total: R$ 60,00
- Rendimento: 12 fatias
- Custo unitário: R$ 5,00
- Preço unitário: R$ 9,00
- Quantidade produzida: 12 fatias

### Venda 1: 5 fatias

#### ✅ Cálculos Corretos

```typescript
// Custo
custoTotal = 5,00 × 5 = R$ 25,00

// Receita
receitaTotal = 9,00 × 5 = R$ 45,00

// Lucro
lucro = 45,00 - 25,00 = R$ 20,00

// Margem
margem = (20,00 / 45,00) × 100 = 44.44%

// Estoque
producedQuantity = 12 - 5 = 7 fatias restantes
```

### Venda 2: Mais 4 fatias

```typescript
// Custo
custoTotal = 5,00 × 4 = R$ 20,00

// Receita
receitaTotal = 9,00 × 4 = R$ 36,00

// Lucro
lucro = 36,00 - 20,00 = R$ 16,00

// Margem
margem = (16,00 / 36,00) × 100 = 44.44%

// Estoque
producedQuantity = 7 - 4 = 3 fatias restantes
```

### Resumo do Lote

```
Total vendido: 9 fatias
Total restante: 3 fatias

Receita total: R$ 81,00
Custo das vendidas: R$ 45,00
Lucro: R$ 36,00
Margem: 44.44%

Custo das restantes: R$ 15,00
Valor potencial: R$ 27,00
```

**Observação:** A margem se mantém constante (44.44%) independente de quantas fatias são vendidas, porque o cálculo está correto!

---

## Exemplo 5: Comparação Produto Individual vs Lote

### Produto Individual: Brigadeiro

```
Custo total: R$ 2,00
Rendimento: 1 unidade
Custo unitário: R$ 2,00
Preço unitário: R$ 4,00
Margem: ((4 - 2) / 4) × 100 = 50%
```

### Produto em Lote: Brigadeiro (caixa com 10)

```
Custo total: R$ 18,00 (economia de escala)
Rendimento: 10 unidades
Custo unitário: R$ 1,80
Preço unitário: R$ 3,50
Margem: ((3,50 - 1,80) / 3,50) × 100 = 48.57%
```

### Análise

**Venda de 10 brigadeiros:**

**Opção 1: Individual (10 vendas separadas)**

```
Receita: 10 × R$ 4,00 = R$ 40,00
Custo: 10 × R$ 2,00 = R$ 20,00
Lucro: R$ 20,00
Margem: 50%
```

**Opção 2: Lote (1 lote de 10)**

```
Receita: 10 × R$ 3,50 = R$ 35,00
Custo: 10 × R$ 1,80 = R$ 18,00
Lucro: R$ 17,00
Margem: 48.57%
```

**Conclusão:**

- Lote tem margem menor (48.57% vs 50%)
- Mas custo menor (R$ 18 vs R$ 20)
- Preço mais competitivo (R$ 3,50 vs R$ 4,00)
- Pode vender mais volume!

---

## 🎯 Conclusão dos Exemplos

### Erros Identificados e Corrigidos:

1. **Margem superestimada em até 14%**

   - Causa: Ignorar custos além de ingredientes
   - Impacto: Decisões financeiras erradas

2. **Inconsistência de preços**

   - Causa: Usar campos diferentes para produtos diferentes
   - Impacto: Código confuso e propenso a erros

3. **Cálculos redundantes**
   - Causa: Recalcular custos já calculados
   - Impacto: Performance e inconsistência

### Benefícios das Correções:

✅ Margens calculadas corretamente
✅ Decisões financeiras baseadas em dados reais
✅ Código mais simples e consistente
✅ Melhor performance
✅ Facilita manutenção futura
