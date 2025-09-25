# Resumo dos Limites de Negócio Implementados

## Filosofia dos Limites

Os limites foram definidos considerando:

- **Pequenos e Médios Negócios (PME)**: Valores realistas para este segmento
- **Prevenção de Anomalias**: Evitar valores absurdos que não fazem sentido comercial
- **Usabilidade**: Limites que não restringem uso legítimo, mas previnem erros

## Limites por Categoria

### 💰 **Valores Monetários (CurrencyInput)**

#### Produtos e Vendas

- **Preço de Produtos**: R$ 9.999,99
  - Adequado para produtos de PME (alimentos, artesanato, serviços)
  - Evita preços irreais como R$ 999.999,99

#### Ingredientes e Compras

- **Preço de Ingredientes**: R$ 99.999,99
  - Permite compras em maior volume
  - Adequado para matéria-prima e equipamentos

#### Configurações Financeiras

- **Meta Mensal de Vendas**: R$ 9.999.999,99

  - Permite metas ambiciosas mas realistas
  - Adequado para empresas em crescimento

- **Custos Fixos**: R$ 999.999,99
  - Aluguel, salários, equipamentos
  - Cobre custos significativos sem exageros

#### PDV e Descontos

- **Desconto em Dinheiro**: R$ 999,99
  - Evita descontos maiores que o valor do produto
  - Adequado para promoções pontuais

#### Custos Variáveis

- **Valor Fixo por Unidade**: R$ 9.999,99
  - Comissões, embalagens, taxas
  - Proporcional ao valor dos produtos

### 📊 **Percentuais (PercentageInput)**

#### Margens e Lucros

- **Margem de Lucro Padrão**: 0% - 500%

  - Permite margens altas para produtos especializados
  - Evita valores negativos ou excessivos

- **Reserva de Emergência**: 0% - 50%
  - Percentual realista do lucro para reservas
  - Evita reservas excessivas que prejudiquem fluxo

#### Descontos e Taxas

- **Desconto Percentual**: 0% - 50%

  - Evita descontos que inviabilizem a venda
  - Permite promoções significativas

- **Taxas de Pagamento**: 0% - 25%
  - Baseado em taxas reais do mercado brasileiro
  - Evita configurações irreais

#### Custos Variáveis

- **Percentual sobre Vendas**: 0% - 50%
  - Comissões, impostos, taxas variáveis
  - Evita percentuais que inviabilizem o negócio

### 📦 **Quantidades (QuantityInput)**

#### Produção

- **Rendimento por Lote**: 1 - 10.000 unidades
  - Adequado para produção artesanal e semi-industrial
  - Evita lotes irreais

#### Ingredientes

- **Quantidade de Ingredientes**:
  - **Unidades**: 1 - 1.000 unidades
  - **Peso/Volume**: 0,001 - 100 kg/l
  - Adequado para receitas e estoque PME

#### Estoque

- **Compra de Ingredientes**:
  - **Unidades**: 1 - 10.000 unidades
  - **Peso/Volume**: 0,001 - 1.000 kg/l
  - Permite compras em volume sem exageros

## Validações Técnicas Implementadas

### 🔢 **Formatação Inteligente**

- **Moeda**: Formatação automática R$ 1.234,56
- **Percentual**: Máximo 2 casas decimais (25,50%)
- **Quantidade**: Casas decimais baseadas na unidade
  - kg/l: até 3 casas (1,250 kg)
  - unidades: apenas inteiros (150 un)

### 🚫 **Prevenção de Erros**

- **Valores Negativos**: Bloqueados em todos os inputs
- **Caracteres Inválidos**: Apenas números e separadores decimais
- **Limites Dinâmicos**: Aplicados em tempo real durante digitação
- **Overflow**: Valores acima do limite são automaticamente limitados

### ✅ **Experiência do Usuário**

- **Indicação Visual**: Prefixos/sufixos claros (R$, %, kg, l, un)
- **Placeholders Informativos**: Mostram formato esperado
- **Limpeza Total**: Usuários podem apagar completamente os valores
- **Formatação em Tempo Real**: Valores formatados conforme digitação

## Exemplos de Uso Prático

### ✅ **Valores Aceitos**

```
Preços: R$ 15,99 | R$ 1.250,00 | R$ 9.999,99
Margens: 25% | 150% | 300%
Quantidades: 2,5 kg | 150 un | 0,250 l
Descontos: 10% | R$ 50,00 | 25%
```

### ❌ **Valores Bloqueados**

```
Preços: R$ 99.999,99 → limitado a R$ 9.999,99
Margens: 1000% → limitado a 500%
Quantidades: 50000 un → limitado a 10000 un
Descontos: 80% → limitado a 50%
```

## Benefícios para o Negócio

### 🎯 **Prevenção de Erros**

- Evita configurações que inviabilizem vendas
- Previne erros de digitação (zeros extras)
- Mantém dados dentro da realidade comercial

### 📈 **Melhoria na Gestão**

- Força reflexão sobre preços e margens
- Evita metas irreais ou muito baixas
- Mantém custos proporcionais ao negócio

### 🔒 **Consistência de Dados**

- Todos os valores seguem padrões realistas
- Relatórios e cálculos mais confiáveis
- Integração com sistemas externos facilitada

### 👥 **Experiência do Usuário**

- Interface mais intuitiva e segura
- Menos erros e retrabalho
- Confiança no sistema aumentada

## Configurações Específicas por Contexto

| Contexto      | Moeda Máx       | Percentual Máx | Quantidade Máx |
| ------------- | --------------- | -------------- | -------------- |
| Produtos      | R$ 9.999,99     | 300% margem    | 10k un/lote    |
| Ingredientes  | R$ 99.999,99    | -              | 1k kg/l        |
| PDV           | R$ 999,99       | 50% desconto   | -              |
| Configurações | R$ 9.999.999,99 | 50% reserva    | -              |
| Custos Fixos  | R$ 999.999,99   | -              | -              |
| Taxas         | -               | 25% máx        | -              |

Estes limites garantem que o sistema seja robusto, realista e adequado para pequenos e médios negócios brasileiros.
