# Análise de Erros - Venda de Produtos em Lote

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. **ERRO CRÍTICO: Cálculo de Margem Incorreto**

**Localização:** `src/utils/calculations/batchSale.ts` - função `calculateProportionalProfitMargin`

**Problema:**

```typescript
export function calculateProportionalProfitMargin(
  product: ProductState,
  soldQuantity: number,
  sellingPrice: number
): number {
  const proportionalCost = calculateProportionalIngredientCost(product, soldQuantity);
  const totalRevenue = sellingPrice * soldQuantity;

  if (totalRevenue <= 0) return 0;

  return ((totalRevenue - proportionalCost) / totalRevenue) * 100;
}
```

**Erro:** A função está calculando a margem baseada APENAS no custo dos ingredientes, mas **NÃO considera o custo unitário real do produto** (`product.production.unitCost`).

**Impacto:**

- Para produtos em lote, o `unitCost` já considera o custo total dividido pelo rendimento
- A margem calculada está **superestimada** porque ignora custos operacionais e outros custos já calculados
- Inconsistência com a margem definida no produto

**Solução Correta:**

```typescript
export function calculateProportionalProfitMargin(
  product: ProductState,
  soldQuantity: number,
  sellingPrice: number
): number {
  // Usar o custo unitário já calculado do produto
  const totalCost = product.production.unitCost * soldQuantity;
  const totalRevenue = sellingPrice * soldQuantity;

  if (totalRevenue <= 0) return 0;

  return ((totalRevenue - totalCost) / totalRevenue) * 100;
}
```

---

### 2. **ERRO: Uso Inconsistente de Preços Unitários**

**Localização:** `src/components/features/pdv/UnifiedShoppingCart.tsx` (linhas 52-55)

**Problema:**

```typescript
// Calcula preços baseado no modo de produção
const unitPrice = isBatchProduct
  ? product.production.unitSellingPrice
  : product.production.sellingPrice;
```

**Erro:** Para produtos individuais, está usando `sellingPrice` (que é o preço total), quando deveria usar `unitSellingPrice` também.

**Impacto:**

- Produtos individuais podem ter preços incorretos no carrinho
- Inconsistência entre produtos em lote e individuais

**Solução:**

```typescript
// Sempre usar unitSellingPrice para consistência
const unitPrice = product.production.unitSellingPrice;
```

---

### 3. **ERRO: Cálculo de Custo Proporcional Duplicado**

**Localização:** `src/utils/calculations/batchSale.ts` - função `calculateProportionalIngredientCost`

**Problema:**

```typescript
export function calculateProportionalIngredientCost(
  product: ProductState,
  soldQuantity: number
): number {
  if (product.production.mode !== 'lote' || product.production.yieldQuantity <= 0) {
    // Para produtos individuais, multiplica o custo unitário pela quantidade
    const unitIngredientCost = product.ingredients.reduce((total, ingredient) => {
      return total + (ingredient.averageUnitPrice || 0) * (ingredient.totalQuantity || 0);
    }, 0);
    return unitIngredientCost * soldQuantity;
  }

  // Para produtos em lote, calcula a proporção vendida
  const proportion = soldQuantity / product.production.yieldQuantity;

  // Calcula o custo proporcional baseado nos ingredientes do lote completo
  const totalLotIngredientCost = product.ingredients.reduce((total, ingredient) => {
    const ingredientCostForWholeLot =
      (ingredient.averageUnitPrice || 0) * (ingredient.totalQuantity || 0);
    return total + ingredientCostForWholeLot;
  }, 0);

  const proportionalCost = totalLotIngredientCost * proportion;

  return Math.max(0, proportionalCost);
}
```

**Erro:** Esta função está **recalculando** o custo dos ingredientes, mas o produto já tem `production.totalCost` e `production.unitCost` calculados.

**Impacto:**

- Cálculos redundantes e potencialmente inconsistentes
- Se o `totalCost` foi calculado com lógica diferente, haverá divergência
- Performance desnecessariamente afetada

**Solução:**

```typescript
export function calculateProportionalIngredientCost(
  product: ProductState,
  soldQuantity: number
): number {
  // Usar o custo unitário já calculado
  return product.production.unitCost * soldQuantity;
}
```

---

### 4. **ERRO: Lógica de Desconto de Estoque Incorreta para Lotes**

**Localização:** `src/hooks/business/useUnifiedSaleProcess.tsx` (linhas 165-195)

**Problema:**

```typescript
if (product.production.mode === 'lote') {
  // Para produtos em lote, apenas reduz a quantidade produzida
  const updatedProduct = reduceProducedQuantity(product, item.quantity);

  // Atualiza o produto no contexto
  productDispatch({
    type: 'EDIT_PRODUCT',
    payload: updatedProduct,
  });
} else {
  // Para produtos individuais, calcula e desconta ingredientes
  const ingredientConsumption = calculateProportionalIngredientConsumption(product, item.quantity);

  // Atualiza estoque de ingredientes
  ingredientConsumption.forEach(consumption => {
    const storeItem = store.ingredients.find(i => i.id === consumption.id)!;
    const newQuantity = Math.max(0, storeItem.totalQuantity - consumption.quantityToConsume);

    storeDispatch({
      type: 'EDIT_INGREDIENT',
      payload: {
        ...storeItem,
        totalQuantity: newQuantity,
      },
    });
  });
}
```

**Erro:** Para produtos em lote, **NÃO está descontando os ingredientes do estoque**. Apenas reduz a quantidade produzida.

**Impacto:**

- Ingredientes não são descontados quando produtos em lote são vendidos
- Estoque de ingredientes fica incorreto
- Pode permitir vendas além da capacidade real de produção

**Regra de Negócio Correta:**

1. **Produção do Lote:** Desconta ingredientes e aumenta `producedQuantity`
2. **Venda do Lote:** Apenas reduz `producedQuantity` (ingredientes já foram descontados na produção)

**Problema:** O código atual não mostra onde os ingredientes são descontados na produção do lote.

---

### 5. **ERRO: Validação de Estoque Incorreta**

**Localização:** `src/utils/calculations/batchSale.ts` - função `calculateMaxSellableQuantity`

**Problema:**

```typescript
export function calculateMaxSellableQuantity(
  product: ProductState,
  availableIngredients: Ingredient[]
): number {
  if (product.production.mode !== 'lote') {
    // Para produtos individuais, calcula baseado no ingrediente mais limitante
    let maxQuantity = Infinity;

    for (const ingredient of product.ingredients) {
      const availableIngredient = availableIngredients.find(ing => ing.id === ingredient.id);
      if (!availableIngredient || ingredient.totalQuantity <= 0) {
        return 0;
      }

      const possibleQuantity = Math.floor(
        availableIngredient.totalQuantity / ingredient.totalQuantity
      );
      maxQuantity = Math.min(maxQuantity, possibleQuantity);
    }

    return maxQuantity === Infinity ? 0 : maxQuantity;
  }

  // Para produtos em lote, retorna apenas a quantidade já produzida
  return product.production.producedQuantity || 0;
}
```

**Erro:** Para produtos individuais, está calculando quantos produtos podem ser feitos com os ingredientes disponíveis, mas **produtos individuais também deveriam ter `producedQuantity`** se já foram produzidos.

**Impacto:**

- Inconsistência entre produtos em lote e individuais
- Produtos individuais sempre calculam "sob demanda", mas podem ter estoque pré-produzido

---

### 6. **ERRO: Cálculo de Margem no Resumo da Venda**

**Localização:** `src/components/features/pdv/BatchQuantitySelector.tsx` (linhas 44-47)

**Problema:**

```typescript
const proportionalMargin = isBatchProduct
  ? calculateProportionalProfitMargin(product, selectedQuantity, unitPrice)
  : product.production.unitMargin;
```

**Erro:** Para produtos individuais, está usando `unitMargin` (que é a margem configurada), mas deveria calcular a margem real baseada no preço e custo.

**Impacto:**

- Margem mostrada pode não refletir a realidade se o preço foi alterado
- Inconsistência com produtos em lote

---

### 7. **ERRO CRÍTICO: Falta Lógica de Produção de Lotes**

**Problema:** Não existe implementação para produzir lotes e descontar ingredientes.

**Impacto:**

- Produtos em lote nunca têm `producedQuantity` atualizada
- Ingredientes nunca são descontados para lotes
- Sistema não funciona corretamente para produtos em lote

**Necessário:**

- Implementar tela/funcionalidade de produção de lotes
- Usar função `produceBatch` que já existe em `batchSale.ts`
- Descontar ingredientes na produção, não na venda

---

## 📋 RESUMO DOS ERROS

| #   | Erro                                    | Severidade | Impacto                                        |
| --- | --------------------------------------- | ---------- | ---------------------------------------------- |
| 1   | Cálculo de margem ignora `unitCost`     | 🔴 CRÍTICO | Margem incorreta, decisões financeiras erradas |
| 2   | Uso inconsistente de preços             | 🟡 MÉDIO   | Preços incorretos para produtos individuais    |
| 3   | Recálculo desnecessário de custos       | 🟡 MÉDIO   | Performance e inconsistência                   |
| 4   | Ingredientes não descontados em lotes   | 🔴 CRÍTICO | Estoque incorreto                              |
| 5   | Validação de estoque inconsistente      | 🟡 MÉDIO   | Lógica de negócio confusa                      |
| 6   | Margem não recalculada para individuais | 🟢 BAIXO   | Informação potencialmente desatualizada        |

---

## ✅ REGRAS DE NEGÓCIO CORRETAS

### Para Produtos em Lote:

1. **Produção:**

   - Desconta ingredientes do estoque
   - Aumenta `producedQuantity` pelo `yieldQuantity`
   - Registra `lastProductionDate`

2. **Venda:**
   - Reduz `producedQuantity` pela quantidade vendida
   - **NÃO desconta ingredientes** (já foram descontados na produção)
   - Calcula custo usando `unitCost * quantidadeVendida`
   - Calcula margem usando `unitSellingPrice` e `unitCost`

### Para Produtos Individuais:

1. **Produção (se aplicável):**

   - Desconta ingredientes do estoque
   - Aumenta `producedQuantity`

2. **Venda:**
   - Se tem `producedQuantity`, reduz dela
   - Se não tem, desconta ingredientes "sob demanda"
   - Calcula custo usando `unitCost * quantidadeVendida`
   - Calcula margem usando `unitSellingPrice` e `unitCost`

---

## 🔧 PRÓXIMOS PASSOS

1. Corrigir função `calculateProportionalProfitMargin`
2. Simplificar `calculateProportionalIngredientCost` para usar `unitCost`
3. Padronizar uso de `unitSellingPrice` em todos os lugares
4. Implementar lógica de produção de lotes (se não existir)
5. Revisar lógica de desconto de estoque na venda
6. Adicionar testes unitários para validar cálculos

**Impacto:**

- Produtos em lote nunca têm `producedQuantity` atualizada
- Ingredientes nunca são descontados para lotes
- Sistema não funciona corretamente para produtos em lote

**Necessário:**

- Implementar tela/funcionalidade de produção de lotes
- Usar função `produceBatch` que já existe em `batchSale.ts`
- Descontar ingredientes na produção, não na venda

---

## 📊 TABELA RESUMO DOS ERROS

| #   | Erro                               | Severidade | Impacto              |
| --- | ---------------------------------- | ---------- | -------------------- |
| 1   | Cálculo de margem ignora unitCost  | 🔴 CRÍTICO | Margem incorreta     |
| 2   | Uso inconsistente de preços        | 🟡 MÉDIO   | Preços incorretos    |
| 3   | Recálculo desnecessário de custos  | 🟡 MÉDIO   | Performance          |
| 4   | Ingredientes não descontados       | 🔴 CRÍTICO | Estoque incorreto    |
| 5   | Validação de estoque inconsistente | 🟡 MÉDIO   | Lógica confusa       |
| 6   | Margem não recalculada             | 🟢 BAIXO   | Info desatualizada   |
| 7   | Falta produção de lotes            | 🔴 CRÍTICO | Sistema não funciona |
