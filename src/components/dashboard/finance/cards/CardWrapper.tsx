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
  trending?: boolean;
  subtitle?: string | ReactNode;
};

export default function CardWrapper({
  title,
  value,
  type = 'number',
  bgColor = 'bg-surface',
  textColor = 'text-primary',
  icon,
  layout = 'vertical',
  trending = false,
  subtitle,
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
      className={`w-[14rem] rounded-lg p-4 shadow-md transition hover:translate-y-[-4px] ${bgColor} ${textColor} flex ${
        layout === 'horizontal' ? 'flex-row items-center gap-4' : 'flex-col'
      }`}
    >
      <div>
        <h3 className="flex justify-between gap-2 text-sm font-light">
          {title}
          {icon && <span className="text-3xl">{icon}</span>}
        </h3>
        <p className="text-xl font-bold">{formatValue()}</p>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        {trending && (
          <div className="flex items-center gap-1 text-sm">
            <div className="items-center gap-2 text-green-500">
              <strong className="flex items-center gap-1">
                <TrendingUp />
                15%
              </strong>
            </div>
            <p>{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
