// src/components/ui/CardFinance.tsx
// Componente responsável por exibir informações financeiras em cards flexíveis

import { FinanceSummary } from '@/hooks/useSummaryFinance';
import { formatCurrency, formatPercent } from '@/utils/formatCurrency';

/**
 * Interface para definir um card financeiro individual
 */
export interface FinanceCard {
  title: string;
  value: number;
  type: 'currency' | 'percent';
  bgColor: string;
  textColor: string;
}

/**
 * Interface para as props do componente CardFinance
 */
interface CardFinanceProps {
  cards: FinanceCard[];
  className?: string;
}

/**
 * Componente CardFinance - Exibe métricas financeiras em cards coloridos flexíveis
 *
 * @param cards - Array de cards financeiros para exibir
 * @param className - Classes CSS adicionais para o container
 */
export default function CardFinance({ cards, className = '' }: CardFinanceProps) {
  const formatValue = (value: number, type: 'currency' | 'percent') => {
    return type === 'currency' ? formatCurrency(value) : formatPercent(value);
  };

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {cards.map((card, index) => (
        <div key={index} className={`rounded p-4 ${card.bgColor}`}>
          <span className={`block font-semibold ${card.textColor}`}>{card.title}</span>
          <span className={`text-xl font-bold ${card.textColor}`}>
            {formatValue(card.value, card.type)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Hook para criar cards financeiros padrão baseados no FinanceSummary
 */
export function useFinanceCards(summary: FinanceSummary): FinanceCard[] {
  return [
    {
      title: 'Faturamento Bruto',
      value: summary.totalRevenue,
      type: 'currency',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      title: 'Custo com Ingredientes',
      value: summary.totalVariableCost ?? 0,
      type: 'currency',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
    {
      title: 'Custo Fixo Total',
      value: summary.totalFixedCost ?? 0,
      type: 'currency',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    {
      title: 'Lucro Bruto',
      value: summary.grossProfit,
      type: 'currency',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      title: 'Lucro Líquido',
      value: summary.netProfit,
      type: 'currency',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    {
      title: 'Margem de Lucro',
      value: summary.margin,
      type: 'percent',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-800',
    },
    {
      title: 'Valor a Guardar',
      value: summary.valueToSave ?? 0,
      type: 'currency',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
    },
  ];
}
