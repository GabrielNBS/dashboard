# Padronização dos Componentes de Input

## Resumo das Alterações

Todos os componentes de input foram padronizados para garantir consistência visual e funcional em todo o projeto.

## Componentes Padronizados

### 1. Input Base (`src/components/ui/base/Input.tsx`)

- **Adicionado**: Suporte a variantes de tamanho (`sm`, `md`, `lg`)
- **Padronizado**: Estados de foco, erro e disabled
- **Melhorado**: Sistema de classes CSS usando `cn()` utility
- **Corrigido**: Conflito com propriedade `size` nativa do HTML

### 2. CurrencyInput (`src/components/ui/forms/CurrencyInput.tsx`)

- **Adicionado**: Props `label`, `error`, `size`
- **Padronizado**: Posicionamento do ícone R$ baseado no tamanho
- **Otimizado**: `formatCurrency` com `useCallback` para performance
- **Unificado**: Estrutura de label e erro consistente

### 3. PercentageInput (`src/components/ui/forms/PercentageInput.tsx`)

- **Adicionado**: Props `label`, `error`, `size`
- **Padronizado**: Posicionamento do ícone % baseado no tamanho
- **Unificado**: Estrutura de label e erro consistente

### 4. QuantityInput (`src/components/ui/forms/QuantityInput.tsx`)

- **Adicionado**: Props `label`, `error`, `size`
- **Padronizado**: Posicionamento da unidade baseado no tamanho
- **Unificado**: Estrutura de label e erro consistente

### 5. SearchInput (`src/components/ui/forms/SearchInput.tsx`)

- **Adicionado**: Props `label`, `error`, `size`
- **Padronizado**: Tamanho do ícone baseado na variante
- **Corrigido**: Conflito com propriedade `size` nativa
- **Unificado**: Estrutura de label e erro consistente

### 6. NumericInput (`src/components/ui/forms/NumericInput.tsx`)

- **Adicionado**: Suporte a variante `size`
- **Padronizado**: Uso do Input base com sistema unificado
- **Corrigido**: Conflito de tipos com propriedade `size`

### 7. SearchableInput (`src/components/ui/SearcheableInput.tsx`)

- **Adicionado**: Props `label`, `error`, `size`
- **Padronizado**: Dropdown com bordas e transições consistentes
- **Unificado**: Estrutura de label e erro consistente

## Padrões Estabelecidos

### Variantes de Tamanho

```typescript
size?: 'sm' | 'md' | 'lg'
```

- **sm**: `px-3 py-2 text-sm` - Ícones 16x16px
- **md**: `px-4 py-3 text-sm` - Ícones 20x20px (padrão)
- **lg**: `px-4 py-4 text-base` - Ícones 24x24px

### Estrutura de Props Comum

```typescript
interface CommonInputProps {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
}
```

### Estrutura de Renderização

```tsx
<div className="flex flex-col gap-1">
  {/* Label com asterisco para required */}
  {label && (
    <label className="text-foreground mb-1 block text-sm font-medium">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )}

  {/* Container do input */}
  <div className="relative">
    <Input {...props} />
    {/* Ícones posicionados responsivamente */}
  </div>

  {/* Mensagem de erro */}
  {error && <span className="text-destructive text-sm font-medium">{error}</span>}
</div>
```

### Classes CSS Padronizadas

- **Base**: `w-full rounded-lg border transition-colors`
- **Foco**: `focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none`
- **Erro**: `border-destructive focus:border-destructive focus:ring-destructive/20`
- **Disabled**: `disabled:cursor-not-allowed disabled:opacity-50`

## Benefícios da Padronização

1. **Consistência Visual**: Todos os inputs têm a mesma aparência e comportamento
2. **Escalabilidade**: Sistema de tamanhos permite adaptação a diferentes contextos
3. **Acessibilidade**: Labels e estados de erro padronizados
4. **Manutenibilidade**: Código mais limpo e reutilizável
5. **Performance**: Otimizações como `useCallback` aplicadas consistentemente

## Uso Recomendado

```tsx
// Exemplo de uso padronizado
<CurrencyInput
  label="Preço de Venda"
  value={price}
  onChange={setPrice}
  size="md"
  required
  error={errors.price}
/>

<PercentageInput
  label="Margem de Lucro"
  value={margin}
  onChange={setMargin}
  size="md"
  maxValue={300}
  required
/>
```

## Arquivo de Exportação

Criado `src/components/ui/forms/index.ts` para centralizar todas as exportações dos componentes de input.
