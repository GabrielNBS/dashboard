# 🔴 ERRO CRÍTICO DE UX: Precificação de Produtos em Lote

## 🎯 Problema Identificado

Há uma **inconsistência grave** entre o que o usuário vê no formulário de precificação e o que é salvo/mostrado no card do produto.

---

## 📊 Análise do Erro

### No Formulário (PriceAndMarginInputs.tsx)

**Label do Input:**

```tsx
<CurrencyInput
  label={mode === 'lote' ? 'Preço por Unidade' : 'Preço de Venda'}
  value={sellingPrice}
  ...
/>
```

**O que o usuário vê:**

- Label: "Preço por Unidade"
- Usuário digita: R$ 15,00 (pensando que é o preço de UMA fatia)

**Resumo dos Cálculos:**

```
Custo Total: R$ 100,00
Custo/Unidade: R$ 10,00  ← Correto (100 / 10 fatias)
Preço Sugerido: R$ 15,00  ← Correto (baseado na margem)
Margem Real: 33.3%  ← Correto
```

### No Código (MultiStepProductForm.tsx)

**O que é salvo:**

```typescript
const production = {
  ...builderState.production,
  totalCost: calculations.totalCost,
  sellingPrice: sellingPriceValue,  // ← R$ 15,00 (valor digitado)
  unitSellingPrice:
    builderState.production.mode === 'lote'
      ? sellingPriceValue / builderState.production.yieldQuantity  // ← R$ 1,50 (ERRADO!)
      : sellingPriceValue,
  ...
};
```

**Problema:** O código está dividindo o valor digitado pelo rendimento!

### No Card do Produto (ProductCard.tsx)

**O que é mostrado:**

```tsx
<div className="text-base font-bold text-indigo-600 sm:text-lg">
  {formatCurrency(product.production.sellingPrice)} // ← R$ 15,00
</div>
```

**Mas o card mostra:**

- "Venda: R$ 15,00" ← Parece ser o preço do LOTE COMPLETO
- Quando na verdade deveria ser o preço de UMA unidade

---

## 🔴 Impacto do Erro

### 1. Confusão do Usuário

**Cenário Real:**

```
Usuário quer vender cada fatia por R$ 15,00
├─ Formulário: "Preço por Unidade" → Digita R$ 15,00 ✓
├─ Resumo: Mostra margem de 33.3% ✓
├─ Salva o produto
└─ Card mostra: "Venda: R$ 15,00" ✓

MAS NO SISTEMA:
├─ sellingPrice = R$ 15,00 (parece correto)
├─ unitSellingPrice = R$ 1,50 (ERRADO!)
└─ No PDV: Vende cada fatia por R$ 1,50! ❌
```

### 2. Erro nos Cálculos Financeiros

**Venda de 5 fatias:**

```
❌ ERRADO (atual):
Receita: 5 × R$ 1,50 = R$ 7,50
Custo: 5 × R$ 10,00 = R$ 50,00
Prejuízo: -R$ 42,50 (!!!)

✅ CORRETO (esperado):
Receita: 5 × R$ 15,00 = R$ 75,00
Custo: 5 × R$ 10,00 = R$ 50,00
Lucro: R$ 25,00
```

### 3. Ponto de Equilíbrio Incorreto

Com preços errados, todos os cálculos financeiros ficam comprometidos.

---

## 🔍 Raiz do Problema

### Inconsistência Conceitual

**O que o código pensa:**

- `sellingPrice` = Preço do lote completo
- `unitSellingPrice` = Preço de uma unidade

**O que o usuário vê:**

- Input: "Preço por Unidade"
- Usuário digita o preço de UMA unidade
- Mas o código trata como se fosse o preço do lote completo

### Onde Está o Erro

**Arquivo:** `src/components/dashboard/product/MultiStepProductForm.tsx`

**Linha problemática:**

```typescript
unitSellingPrice:
  builderState.production.mode === 'lote'
    ? sellingPriceValue / builderState.production.yieldQuantity  // ← ERRO!
    : sellingPriceValue,
```

**O que deveria ser:**

```typescript
unitSellingPrice: sellingPriceValue,  // Já é o preço unitário!
sellingPrice:
  builderState.production.mode === 'lote'
    ? sellingPriceValue * builderState.production.yieldQuantity  // Preço do lote
    : sellingPriceValue,
```

---

## ✅ Solução

### 1. Corrigir a Lógica de Salvamento

**Antes (ERRADO):**

```typescript
const production = {
  sellingPrice: sellingPriceValue, // R$ 15,00
  unitSellingPrice: sellingPriceValue / yieldQuantity, // R$ 1,50 ❌
};
```

**Depois (CORRETO):**

```typescript
const production = {
  sellingPrice:
    mode === 'lote'
      ? sellingPriceValue * yieldQuantity // R$ 150,00 (lote completo)
      : sellingPriceValue, // R$ 15,00 (individual)
  unitSellingPrice: sellingPriceValue, // R$ 15,00 (sempre unitário)
};
```

### 2. Atualizar Labels para Clareza

**PricingStep.tsx:**

```tsx
<p className="text-on-warning mt-1 text-xs">
  {state.production.mode === 'lote'
    ? 'Valor que cada unidade será vendida (não o lote completo)' // ← Mais claro
    : 'Valor total do produto'}
</p>
```

### 3. Atualizar Card do Produto

**ProductCard.tsx - Mostrar ambos os valores:**

```tsx
{
  product.production.mode === 'lote' ? (
    <>
      <div className="text-base font-bold text-indigo-600">
        {formatCurrency(product.production.unitSellingPrice)}/un.
      </div>
      <div className="text-xs text-slate-500">
        Lote: {formatCurrency(product.production.sellingPrice)}
      </div>
    </>
  ) : (
    <div className="text-base font-bold text-indigo-600">
      {formatCurrency(product.production.sellingPrice)}
    </div>
  );
}
```

---

## 🧪 Testes de Validação

### Teste 1: Criar Produto em Lote

```
1. Criar "Bolo de Chocolate"
2. Modo: Lote
3. Rendimento: 10 fatias
4. Custo total: R$ 100,00
5. Preço por unidade: R$ 15,00
6. Salvar

Verificar:
✓ unitSellingPrice = R$ 15,00
✓ sellingPrice = R$ 150,00 (10 × R$ 15,00)
✓ Card mostra: "R$ 15,00/un. (Lote: R$ 150,00)"
```

### Teste 2: Venda no PDV

```
1. Adicionar 5 fatias ao carrinho
2. Verificar:
   ✓ Preço unitário: R$ 15,00
   ✓ Subtotal: R$ 75,00 (5 × R$ 15,00)
   ✓ Custo: R$ 50,00 (5 × R$ 10,00)
   ✓ Lucro: R$ 25,00
   ✓ Margem: 33.3%
```

### Teste 3: Análise Financeira

```
1. Vender 20 fatias (2 lotes)
2. Verificar:
   ✓ Receita: R$ 300,00 (20 × R$ 15,00)
   ✓ Custo variável: R$ 200,00 (20 × R$ 10,00)
   ✓ Lucro bruto: R$ 100,00
   ✓ Margem: 33.3%
   ✓ Ponto de equilíbrio correto
```

---

## 📊 Comparação Antes vs Depois

| Campo              | Antes (ERRADO) | Depois (CORRETO) |
| ------------------ | -------------- | ---------------- |
| Input do usuário   | R$ 15,00       | R$ 15,00         |
| unitSellingPrice   | R$ 1,50 ❌     | R$ 15,00 ✅      |
| sellingPrice       | R$ 15,00 ❌    | R$ 150,00 ✅     |
| Venda de 1 fatia   | R$ 1,50 ❌     | R$ 15,00 ✅      |
| Venda de 10 fatias | R$ 15,00 ❌    | R$ 150,00 ✅     |
| Margem real        | -400% ❌       | 33.3% ✅         |

---

## 🎯 Conclusão

Este é um **erro crítico de UX** que causa:

- ❌ Confusão do usuário
- ❌ Preços completamente errados
- ❌ Prejuízo financeiro real
- ❌ Análises financeiras incorretas
- ❌ Ponto de equilíbrio errado

A correção é **urgente** e **simples**: inverter a lógica de cálculo para que o valor digitado seja sempre o `unitSellingPrice` e o `sellingPrice` seja calculado multiplicando pelo rendimento.
