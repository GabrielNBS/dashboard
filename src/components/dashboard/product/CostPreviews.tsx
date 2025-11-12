import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { tv } from 'tailwind-variants';

interface CostPreviewsProps {
  unitCost: number;
  suggestedPrice: number;
  realProfitMargin: number;
  mode: 'individual' | 'lote';
}

// Cria estilos com tailwind-variants
const card = tv({
  slots: {
    base: 'rounded-lg border-t-4 bg-card p-4 shadow-md',
    label: 'text-sm font-medium text-muted-foreground',
    value: 'text-2xl text-primary font-bold',
    description: 'mt-1 text-xs text-muted-foreground',
  },
  variants: {
    type: {
      cost: {
        base: 'border-on-bad',
      },
      price: {
        base: 'border-on-info',
      },
      profit: {
        base: 'border-on-great',
      },
      loss: {
        base: 'border-on-bad',
      },
    },
  },
});

interface InfoCardProps {
  label: string;
  value: string;
  description: string;
  type: 'cost' | 'price' | 'profit' | 'loss';
}

const InfoCard = ({ label, value, description, type }: InfoCardProps) => {
  const styles = card({ type });
  return (
    <div className={styles.base()}>
      <div className="mb-2 flex items-center justify-between">
        <span className={styles.label()}>{label}</span>
      </div>
      <div className={styles.value()}>{value}</div>
      <p className={styles.description()}>{description}</p>
    </div>
  );
};

export default function CostPreviews({
  unitCost,
  suggestedPrice,
  realProfitMargin,
  mode,
}: CostPreviewsProps) {
  const isProfit = realProfitMargin >= 0;

  const cards: InfoCardProps[] = [
    {
      label: mode === 'individual' ? 'Custo Total' : 'Custo por Unidade',
      value: formatCurrency(unitCost),
      description: 'Soma dos ingredientes',
      type: 'cost',
    },
    {
      label: mode === 'individual' ? 'Preço Sugerido' : 'Preço por Unidade',
      value: formatCurrency(suggestedPrice),
      description: 'Baseado na margem',
      type: 'price',
    },
    {
      label: 'Margem Real',
      value: `${realProfitMargin.toFixed(1)}%`,
      description: isProfit ? 'Lucro positivo' : 'Prejuízo',
      type: isProfit ? 'profit' : 'loss',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <InfoCard key={i} {...card} />
      ))}
    </div>
  );
}
