# 🔴 Problema Identificado: Ponto de Equilíbrio e Produtos em Lote

## Problema no Cálculo de Custos de Ingredientes

### Localização

`src/utils/calculations/finance.ts` - função `getRealIngredientsCost`

### Código Atual (PROBLEMÁTICO)

```typescript
export function getRealIngredientsCost(sales: Sale[]): number {
  return sales.reduce((totalCost, sale) => {
    const saleCost = sale.items.reduce((itemsCost, item) => {
      const batchItem = item as { isBatchSale?: boolean; proportionalCost?: number };
      if (batchItem.isBatchSale && typeof batchItem.proportionalCost === 'number') {
        return itemsCost + Math.abs(batchItem.proportionalCost);
      }

      const ingredientsCost = item.product.ingredients.reduce((ingCost, ingredient) => {
        const ingredientCostPerProduct =
          (ingredient.averageUnitPrice || 0) * (ingredient.totalQuantity || 0);

        let totalIngredientCost: number;
        if (item.product.production.mode === 'lote' && item.product.production.yieldQuantity > 0) {
          const proportion = item.quantity / item.product.production.yieldQuantity;
          totalIngredientCost = ingredientCostPerProduct * proportion;
        } else {
          totalIngredientCost = ingredientCostPerProduct * item.quantity;
        }

        return ingCost + totalIngredientCost;
      }, 0);

      return itemsCost + ingredientsCost;
    }, 0);

    return totalCost + saleCost;
  }, 0);
}
```

## 🔴 ERRO CRÍTICO

### Problema 1: Recálculo de Custos de Ingredientes

**Erro:** A função está **recalculando** o custo dos ingredientes para produtos em lote, mas os ingredientes já foram descontados na PRODUÇÃO, não na venda!

**Impacto:**

- Custos variáveis **duplicados** para produtos em lote
- Ponto de equilíbrio **incorreto**
- Margem de lucro **subestimada**
- Decisões financeiras **erradas**

### Problema 2: Lógica Inconsistente

```typescript
if (batchItem.isBatchSale && typeof batchItem.proportionalCost === 'number') {
  return itemsCost + Math.abs(batchItem.proportionalCost);
}
```

**Erro:** Usa `proportionalCost` se disponível, mas depois recalcula se não estiver disponível. Isso cria inconsistência.

### Problema 3: Não Considera Fluxo de Produção

**Fluxo Correto:**

```
PRODUÇÃO DO LOTE:
├─ Desconta ingredientes (R$ 100)
├─ Produz 10 unidades
└─ Custo unitário: R$ 10

VENDA DE 5 UNIDADES:
├─ Custo da venda: 5 × R$ 10 = R$ 50
├─ NÃO desconta ingredientes novamente
└─ Ingredientes já foram descontados na produção
```

**Fluxo Atual (ERRADO):**

```
PRODUÇÃO DO LOTE:
├─ Desconta ingredientes (R$ 100)
├─ Produz 10 unidades
└─ Custo unitário: R$ 10

VENDA DE 5 UNIDADES:
├─ Recalcula custo de ingredientes: R$ 50
├─ ERRO: Conta os ingredientes duas vezes!
└─ Custo total errado: R$ 150 (deveria ser R$ 100)
```

## 💰 Impacto Financeiro

### Exemplo Prático

**Produto:** Bolo de Chocolate (lote)

- Custo ingredientes: R$ 80
- Outros custos: R$ 20
- **Custo total:** R$ 100
- Rendimento: 10 fatias
- **Custo unitário:** R$ 10
- Preço venda: R$ 15

**Venda de 5 fatias:**

#### ❌ Cálculo ERRADO (Atual)

```
Receita: 5 × R$ 15 = R$ 75
Custo variável (ERRADO): R$ 80 × (5/10) = R$ 40
Lucro bruto (ERRADO): R$ 75 - R$ 40 = R$ 35
Margem (ERRADA): 46.67%
```

#### ✅ Cálculo CORRETO

```
Receita: 5 × R$ 15 = R$ 75
Custo variável (CORRETO): 5 × R$ 10 = R$ 50
Lucro bruto (CORRETO): R$ 75 - R$ 50 = R$ 25
Margem (CORRETA): 33.33%
```

**Diferença:** 13.34% de erro na margem!

### Impacto no Ponto de Equilíbrio

#### ❌ Com Erro

```
Custos fixos: R$ 1.000
Custo variável médio: R$ 8 (ERRADO - subestimado)
Preço médio: R$ 15
Margem de contribuição: R$ 15 - R$ 8 = R$ 7
Ponto de equilíbrio: R$ 1.000 / R$ 7 = 143 unidades
```

#### ✅ Correto

```
Custos fixos: R$ 1.000
Custo variável médio: R$ 10 (CORRETO)
Preço médio: R$ 15
Margem de contribuição: R$ 15 - R$ 10 = R$ 5
Ponto de equilíbrio: R$ 1.000 / R$ 5 = 200 unidades
```

**Diferença:** 57 unidades a mais necessárias!

## ✅ Solução

### 1. Corrigir `getRealIngredientsCost`

```typescript
export function getRealIngredientsCost(sales: Sale[]): number {
  return sales.reduce((totalCost, sale) => {
    const saleCost = sale.items.reduce((itemsCost, item) => {
      // Sempre usar unitCost do produto
      const unitCost = item.product.production.unitCost;
      const totalCost = unitCost * item.quantity;

      return itemsCost + totalCost;
    }, 0);

    return totalCost + saleCost;
  }, 0);
}
```

### 2. Remover Lógica de Recálculo

**Motivo:** O `unitCost` já foi calculado corretamente no cadastro do produto e considera:

- Custo total dos ingredientes
- Rendimento (para lotes)
- Outros custos

### 3. Garantir Fluxo Correto

**Produção:**

- Desconta ingredientes do estoque
- Aumenta `producedQuantity`
- Custo já está em `unitCost`

**Venda:**

- Usa `unitCost` para calcular custo da venda
- Reduz `producedQuantity`
- NÃO mexe em ingredientes

## 📊 Validação

### Teste 1: Produto Individual

```
Custo unitário: R$ 5
Venda de 10 unidades
Custo esperado: R$ 50
```

### Teste 2: Produto em Lote

```
Custo total: R$ 100
Rendimento: 10 unidades
Custo unitário: R$ 10
Venda de 5 unidades
Custo esperado: R$ 50
```

### Teste 3: Venda Mista

```
3 produtos individuais (R$ 5 cada) = R$ 15
5 unidades de lote (R$ 10 cada) = R$ 50
Custo total esperado: R$ 65
```

## 🎯 Conclusão

O problema está em **recalcular custos de ingredientes** que já foram descontados na produção. A solução é **sempre usar `unitCost`** que já contém todos os custos calculados corretamente.

Isso afeta:

- ✅ Ponto de equilíbrio
- ✅ Margem de lucro
- ✅ Análise de rentabilidade
- ✅ Decisões financeiras
