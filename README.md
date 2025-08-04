# 🛍️ Dashboard de Gestão Empresarial

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=react-hook-form&logoColor=white)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3E63DD?logo=zod&logoColor=white)](https://zod.dev/)

---

## ✨ Sobre o Projeto

Sistema completo de gestão empresarial com foco em controle financeiro, gestão de produtos e vendas. Desenvolvido com **Next.js 15**, **TypeScript**, **Tailwind CSS** e **React Hook Form** com validação Zod. Arquitetura modular e escalável com Context API para gerenciamento de estado global.

---

## 🚀 Tecnologias e Ferramentas

### Core

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### UI/UX

- **Lucide React** - Ícones
- **Framer Motion** - Animações
- **Tailwind Variants** - Sistema de variantes
- **Chart.js** - Gráficos

### Desenvolvimento

- **ESLint + Prettier** - Linting e formatação
- **pnpm** - Gerenciador de pacotes

---

## 📦 Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (Next.js App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   ├── finance/           # Módulo financeiro
│   ├── product/           # Módulo de produtos
│   ├── pdv/              # Módulo de vendas
│   ├── store/            # Módulo de estoque
│   └── logout/           # Autenticação
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Input, etc.)
│   ├── dashboard/        # Componentes específicos do dashboard
│   └── mobile/          # Componentes mobile
├── contexts/             # Context API para estado global
│   ├── sales/           # Contexto de vendas
│   ├── products/        # Contexto de produtos
│   └── Ingredients/     # Contexto de ingredientes
├── hooks/               # Custom hooks
│   ├── useLocalStorage.tsx
│   ├── useSummaryFinance.tsx
│   └── useHydrated.tsx
├── utils/               # Funções utilitárias
│   ├── finance.ts       # Cálculos financeiros
│   ├── normalizeQuantity.ts # Normalização de unidades
│   ├── formatCurrency.ts # Formatação monetária
│   └── ingredientUtils.ts # Utilitários de ingredientes
├── types/               # Definições TypeScript
├── schemas/             # Schemas de validação Zod
└── styles/              # Estilos globais
```

---

## 🎯 Funcionalidades Principais

### 💰 Gestão Financeira

- **Cálculo automático** de receita, custos e lucros
- **Análise de margem** de lucro em tempo real
- **Controle de custos fixos** e variáveis
- **Relatórios financeiros** com gráficos

### 🛍️ Gestão de Produtos

- **Cadastro de produtos** com ingredientes
- **Cálculo de custos** baseado em ingredientes
- **Controle de estoque** com alertas
- **Categorização** de produtos

### 📊 PDV (Ponto de Venda)

- **Registro de vendas** em tempo real
- **Controle de estoque** automático
- **Histórico de transações**
- **Relatórios de vendas**

### 🧪 Gestão de Ingredientes

- **Cadastro de ingredientes** com unidades variadas
- **Normalização automática** de unidades (kg→g, l→ml)
- **Cálculo de custos** por unidade
- **Controle de estoque** por ingrediente

### 🔧 Sistema de Validação

- **Validação robusta** com Zod
- **Feedback em tempo real** para o usuário
- **Validação específica** por tipo de unidade
- **Tratamento de erros** elegante

---

## 🛠️ Como Usar

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dashboard.git
cd dashboard

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Scripts Disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Verificação de código
```

---

## 📋 Exemplos de Uso

### Gestão Financeira

```tsx
import { useFinanceSummary } from '@/hooks/useSummaryFinance';

const { totalRevenue, netProfit, margin } = useFinanceSummary(sales, fixedCosts);
```

### Validação de Formulários

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ingredientSchema } from '@/schemas/validationSchemas';

const form = useForm({
  resolver: zodResolver(ingredientSchema),
});
```

### Normalização de Unidades

```tsx
import { normalizeQuantity, formatQuantity } from '@/utils/normalizeQuantity';

const normalized = normalizeQuantity(1.5, 'kg'); // 1500g
const formatted = formatQuantity(1500, 'g'); // "1.50 kg"
```

---

## 🎨 Sistema de Design

### Componentes Base

- **Button** - Botões com variantes (accept, edit, destructive, etc.)
- **Input** - Campos de entrada com validação
- **CardFinance** - Cards para métricas financeiras
- **Toast** - Sistema de notificações

### Contextos

- **SalesContext** - Gerenciamento de vendas
- **ProductBuilderContext** - Construção de produtos
- **IngredientsContext** - Gestão de ingredientes

### Hooks Customizados

- **useLocalStorage** - Persistência local com sincronização
- **useSummaryFinance** - Cálculos financeiros
- **useToast** - Sistema de notificações

---

## 🔧 Configuração

### ESLint + Prettier

O projeto usa configuração customizada para garantir qualidade de código:

- Regras do Next.js
- Integração com Prettier
- Suporte a TypeScript

### Tailwind CSS

Configurado com:

- Sistema de cores customizado
- Variantes responsivas
- Classes utilitárias otimizadas

---

## 📊 Métricas e Performance

### Funcionalidades Implementadas

- ✅ Sistema de validação robusto
- ✅ Gestão financeira completa
- ✅ Controle de produtos e ingredientes
- ✅ Sistema de toast notifications
- ✅ Persistência local com localStorage
- ✅ Componentes reutilizáveis
- ✅ Tipagem TypeScript completa
- ✅ Documentação JSDoc

### Próximas Funcionalidades

- [ ] Autenticação e autorização
- [ ] Integração com backend
- [ ] Testes automatizados
- [ ] Deploy com Vercel
- [ ] PWA (Progressive Web App)
- [ ] Relatórios avançados
- [ ] Backup e sincronização

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para tipagem
- Documente funções com JSDoc
- Siga as convenções do ESLint
- Teste suas mudanças

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Gabriel N.** — Desenvolvedor Full Stack  
[LinkedIn](https://www.linkedin.com/in/gabrielnascimento-dev/) | [Portfólio](https://personal-portfolio-flax-gamma.vercel.app/)

---

## 🙏 Agradecimentos

- Next.js Team pelo framework incrível
- Tailwind CSS pela biblioteca de utilidades
- Comunidade React pela documentação e suporte
