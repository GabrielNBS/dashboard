# Correções Propostas - Venda de Produtos em Lote

## 🔧 CORREÇÕES IMPLEMENTADAS

### 1. Correção: `calculateProportionalProfitMargin` (CRÍTICO)

**Arquivo:** `src/utils/calculations/batchSale.ts`

**Antes:**

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

**Depois:**

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

**Motivo:** A margem deve ser calculada usando o `unitCost` que já considera todos os custos, não apenas ingredientes.

---

### 2. Correção: `calculateProportionalIngredientCost` (MÉDIO)

**Arquivo:** `src/utils/calculations/batchSale.ts`

**Antes:** Função complexa recalculando custos de ingredientes

**Depois:**

```typescript
export function calculateProportionalIngredientCost(
  product: ProductState,
  soldQuantity: number
): number {
  // Usar o custo unitário já calculado
  return product.production.unitCost * soldQuantity;
}
```

**Motivo:** Simplifica e garante consistência com os custos já calculados no produto.

---

### 3. Correção: Uso de Preços Unitários (MÉDIO)

**Arquivo:** `src/components/features/pdv/UnifiedShoppingCart.tsx`

**Antes:**

```typescript
const unitPrice = isBatchProduct
  ? product.production.unitSellingPrice
  : product.production.sellingPrice;
```

**Depois:**

```typescript
// Sempre usar unitSellingPrice para consistência
const unitPrice = product.production.unitSellingPrice;
```

**Motivo:** Padroniza o uso de preços unitários em todo o sistema.

---

### 4. Correção: Cálculo de Margem no Seletor (BAIXO)

**Arquivo:** `src/components/features/pdv/BatchQuantitySelector.tsx`

**Antes:**

```typescript
const proportionalMargin = isBatchProduct
  ? calculateProportionalProfitMargin(product, selectedQuantity, unitPrice)
  : product.production.unitMargin;
```

**Depois:**

```typescript
// Sempre calcular margem real baseada no preço atual
const proportionalMargin = calculateProportionalProfitMargin(product, selectedQuantity, unitPrice);
```

**Motivo:** Garante que a margem mostrada reflete o preço atual, não a configurada.

---

## ⚠️ CORREÇÕES QUE REQUEREM ANÁLISE ADICIONAL

### 5. Lógica de Desconto de Estoque (CRÍTICO)

**Arquivo:** `src/hooks/business/useUnifiedSaleProcess.tsx`

**Problema Atual:**

- Produtos em lote: Apenas reduz `producedQuantity`, não desconta ingredientes
- Produtos individuais: Desconta ingredientes na venda

**Análise Necessária:**

1. Verificar se existe funcionalidade de produção de lotes
2. Se SIM: Manter lógica atual (ingredientes descontados na produção)
3. Se NÃO: Implementar produção de lotes OU descontar ingredientes na venda

**Recomendação:** Implementar módulo de produção de lotes separado.

---

## 📝 NOTAS IMPORTANTES

### Sobre Custos e Margens

O sistema tem dois níveis de informação de custo/margem:

1. **Nível do Produto (ProductionModel):**

   - `totalCost`: Custo total do lote ou produto individual
   - `unitCost`: Custo por unidade (totalCost / yieldQuantity)
   - `unitSellingPrice`: Preço de venda por unidade
   - `unitMargin`: Margem configurada (%)

2. **Nível da Venda:**
   - Deve usar `unitCost` e `unitSellingPrice` para calcular margem real
   - Margem real pode diferir da configurada se preços mudaram

### Fluxo Correto para Produtos em Lote

```
1. PRODUÇÃO DO LOTE
   ├─ Desconta ingredientes do estoque
   ├─ Aumenta producedQuantity += yieldQuantity
   └─ Registra lastProductionDate

2. VENDA DO LOTE (parcial ou total)
   ├─ Reduz producedQuantity -= quantidadeVendida
   ├─ NÃO desconta ingredientes (já foram descontados)
   ├─ Calcula custo: unitCost * quantidadeVendida
   └─ Calcula margem: ((unitSellingPrice - unitCost) / unitSellingPrice) * 100
```

### Fluxo Correto para Produtos Individuais

```
1. PRODUÇÃO (opcional)
   ├─ Desconta ingredientes do estoque
   └─ Aumenta producedQuantity

2. VENDA
   ├─ Se tem producedQuantity: reduz dela
   ├─ Se não tem: desconta ingredientes "sob demanda"
   ├─ Calcula custo: unitCost * quantidadeVendida
   └─ Calcula margem: ((unitSellingPrice - unitCost) / unitSellingPrice) * 100
```
