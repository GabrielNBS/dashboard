# Atualização de Formulários - Validação e Máscaras

## Resumo das Alterações

Este documento descreve as atualizações realizadas em todos os formulários do projeto para implementar validação centralizada via schemas Zod e máscaras de entrada.

## 🎯 Objetivos Alcançados

### 1. Validação Centralizada via Schema
- ✅ Todas as validações agora são feitas através de schemas Zod
- ✅ Removidas validações manuais duplicadas
- ✅ Limites de valores centralizados em constantes reutilizáveis
- ✅ Validações consistentes em todo o projeto

### 2. Máscaras de Entrada
- ✅ Implementadas máscaras para telefone, e-mail, CPF, CNPJ e CEP
- ✅ Componentes de input especializados (PhoneInput, EmailInput)
- ✅ Validação automática de formato

### 3. Limitação de Entrada
- ✅ Usuário não pode digitar valores acima do máximo permitido
- ✅ Prevenção de erros antes da validação
- ✅ Feedback imediato durante a digitação

## 📁 Arquivos Criados

### 1. `src/utils/masks.ts`
Utilitários de máscaras para formatação e validação de entrada:
- `phoneMask()` - Máscara para telefone brasileiro
- `emailMask()` - Validação e formatação de e-mail
- `cpfMask()` - Máscara para CPF
- `cnpjMask()` - Máscara para CNPJ
- `cepMask()` - Máscara para CEP
- Funções de validação: `isValidEmail()`, `isValidCPF()`, `isValidCNPJ()`, etc.

### 2. `src/components/ui/forms/PhoneInput.tsx`
Componente de input com máscara de telefone:
- Formata automaticamente (11) 98888-8888
- Valida formato brasileiro (10 ou 11 dígitos)
- Feedback visual de erro

### 3. `src/components/ui/forms/EmailInput.tsx`
Componente de input com validação de e-mail:
- Remove caracteres inválidos
- Valida formato de e-mail
- Feedback visual de erro

## 📝 Arquivos Atualizados

### 1. `src/schemas/validationSchemas.ts`
**Antes:** Validações básicas e limites hardcoded
**Depois:**
- Constantes centralizadas de limites:
  - `UNIT_LIMITS` - Limites por unidade de medida
  - `CURRENCY_LIMITS` - Limites de valores monetários
  - `PERCENTAGE_LIMITS` - Limites de percentuais
- Schemas completos para todos os formulários:
  - `ingredientSchema`
  - `finalProductSchema`
  - `paymentSchema`
  - `fixedCostSchema`
  - `variableCostSchema`
  - `paymentFeeSchema`

### 2. `src/components/dashboard/store/IngredientForm.tsx`
**Mudanças:**
- ❌ Removida função `validateQuantity()` (validação manual)
- ❌ Removida validação manual em `onSubmit()`
- ✅ Usa apenas validação do schema via `zodResolver`
- ✅ Limites aplicados via `UNIT_LIMITS` e `CURRENCY_LIMITS`
- ✅ Impede digitação acima do máximo

### 3. `src/components/ui/forms/CurrencyInput.tsx`
**Mudanças:**
- ✅ Impede digitação acima de `maxValue`
- ✅ Retorna imediatamente se valor exceder o máximo
- ✅ Não permite valores infinitos

### 4. `src/components/ui/forms/QuantityInput.tsx`
**Mudanças:**
- ✅ Impede digitação acima de `maxValue`
- ✅ Valida decimais baseado na unidade
- ✅ Limita casas decimais (3 para kg/l, 2 para outros)

### 5. `src/components/ui/forms/PercentageInput.tsx`
**Mudanças:**
- ✅ Impede digitação acima de `maxValue`
- ✅ Limita a 2 casas decimais
- ✅ Validação em tempo real

### 6. `src/components/features/pdv/PaymentConfiguration.tsx`
**Mudanças:**
- ✅ Usa `PERCENTAGE_LIMITS.discount.max` (50%)
- ✅ Usa `CURRENCY_LIMITS.discount.max` (R$ 999,99)

### 7. `src/components/dashboard/settings/PaymentFeesSection.tsx`
**Mudanças:**
- ✅ Usa `PERCENTAGE_LIMITS.paymentFee.max` (25%)

### 8. `src/components/dashboard/settings/FixedCostsSection.tsx`
**Mudanças:**
- ✅ Usa `CURRENCY_LIMITS.fixedCost.max` (R$ 999.999,99)

### 9. `src/components/dashboard/settings/VariableCostsSection.tsx`
**Mudanças:**
- ✅ Usa `PERCENTAGE_LIMITS.variableCost.max` (50%)
- ✅ Usa `CURRENCY_LIMITS.variableCost.max` (R$ 9.999,99)

### 10. `src/components/dashboard/product/PriceAndMarginInputs.tsx`
**Mudanças:**
- ✅ Usa `CURRENCY_LIMITS.product.max` (R$ 999.999,99)
- ✅ Usa `PERCENTAGE_LIMITS.margin.max` (1000%)

### 11. `src/components/dashboard/settings/FinancialSettingsSection.tsx`
**Mudanças:**
- ✅ Usa limites centralizados para margem de lucro
- ✅ Limites realistas para reserva de emergência (50%)

### 12. `src/components/dashboard/settings/StoreSettingsSection.tsx`
**Mudanças:**
- ✅ Usa `PhoneInput` com máscara automática
- ✅ Usa `EmailInput` com validação
- ✅ Usa `cnpjMask()` para formatação de CNPJ

### 13. `src/types/ingredients.ts`
**Mudanças:**
- ✅ Adicionadas unidades 'g' e 'ml' ao tipo `UnitType`

## 🎨 Limites Definidos

### Unidades de Medida
```typescript
UNIT_LIMITS = {
  un: { min: 1, max: 10000, decimals: 0 },
  kg: { min: 0.001, max: 1000, decimals: 3 },
  l: { min: 0.001, max: 1000, decimals: 3 },
  g: { min: 1, max: 1000000, decimals: 0 },
  ml: { min: 1, max: 1000000, decimals: 0 },
}
```

### Valores Monetários
```typescript
CURRENCY_LIMITS = {
  ingredient: { min: 0.01, max: 999999.99 },
  product: { min: 0.01, max: 999999.99 },
  discount: { min: 0, max: 999.99 },
  fixedCost: { min: 0, max: 999999.99 },
  variableCost: { min: 0, max: 9999.99 },
}
```

### Percentuais
```typescript
PERCENTAGE_LIMITS = {
  margin: { min: 0, max: 1000 },
  discount: { min: 0, max: 50 },
  paymentFee: { min: 0, max: 25 },
  variableCost: { min: 0, max: 50 },
}
```

## 🔒 Validações Lógicas Implementadas

### 1. Prevenção de Valores Infinitos
- Usuário não pode digitar valores acima do máximo
- Input retorna imediatamente se valor exceder limite
- Feedback visual imediato

### 2. Validação de Quantidade por Unidade
- Unidades inteiras (un, g, ml) não aceitam decimais
- Unidades decimais (kg, l) aceitam até 3 casas decimais
- Limites específicos por tipo de unidade

### 3. Validação de Formato
- Telefone: formato brasileiro (10 ou 11 dígitos)
- E-mail: formato válido com @ e domínio
- CNPJ: formato com máscara 00.000.000/0000-00
- CPF: formato com máscara 000.000.000-00

### 4. Validação de Desconto
- Desconto percentual: máximo 50%
- Desconto fixo: máximo R$ 999,99
- Não permite valores negativos

## 🚀 Benefícios

1. **Consistência**: Todas as validações seguem o mesmo padrão
2. **Manutenibilidade**: Limites centralizados facilitam ajustes
3. **UX Melhorada**: Usuário não consegue digitar valores inválidos
4. **Menos Erros**: Validação preventiva reduz erros de usuário
5. **Código Limpo**: Removidas validações duplicadas e manuais
6. **Type Safety**: TypeScript garante tipos corretos em todo o projeto

## 📋 Checklist de Validação

- ✅ Ingredientes: quantidade, preço, unidade
- ✅ Produtos: nome, categoria, preço, margem
- ✅ Pagamento: método, desconto
- ✅ Custos Fixos: nome, valor, recorrência
- ✅ Custos Variáveis: nome, percentual, valor fixo
- ✅ Taxas de Pagamento: percentuais por método
- ✅ Configurações Financeiras: margem, reserva, meta
- ✅ Dados da Loja: telefone, e-mail, CNPJ

## 🔄 Próximos Passos (Opcional)

1. Adicionar validação de CEP com busca automática de endereço
2. Implementar validação de CPF com dígito verificador
3. Adicionar máscaras para outros campos (data, hora, etc.)
4. Criar testes unitários para validações
5. Adicionar feedback visual mais rico (tooltips, hints)

## 📚 Documentação de Uso

### Como usar os novos componentes:

```tsx
// PhoneInput
<PhoneInput
  label="Telefone"
  value={phone}
  onChange={(value) => setPhone(value)}
  placeholder="(11) 99999-9999"
  required
/>

// EmailInput
<EmailInput
  label="E-mail"
  value={email}
  onChange={(value) => setEmail(value)}
  placeholder="exemplo@email.com"
  required
/>

// CurrencyInput com limites
<CurrencyInput
  label="Preço"
  value={price}
  onChange={(value) => setPrice(value)}
  maxValue={CURRENCY_LIMITS.product.max}
  minValue={CURRENCY_LIMITS.product.min}
/>

// QuantityInput com limites por unidade
<QuantityInput
  label="Quantidade"
  value={quantity}
  onChange={(value) => setQuantity(value)}
  unit={unit}
  allowDecimals={UNIT_LIMITS[unit].decimals > 0}
  maxValue={UNIT_LIMITS[unit].max}
  minValue={UNIT_LIMITS[unit].min}
/>
```

## ✅ Conclusão

Todos os formulários do projeto foram atualizados para usar validação centralizada via schemas Zod e máscaras de entrada. As validações obsoletas foram removidas e substituídas por validações lógicas que previnem erros do usuário antes mesmo da submissão do formulário.

O usuário agora não consegue digitar valores acima dos limites estabelecidos, e todos os campos com formatos específicos (telefone, e-mail, CNPJ) possuem máscaras automáticas e validação em tempo real.
