# Diretrizes para Aninhamento HTML

## Problema: Elementos `<p>` Aninhados

### Por que acontece?

O erro "In HTML, `<p>` cannot be a descendant of `<p>`" ocorre quando tentamos colocar um elemento `<p>` dentro de outro `<p>`, o que é inválido em HTML.

### Casos comuns no projeto:

#### 1. DialogDescription + JSX com `<p>`

```tsx
// ❌ ERRADO - Cria <p><p>...</p></p>
<DialogDescription>
  <p className="bg-amber-50 p-2">Mensagem de aviso</p>
</DialogDescription>

// ✅ CORRETO - Usa <div> ou <span>
<DialogDescription>
  <div className="bg-amber-50 p-2">Mensagem de aviso</div>
</DialogDescription>
```

#### 2. Componentes Radix UI que renderizam `<p>`

Componentes que renderizam `<p>` por padrão:

- `DialogDescription`
- `AlertDialogDescription`
- `TooltipContent`
- `PopoverContent` (quando usado para texto)

### Como evitar:

#### 1. Use elementos inline ou block apropriados

```tsx
// Para conteúdo inline
<span className="text-red-500">Texto de erro</span>

// Para conteúdo block
<div className="bg-yellow-50 p-2">Aviso importante</div>
```

#### 2. Verifique a documentação do componente

Sempre verifique se o componente pai já renderiza um elemento `<p>`.

#### 3. Use ferramentas de validação

- React DevTools mostra a estrutura DOM
- Validadores HTML podem detectar aninhamento inválido

### Elementos que NÃO podem estar dentro de `<p>`:

- `<div>`
- `<p>`
- `<h1>`, `<h2>`, etc.
- `<ul>`, `<ol>`, `<li>`
- `<table>`
- `<form>`
- Qualquer elemento block

### Elementos que PODEM estar dentro de `<p>`:

- `<span>`
- `<strong>`, `<em>`
- `<a>`
- `<img>`
- `<button>` (com cuidado)
- Qualquer elemento inline

## Correção Aplicada

No arquivo `src/hooks/business/useFinanceActions.tsx`:

```tsx
// Antes (❌)
description: (
  <p className="rounded bg-amber-50 p-2 text-sm text-amber-700">
    <strong>⚠️ Os ingredientes serão restaurados</strong> para o estoque automaticamente.
  </p>
),

// Depois (✅)
description: (
  <div className="rounded bg-amber-50 p-2 text-sm text-amber-700">
    <strong>⚠️ Os ingredientes serão restaurados</strong> para o estoque automaticamente.
  </div>
),
```

## Checklist para Revisão

- [ ] Verificar se componentes de UI (Dialog, Alert, etc.) já renderizam `<p>`
- [ ] Usar `<div>` ou `<span>` em vez de `<p>` dentro de descriptions
- [ ] Testar no navegador para verificar estrutura HTML
- [ ] Usar React DevTools para inspecionar a árvore de componentes
