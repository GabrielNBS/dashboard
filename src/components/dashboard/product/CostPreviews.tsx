import { formatCurrency } from '@/utils/formatting/formatCurrency';

interface CostPreviewsProps {
  unitCost: number;
  suggestedPrice: number;
  realProfitMargin: number;
  mode: 'individual' | 'lote';
}

interface CardData {
  label: string;
  value: string;
  description: string;
  borderColor: string;
  background: string;
}

export default function CostPreviews({
  unitCost,
  suggestedPrice,
  realProfitMargin,
  mode,
}: CostPreviewsProps) {
  const isProfit = realProfitMargin >= 0;

  const cards: CardData[] = [
    {
      label: mode === 'individual' ? 'Custo Total' : 'Custo por Unidade',
      value: formatCurrency(unitCost),
      description: 'Soma dos ingredientes',
      borderColor: 'border-primary',
      background: 'bg-card',
    },
    {
      label: mode === 'individual' ? 'Preço Sugerido' : 'Preço por Unidade',
      value: formatCurrency(suggestedPrice),
      description: 'Baseado na margem',
      borderColor: 'border-primary',
      background: 'bg-card',
    },
    {
      label: 'Margem Real',
      value: `${realProfitMargin.toFixed(1)}%`,
      description: isProfit ? 'Lucro positivo' : 'Prejuízo',
      borderColor: isProfit ? 'border-green-500' : 'border-destructive',
      background: isProfit ? 'bg-green-500/10' : 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-lg border-t-4 ${card.borderColor} ${card.background} p-4 shadow-sm transition-shadow hover:shadow-md`}
        >
          <span className="text-muted-foreground text-sm font-medium">{card.label}</span>
          <div className="text-foreground mt-2 text-2xl font-bold">{card.value}</div>
          <p className="text-muted-foreground mt-1 text-xs">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
