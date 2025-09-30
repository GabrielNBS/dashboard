import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TrendingData } from '@/hooks/business/useTrendingMetrics';

export type CardWrapperProps = {
  title: string | ReactNode;
  value: string | number | ReactNode;
  type?: 'currency' | 'number' | 'percentage';
  bgColor?: string;
  textColor?: string;
  icon?: ReactNode;
  layout?: 'vertical' | 'horizontal';
  trending?: boolean | TrendingData;
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
      className={`w-full cursor-pointer rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out ${bgColor} ${textColor} hover:border-primary hover:${bgColor} flex border-t-4 ${
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
            {typeof trending === 'boolean' ? (
              // Fallback para compatibilidade com o formato antigo
              <div className="text-on-great items-center gap-2">
                <strong className="flex items-center gap-1">
                  <TrendingUp />
                  15%
                </strong>
              </div>
            ) : (
              // Novo formato com dados dinâmicos
              <div
                className={`items-center gap-2 ${trending.isPositive ? 'text-on-great' : 'text-bad'}`}
              >
                <strong className="flex items-center gap-1">
                  {trending.isPositive ? <TrendingUp /> : <TrendingDown />}
                  {trending.percentage.toFixed(1)}%
                </strong>
                <span className="text-muted-foreground ml-1 text-xs">{trending.period}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
