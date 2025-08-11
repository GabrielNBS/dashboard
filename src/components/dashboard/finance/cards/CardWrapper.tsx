import { formatCurrency } from '@/utils/formatCurrency';
import { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

export type CardWrapperProps = {
  title: string | ReactNode;
  value: string | number | ReactNode;
  type?: 'currency' | 'number' | 'percentage';
  bgColor?: string;
  textColor?: string;
  icon?: ReactNode;
  layout?: 'vertical' | 'horizontal';
};

export default function CardWrapper({
  title,
  value,
  type = 'number',
  bgColor = 'bg-surface',
  textColor = 'text-primary',
  icon,
  layout = 'vertical',
}: CardWrapperProps) {
  const formatValue = () => {
    if (typeof value !== 'number') return value;

    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value;
    }
  };

  return (
    <div
      className={`rounded-lg p-4 shadow ${bgColor} ${textColor} flex ${
        layout === 'horizontal' ? 'flex-row items-center gap-4' : 'flex-col'
      }`}
    >
      <div>
        <h3 className="flex gap-2 text-sm font-light">
          {icon && <span className="text-3xl">{icon}</span>}
          {title}
        </h3>
        <p className="text-xl font-bold">{formatValue()}</p>
        <p className="flex items-center gap-1 text-sm">
          <div className="items-center gap-2 text-green-500">
            <strong>
              <TrendingUp />
            </strong>
          </div>
          vs mes passado{' '}
        </p>
      </div>
    </div>
  );
}
