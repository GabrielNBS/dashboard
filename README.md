# 🛍️ Dashboard de Gestão Empresarial

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.0-EC5990?logo=react-hook-form&logoColor=white)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3.0-3E63DD?logo=zod&logoColor=white)](https://zod.dev/)

---

## ✨ Sobre o Projeto

Sistema completo de gestão empresarial focado em pequenos negócios de alimentação e varejo. O dashboard oferece controle total sobre vendas, estoque de ingredientes, produção de produtos e análise financeira em tempo real.

Desenvolvido com uma arquitetura **Frontend-First**, utilizando **Next.js 15** e **Context API** para gerenciamento de estado, garantindo uma experiência fluida e reativa sem dependência inicial de backend complexo.

---

## 🚀 Tecnologias e Arquitetura

### Stack Tecnológico

- **Core:** Next.js 15 (App Router), React 18, TypeScript
- **Estilização:** Tailwind CSS, Tailwind Variants, Lucide React (Ícones)
- **Gerenciamento de Estado:** React Context API (Modularizado por domínio)
- **Formulários & Validação:** React Hook Form + Zod
- **Persistência:** LocalStorage (com Custom Hooks para sincronização)
- **Animações:** Framer Motion, LordIcon

### Decisões de Arquitetura

1.  **Modularização por Domínio:**
    O código é organizado em módulos de negócio (`sales`, `products`, `ingredients`, `finance`), facilitando a manutenção e escalabilidade. Cada módulo possui seus próprios contextos, hooks e tipos.

2.  **Business Hooks Pattern:**
    A lógica de negócios complexa é extraída para hooks customizados (ex: `useUnifiedSaleProcess`, `useProductionProcess`). Isso separa a lógica da UI, tornando os componentes mais limpos e a lógica testável.

3.  **Unified State Management:**
    O estado global é gerenciado através de múltiplos Context Providers (`OptimizedProviders`), evitando "Prop Drilling" e garantindo que dados como estoque e vendas estejam disponíveis em toda a aplicação.

4.  **Design System Próprio:**
    Componentes de UI reutilizáveis (`components/ui`) construídos sobre Tailwind CSS garantem consistência visual e agilidade no desenvolvimento.

---

## 🧠 Regras de Negócio

### 1. Gestão de Produtos e Produção

O sistema suporta dois modos de produção distintos, fundamentais para negócios de alimentação:

*   **Produção sob Demanda (Unitária):**
    *   Ideal para itens feitos na hora (ex: sucos, sanduíches).
    *   **Fluxo:** A venda do produto desconta *imediatamente* os ingredientes do estoque.
    *   Não requer estoque prévio do produto final.

*   **Produção em Lote (Batch):**
    *   Ideal para itens pré-produzidos (ex: bolos, salgados congelados).
    *   **Fluxo de Produção:** O usuário registra a produção de X lotes -> Ingredientes são descontados -> Estoque do produto aumenta.
    *   **Fluxo de Venda:** A venda desconta do *estoque do produto*, não dos ingredientes.

### 2. Controle de Estoque Inteligente

*   **Ingredientes:** Controle preciso com suporte a múltiplas unidades (kg, g, l, ml, un). O sistema normaliza automaticamente as quantidades para cálculos de custo.
*   **Alertas:** Monitoramento automático de níveis de estoque (Crítico, Atenção, Normal) baseado em limites configuráveis.
*   **Custo Médio:** Cálculo dinâmico do custo dos produtos baseado no preço médio de aquisição dos ingredientes.

### 3. Processo de Vendas (PDV)

*   **Carrinho Unificado:** Suporta venda simultânea de produtos unitários e em lote.
*   **Validação em Tempo Real:** Impede a venda se não houver estoque suficiente (de ingredientes para unitários ou de produto para lotes).
*   **Gestão de Taxas:** Cálculo automático de taxas de pagamento (Crédito, Débito, Apps de Entrega) para projeção real de lucro líquido.

### 4. Gestão Financeira

*   **DRE em Tempo Real:** Demonstração do Resultado do Exercício calculada instantaneamente.
*   **Margem de Contribuição:** Análise detalhada de lucro por produto e por venda.
*   **Custos Fixos vs Variáveis:** Separação clara para cálculo de ponto de equilíbrio.

---

## 📦 Estrutura do Projeto

```bash
src/
├── app/                    # Rotas e Páginas (Next.js App Router)
├── components/
│   ├── dashboard/          # Componentes de Negócio (Cards, Gráficos, Listas)
│   ├── ui/                 # Design System (Botões, Inputs, Modais)
│   └── ...
├── contexts/               # Estado Global (Sales, Products, Ingredients)
├── hooks/
│   ├── business/           # Lógica de Negócio (Regras cruciais aqui)
│   └── ui/                 # Lógica de Interface
├── types/                  # Definições de Tipos TypeScript
├── utils/                  # Helpers e Cálculos Puros
└── schemas/                # Validações Zod
```

---

## 🎯 Funcionalidades Principais

### 📊 Dashboard
- Visão geral de faturamento, lucro e margem.
- Gráficos de tendência de receita.
- Resumo de estoque crítico.

### 🛍️ Produtos
- Cadastro completo com ficha técnica (ingredientes).
- Definição de modo de produção (Lote vs Unitário).
- Precificação inteligente (Sugestão de preço baseada em custos).

### 🧪 Ingredientes
- Gestão de compras e estoque.
- Histórico de preços.
- Conversão automática de unidades.

### 💰 Vendas (PDV)
- Interface ágil para registro de vendas.
- Seleção de método de pagamento.
- Feedback visual de sucesso/erro (Toast Notifications).

---

## �️ Instalação e Uso

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/dashboard.git
    cd dashboard
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm dev
    ```

4.  **Acesse:** Abra `http://localhost:3000` no seu navegador.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as regras de negócio acima antes de propor mudanças estruturais na lógica de estoque ou vendas.

1.  Fork o projeto.
2.  Crie sua Feature Branch (`git checkout -b feature/NovaFeature`).
3.  Commit suas mudanças (`git commit -m 'Add: Nova Feature'`).
4.  Push para a Branch (`git push origin feature/NovaFeature`).
5.  Abra um Pull Request.

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Gabriel N.** — Desenvolvedor Full Stack
[LinkedIn](https://www.linkedin.com/in/gabrielnascimento-dev/) | [Portfólio](https://personal-portfolio-flax-gamma.vercel.app/)
