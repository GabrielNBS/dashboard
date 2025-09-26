# Sistema de Confirmação Moderno

Este documento descreve o novo sistema de confirmação que substitui o método `window.confirm()` nativo por um componente de UI/UX mais moderno e seguro.

## Componentes Criados

### 1. ConfirmationDialog

Componente principal que renderiza o modal de confirmação com:

- Design moderno usando shadcn/ui Dialog
- Campo de input para digitar texto de confirmação
- Diferentes variantes visuais (destructive, warning, default)
- Acessibilidade completa

**Localização:** `src/components/ui/feedback/ConfirmationDialog.tsx`

### 2. useConfirmation Hook

Hook personalizado para gerenciar o estado do dialog de confirmação.

**Localização:** `src/hooks/ui/useConfirmation.tsx`

### 3. ConfirmationProvider (Opcional)

Provider global para usar confirmações em qualquer lugar da aplicação.

**Localização:** `src/components/ui/feedback/ConfirmationProvider.tsx`

## Como Usar

### Uso Básico com Hook

```tsx
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';

function MyComponent() {
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  const handleDelete = (itemId: string) => {
    showConfirmation(
      {
        title: 'Excluir Item',
        description: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
        variant: 'destructive',
      },
      () => {
        // Ação a ser executada após confirmação
        deleteItem(itemId);
      }
    );
  };

  return (
    <>
      <button onClick={() => handleDelete('123')}>Excluir Item</button>

      {/* Dialog de confirmação */}
      {confirmationState && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          description={confirmationState.description}
          variant={confirmationState.variant}
          confirmText={confirmationState.confirmText}
          confirmButtonText={confirmationState.confirmButtonText}
          cancelButtonText={confirmationState.cancelButtonText}
        />
      )}
    </>
  );
}
```

### Opções de Configuração

```tsx
showConfirmation(
  {
    title: 'Título do Dialog',
    description: 'Descrição detalhada da ação',
    confirmText: 'excluir permanentemente', // Texto que deve ser digitado
    confirmButtonText: 'Confirmar Exclusão', // Texto do botão de confirmação
    cancelButtonText: 'Cancelar', // Texto do botão de cancelamento
    variant: 'destructive', // 'destructive' | 'warning' | 'default'
  },
  () => {
    // Callback executado após confirmação
  }
);
```

## Arquivos Atualizados

### Componentes que foram migrados do `window.confirm()`:

1. **IngredientList.tsx** - Exclusão de ingredientes
2. **ProductsList.tsx** - Exclusão de produtos
3. **FixedCostsSection.tsx** - Exclusão de custos fixos
4. **VariableCostsSection.tsx** - Exclusão de custos variáveis
5. **useFinanceActions.tsx** - Exclusão de vendas
6. **settings/page.tsx** - Reset de configurações
7. **Finance.tsx** - Confirmações financeiras

### Padrão de Migração

**Antes:**

```tsx
const handleDelete = (id: string) => {
  if (confirm('Tem certeza que deseja excluir?')) {
    deleteItem(id);
  }
};
```

**Depois:**

```tsx
const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

const handleDelete = (id: string) => {
  showConfirmation(
    {
      title: 'Excluir Item',
      description: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
      variant: 'destructive',
    },
    () => {
      deleteItem(id);
    }
  );
};

// No JSX:
{
  confirmationState && (
    <ConfirmationDialog
      isOpen={confirmationState.isOpen}
      onClose={hideConfirmation}
      onConfirm={handleConfirm}
      title={confirmationState.title}
      description={confirmationState.description}
      variant={confirmationState.variant}
      confirmText={confirmationState.confirmText}
      confirmButtonText={confirmationState.confirmButtonText}
      cancelButtonText={confirmationState.cancelButtonText}
    />
  );
}
```

## Benefícios

1. **Segurança**: Usuário deve digitar texto específico para confirmar ações destrutivas
2. **UX Moderna**: Interface consistente com o design system
3. **Acessibilidade**: Suporte completo a leitores de tela e navegação por teclado
4. **Flexibilidade**: Diferentes variantes visuais e textos customizáveis
5. **Consistência**: Mesmo padrão em toda a aplicação

## Texto de Confirmação Padrão

Por padrão, o usuário deve digitar "excluir permanentemente" para confirmar ações destrutivas. Este texto pode ser customizado através da prop `confirmText`.

## Variantes Visuais

- **destructive**: Vermelho, para ações que excluem dados
- **warning**: Amarelo, para ações que podem ter consequências
- **default**: Cinza, para confirmações gerais

## 🎨 Formatação Avançada de Descrições

### Suporte a JSX nas Descrições

O componente agora suporta tanto strings simples quanto JSX para descrições, permitindo controle total sobre a formatação.

### Exemplos de Formatação:

**1. Descrição Simples (String):**

```tsx
showConfirmation(
  {
    title: 'Excluir Produto',
    description: 'Esta ação não pode ser desfeita.',
    variant: 'destructive',
  },
  () => {
    deleteProduct();
  }
);
```

**2. Descrição com Texto em Negrito:**

```tsx
showConfirmation(
  {
    title: 'Excluir Ingrediente',
    description: (
      <>
        Tem certeza que deseja excluir <strong>"{ingredientName}"</strong>? Esta ação não pode ser
        desfeita.
      </>
    ),
    variant: 'destructive',
  },
  () => {
    deleteIngredient();
  }
);
```

**3. Descrição com Layout Complexo:**

```tsx
showConfirmation(
  {
    title: 'Excluir Venda',
    description: (
      <div className="space-y-2">
        <p>Deseja realmente excluir esta venda?</p>
        <p className="rounded bg-amber-50 p-2 text-sm text-amber-700">
          <strong>⚠️ Os ingredientes serão restaurados</strong> para o estoque automaticamente.
        </p>
        <p className="text-sm text-red-600">Esta ação não pode ser desfeita.</p>
      </div>
    ),
    variant: 'destructive',
  },
  () => {
    deleteSale();
  }
);
```

### Benefícios da Formatação JSX:

- **Destaque Visual**: Use `<strong>` para destacar informações importantes
- **Cores Contextuais**: Aplique classes Tailwind para diferentes tipos de informação
- **Layout Estruturado**: Organize informações em parágrafos e seções
- **Ícones e Emojis**: Adicione elementos visuais para melhor comunicação
- **Alertas Visuais**: Crie caixas de aviso com cores de fundo

### Casos de Uso Recomendados:

- **Ações Destrutivas**: Destaque consequências importantes em negrito
- **Restauração de Dados**: Informe sobre efeitos colaterais positivos
- **Avisos Críticos**: Use cores e ícones para chamar atenção
- **Informações Técnicas**: Estruture dados complexos de forma clara
