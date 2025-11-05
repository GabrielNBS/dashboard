# 🏭 Recomendação: Implementação de Produção de Lotes

## 🔴 Problema Crítico Identificado

Atualmente, o sistema **NÃO possui lógica para produzir lotes**. Isso significa:

- ❌ Produtos em lote nunca têm `producedQuantity` atualizada
- ❌ Ingredientes nunca são descontados para produtos em lote
- ❌ Não é possível vender produtos em lote (pois `producedQuantity` é sempre 0)
- ❌ Sistema de lotes não funciona na prática

## ✅ Solução Recomendada

Implementar um **módulo de produção de lotes** separado do PDV.

### Fluxo Proposto

```
1. CADASTRO DO PRODUTO
   └─ Define: ingredientes, rendimento, preços, margens

2. PRODUÇÃO DO LOTE (NOVO MÓDULO)
   ├─ Seleciona produto em lote
   ├─ Define quantos lotes produzir
   ├─ Valida ingredientes disponíveis
   ├─ Desconta ingredientes do estoque
   ├─ Aumenta producedQuantity
   └─ Registra data de produção

3. VENDA (PDV ATUAL)
   ├─ Seleciona produto
   ├─ Verifica producedQuantity disponível
   ├─ Vende quantidade desejada
   ├─ Reduz producedQuantity
   └─ NÃO desconta ingredientes (já foram descontados)
```

---

## 📋 Especificação do Módulo de Produção

### Tela: "Produção de Lotes"

#### Funcionalidades

1. **Listagem de Produtos em Lote**

   - Mostrar todos os produtos com `mode: 'lote'`
   - Exibir `producedQuantity` atual
   - Indicar ingredientes disponíveis
   - Mostrar quantos lotes podem ser produzidos

2. **Seleção de Produto**

   - Escolher produto a produzir
   - Mostrar detalhes: rendimento, ingredientes necessários
   - Calcular máximo de lotes possíveis

3. **Definição de Quantidade**

   - Input para número de lotes a produzir
   - Validação em tempo real
   - Mostrar ingredientes que serão consumidos

4. **Confirmação de Produção**
   - Revisar informações
   - Confirmar produção
   - Descontar ingredientes
   - Atualizar `producedQuantity`

#### Interface Sugerida

```
┌─────────────────────────────────────────────────────┐
│ 🏭 Produção de Lotes                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Produto: [Bolo de Chocolate ▼]                     │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Informações do Produto                      │   │
│ │                                             │   │
│ │ Rendimento: 10 fatias por lote              │   │
│ │ Estoque atual: 5 fatias                     │   │
│ │ Lotes possíveis: 3 lotes                    │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ Quantidade de lotes a produzir: [2] [+] [-]        │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Ingredientes Necessários                    │   │
│ │                                             │   │
│ │ ✓ Farinha: 2kg (disponível: 5kg)           │   │
│ │ ✓ Açúcar: 1kg (disponível: 3kg)            │   │
│ │ ✓ Chocolate: 500g (disponível: 1kg)        │   │
│ │ ✓ Ovos: 12 unidades (disponível: 24)       │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Resultado da Produção                       │   │
│ │                                             │   │
│ │ Unidades produzidas: 20 fatias              │   │
│ │ Estoque final: 25 fatias                    │   │
│ │ Custo total: R$ 200,00                      │   │
│ │ Custo unitário: R$ 10,00                    │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ [Cancelar]              [Confirmar Produção]       │
└─────────────────────────────────────────────────────┘
```

---

## 💻 Implementação Técnica

### 1. Criar Hook: `useProductionProcess`

```typescript
// src/hooks/business/useProductionProcess.tsx

export function useProductionProcess() {
  const { state: products, dispatch: productDispatch } = useProductContext();
  const { state: ingredients, dispatch: ingredientDispatch } = useIngredientContext();

  const produceBatch = useCallback(
    (productUid: string, batchCount: number) => {
      const product = products.products.find(p => p.uid === productUid);
      if (!product || product.production.mode !== 'lote') {
        toast({
          title: 'Erro',
          description: 'Produto inválido ou não é um produto em lote',
          variant: 'destructive',
        });
        return;
      }

      // Validar ingredientes disponíveis
      const validation = validateBatchProduction(product, batchCount, ingredients.ingredients);
      if (!validation.isValid) {
        toast({
          title: 'Ingredientes insuficientes',
          description: `Faltam: ${validation.missingIngredients.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      // Descontar ingredientes
      product.ingredients.forEach(ingredient => {
        const storeIngredient = ingredients.ingredients.find(i => i.id === ingredient.id);
        if (storeIngredient) {
          const quantityToConsume = ingredient.totalQuantity * batchCount;
          const newQuantity = storeIngredient.totalQuantity - quantityToConsume;

          ingredientDispatch({
            type: 'EDIT_INGREDIENT',
            payload: {
              ...storeIngredient,
              totalQuantity: newQuantity,
            },
          });
        }
      });

      // Atualizar producedQuantity
      const producedUnits = product.production.yieldQuantity * batchCount;
      const updatedProduct = {
        ...product,
        production: {
          ...product.production,
          producedQuantity: (product.production.producedQuantity || 0) + producedUnits,
          lastProductionDate: new Date().toISOString(),
        },
      };

      productDispatch({
        type: 'EDIT_PRODUCT',
        payload: updatedProduct,
      });

      toast({
        title: 'Produção concluída! 🎉',
        description: `${producedUnits} unidades de ${product.name} produzidas`,
        variant: 'accept',
      });
    },
    [products, ingredients, productDispatch, ingredientDispatch]
  );

  return {
    produceBatch,
    getBatchProducts: () => products.products.filter(p => p.production.mode === 'lote'),
    calculateMaxBatches: (productUid: string) => {
      const product = products.products.find(p => p.uid === productUid);
      if (!product) return 0;
      return calculateMaxProducibleBatches(product, ingredients.ingredients);
    },
  };
}
```

### 2. Criar Componente: `ProductionForm`

```typescript
// src/components/features/production/ProductionForm.tsx

export default function ProductionForm() {
  const { produceBatch, getBatchProducts, calculateMaxBatches } = useProductionProcess();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [batchCount, setBatchCount] = useState(1);

  const batchProducts = getBatchProducts();
  const maxBatches = selectedProduct ? calculateMaxBatches(selectedProduct) : 0;

  const handleProduce = () => {
    if (!selectedProduct || batchCount <= 0) return;
    produceBatch(selectedProduct, batchCount);
    setBatchCount(1);
  };

  return (
    <div className="production-form">
      {/* Implementar interface conforme mockup acima */}
    </div>
  );
}
```

### 3. Criar Rota: `/production`

```typescript
// src/app/production/page.tsx

import ProductionForm from '@/components/features/production/ProductionForm';

export default function ProductionPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Produção de Lotes</h1>
      <ProductionForm />
    </div>
  );
}
```

### 4. Adicionar Validação

```typescript
// src/utils/calculations/batchSale.ts

export function validateBatchProduction(
  product: ProductState,
  batchCount: number,
  availableIngredients: Ingredient[]
): { isValid: boolean; missingIngredients: string[] } {
  const missingIngredients: string[] = [];

  const isValid = product.ingredients.every(ingredient => {
    const required = ingredient.totalQuantity * batchCount;
    const available = availableIngredients.find(i => i.id === ingredient.id);
    const hasEnough = available && available.totalQuantity >= required;

    if (!hasEnough) {
      missingIngredients.push(ingredient.name);
    }

    return hasEnough;
  });

  return { isValid, missingIngredients };
}
```

---

## 🎯 Benefícios da Implementação

### 1. Separação de Responsabilidades

- **Produção:** Desconta ingredientes, aumenta estoque de produtos
- **Venda:** Reduz estoque de produtos, não mexe em ingredientes

### 2. Controle de Estoque Correto

- Ingredientes descontados apenas na produção
- `producedQuantity` sempre reflete estoque real
- Rastreabilidade de quando foi produzido

### 3. Planejamento de Produção

- Ver quantos lotes podem ser produzidos
- Planejar compras de ingredientes
- Evitar desperdício

### 4. Flexibilidade

- Produzir múltiplos lotes de uma vez
- Produzir antecipadamente
- Vender conforme demanda

---

## 📊 Exemplo de Uso

### Cenário: Padaria

#### Segunda-feira (Produção)

```
1. Acessar "Produção de Lotes"
2. Selecionar "Pão Francês"
3. Produzir 5 lotes (250 pães)
4. Ingredientes descontados:
   - Farinha: 10kg
   - Fermento: 500g
   - Sal: 200g
5. producedQuantity: 0 → 250 pães
```

#### Segunda a Sexta (Vendas)

```
Segunda: Vende 60 pães → producedQuantity: 190
Terça: Vende 55 pães → producedQuantity: 135
Quarta: Vende 50 pães → producedQuantity: 85
Quinta: Vende 45 pães → producedQuantity: 40
Sexta: Vende 40 pães → producedQuantity: 0
```

#### Sábado (Nova Produção)

```
1. Verificar estoque: 0 pães
2. Produzir 3 lotes (150 pães)
3. Ingredientes descontados novamente
4. producedQuantity: 0 → 150 pães
```

---

## ⚡ Implementação Rápida (MVP)

Se precisar de algo rápido, pode começar com:

### Versão Simplificada

1. **Botão "Produzir Lote" no cadastro de produtos**

   - Aparece apenas para produtos em lote
   - Produz 1 lote por vez
   - Desconta ingredientes
   - Aumenta `producedQuantity`

2. **Código Mínimo**

```typescript
// Adicionar ao ProductForm ou criar botão separado
const handleProduceBatch = () => {
  if (product.production.mode !== 'lote') return;

  // Validar ingredientes
  const canProduce = product.ingredients.every(ing => {
    const available = ingredients.find(i => i.id === ing.id);
    return available && available.totalQuantity >= ing.totalQuantity;
  });

  if (!canProduce) {
    toast({ title: 'Ingredientes insuficientes', variant: 'destructive' });
    return;
  }

  // Descontar ingredientes
  product.ingredients.forEach(ing => {
    const storeIng = ingredients.find(i => i.id === ing.id);
    if (storeIng) {
      updateIngredient({
        ...storeIng,
        totalQuantity: storeIng.totalQuantity - ing.totalQuantity,
      });
    }
  });

  // Aumentar producedQuantity
  updateProduct({
    ...product,
    production: {
      ...product.production,
      producedQuantity:
        (product.production.producedQuantity || 0) + product.production.yieldQuantity,
      lastProductionDate: new Date().toISOString(),
    },
  });

  toast({ title: 'Lote produzido!', variant: 'accept' });
};
```

---

## 🔄 Alternativa: Produção "Just-in-Time"

Se não quiser implementar módulo de produção, pode fazer produção automática na venda:

### Modificar `useUnifiedSaleProcess.tsx`

```typescript
if (product.production.mode === 'lote') {
  // Verificar se tem estoque produzido
  const currentStock = product.production.producedQuantity || 0;

  if (currentStock >= item.quantity) {
    // Tem estoque: apenas reduz
    const updatedProduct = reduceProducedQuantity(product, item.quantity);
    productDispatch({ type: 'EDIT_PRODUCT', payload: updatedProduct });
  } else {
    // Não tem estoque: produz sob demanda
    // Calcular quantos lotes precisa produzir
    const needed = item.quantity - currentStock;
    const batchesNeeded = Math.ceil(needed / product.production.yieldQuantity);

    // Descontar ingredientes para os lotes necessários
    product.ingredients.forEach(ing => {
      const storeIng = store.ingredients.find(i => i.id === ing.id);
      if (storeIng) {
        const quantityToConsume = ing.totalQuantity * batchesNeeded;
        storeDispatch({
          type: 'EDIT_INGREDIENT',
          payload: {
            ...storeIng,
            totalQuantity: storeIng.totalQuantity - quantityToConsume,
          },
        });
      }
    });

    // Produzir lotes e vender
    const produced = batchesNeeded * product.production.yieldQuantity;
    const newStock = currentStock + produced - item.quantity;

    productDispatch({
      type: 'EDIT_PRODUCT',
      payload: {
        ...product,
        production: {
          ...product.production,
          producedQuantity: newStock,
        },
      },
    });
  }
}
```

**Prós:**

- Não precisa de tela separada
- Funciona automaticamente

**Contras:**

- Menos controle sobre produção
- Pode produzir mais que o necessário
- Dificulta planejamento

---

## 🎯 Recomendação Final

**Implementar módulo de produção separado** é a melhor opção porque:

1. ✅ Separação clara de responsabilidades
2. ✅ Melhor controle de estoque
3. ✅ Facilita planejamento
4. ✅ Mais profissional
5. ✅ Escalável para futuro

**Começar com MVP simplificado** (botão no cadastro) e evoluir para tela completa depois.
