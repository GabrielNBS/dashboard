# Erros de Manipulação DOM no React

## Problema: "Failed to execute 'insertBefore' on 'Node'"

### Por que acontece?

Este erro ocorre quando o React tenta manipular elementos DOM que não existem mais ou foram modificados por renderizações concorrentes. É comum em:

1. **Renderizações condicionais rápidas**: Elementos aparecem/desaparecem muito rapidamente
2. **Estado assíncrono**: Mudanças de estado muito frequentes
3. **Falta de keys estáveis**: React não consegue identificar elementos corretamente

### Casos comuns no projeto:

#### 1. Múltiplas renderizações condicionais

```tsx
// ❌ PROBLEMÁTICO - Múltiplas condições podem conflitar
{
  !inputValue && <p>Mensagem 1</p>;
}
{
  inputValue && condition1 && <p>Mensagem 2</p>;
}
{
  inputValue && condition2 && <p>Mensagem 3</p>;
}
{
  inputValue && condition3 && <p>Mensagem 4</p>;
}

// ✅ CORRETO - Uma única renderização condicional
<div className="min-h-[20px]">
  {React.useMemo(() => {
    if (!inputValue) return <p key="empty">Mensagem 1</p>;
    if (condition1) return <p key="cond1">Mensagem 2</p>;
    if (condition2) return <p key="cond2">Mensagem 3</p>;
    return <p key="default">Mensagem 4</p>;
  }, [inputValue, condition1, condition2])}
</div>;
```

#### 2. Mudanças de estado muito rápidas

```tsx
// ❌ PROBLEMÁTICO - Mudanças síncronas
const handleChange = value => {
  setValue(value);
  setError('');
  setStatus('typing');
};

// ✅ CORRETO - Mudanças assíncronas
const handleChange = value => {
  requestAnimationFrame(() => {
    setValue(value);
    setError('');
    setStatus('typing');
  });
};
```

### Soluções aplicadas:

#### 1. Renderização condicional única

- Substituir múltiplas condições por uma única função
- Usar `useMemo` para estabilizar renderizações
- Adicionar `key` props para identificação única

#### 2. Controle de timing

- Usar `requestAnimationFrame` para mudanças de estado
- Usar `setTimeout` para limpeza de estado
- Adicionar `useEffect` para sincronização

#### 3. Estado estável

- Memoizar valores computados com `useMemo`
- Usar `useCallback` para funções estáveis
- Limpar estado quando componente é desmontado

## Correção Aplicada no ConfirmationDialog

### Antes (❌):

```tsx
{
  !inputValue && <p>Mensagem 1</p>;
}
{
  inputValue && !isConfirmEnabled && inputValue.length < confirmText.length && <p>Mensagem 2</p>;
}
{
  inputValue && !isConfirmEnabled && inputValue.length >= confirmText.length && <p>Mensagem 3</p>;
}
{
  isConfirmEnabled && <p>Mensagem 4</p>;
}
```

### Depois (✅):

```tsx
<div className="min-h-[20px]">
  {React.useMemo(() => {
    if (!inputValue) return <p key="empty">Mensagem 1</p>;
    if (isConfirmEnabled) return <p key="enabled">Mensagem 4</p>;
    if (inputValue.length < confirmText.length) return <p key="typing">Mensagem 2</p>;
    return <p key="incorrect">Mensagem 3</p>;
  }, [inputValue, isConfirmEnabled, confirmText])}
</div>
```

### Melhorias adicionais:

```tsx
// Estado memoizado
const isConfirmEnabled = React.useMemo(
  () => inputValue.toLowerCase() === confirmText.toLowerCase(),
  [inputValue, confirmText]
);

// Mudanças de estado assíncronas
const handleInputChange = e => {
  const value = e.target.value;
  requestAnimationFrame(() => {
    setInputValue(value);
    if (error && value.length > 0) {
      setError('');
    }
  });
};

// Limpeza de estado
React.useEffect(() => {
  if (!isOpen) {
    setInputValue('');
    setError('');
  }
}, [isOpen]);
```

## Checklist para Prevenção

- [ ] Evitar múltiplas renderizações condicionais do mesmo tipo
- [ ] Usar `key` props únicos e estáveis
- [ ] Memoizar valores computados com `useMemo`
- [ ] Usar `requestAnimationFrame` para mudanças rápidas de estado
- [ ] Limpar estado quando componentes são desmontados
- [ ] Testar interações rápidas (digitação, cliques múltiplos)
- [ ] Usar React DevTools para inspecionar re-renderizações
