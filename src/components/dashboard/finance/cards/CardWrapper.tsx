import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { ReactNode } from 'react';
import { TrendingData } from '@/hooks/business/useTrendingMetrics';
import LordIcon from '@/components/ui/LordIcon';

export type CardWrapperProps = {
  title: string | ReactNode;
  value: string | number | ReactNode;
  type?: 'currency' | 'number' | 'percentage' | 'custom';
  bgColor?: string;
  textColor?: string;
  icon?: ReactNode;
  layout?: 'vertical' | 'horizontal';
  trending?: boolean | TrendingData;
  subtitle?: string | ReactNode;
  className?: string;
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
  className,
}: CardWrapperProps) {
  const formatValue = () => {
    if (type === 'custom' || typeof value !== 'number') return value;

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
    <article
      className={`w-full rounded-lg p-3 shadow-md transition-all duration-300 ease-in-out sm:p-4 ${className} ${bgColor} ${textColor} hover:${bgColor} flex ${
        layout === 'horizontal' ? 'flex-row items-center gap-3 sm:gap-4' : 'flex-col'
      }`}
      role="region"
      aria-labelledby={`card-title-${title}`}
    >
      <div className="w-full">
        <h3
          id={`card-title-${title}`}
          className="flex justify-between gap-2 text-xs font-semibold sm:text-sm"
        >
          {title}
          {icon && (
            <span className="text-2xl sm:text-3xl" aria-hidden="true">
              {icon}
            </span>
          )}
        </h3>
        {type === 'custom' ? (
          <div className="mt-1" role="text" aria-label={`Valor: ${formatValue()}`}>
            {formatValue()}
          </div>
        ) : (
          <p
            className="mt-1 text-lg font-bold sm:text-xl"
            role="text"
            aria-label={`Valor: ${formatValue()}`}
          >
            {formatValue()}
          </p>
        )}
        {subtitle && <p className="text-muted-foreground text-xs sm:text-sm">{subtitle}</p>}
        {trending && (
          <div
            className="flex items-center gap-1 text-xs sm:text-sm"
            role="status"
            aria-live="polite"
          >
            {typeof trending === 'boolean' ? (
              <div className="text-on-great items-center gap-2">
                <strong className="flex items-center gap-1">
                  <LordIcon
                    src="https://cdn.lordicon.com/erxuunyq.json"
                    width={16}
                    height={16}
                    isActive={true}
                    colors={{
                      primary: '#0a5c2e',
                      secondary: '#0a5c2e',
                    }}
                  />
                  <span aria-label="Tendência positiva de 15%">15%</span>
                </strong>
              </div>
            ) : (
              <div
                className={`items-center gap-2 ${trending.isPositive ? 'text-on-great' : 'text-on-bad'}`}
              >
                <strong className="flex items-center gap-1">
                  {trending.isPositive ? (
                    <LordIcon
                      src="https://cdn.lordicon.com/erxuunyq.json"
                      width={16}
                      height={16}
                      isActive={true}
                      colors={{
                        primary: '#0a5c2e',
                        secondary: '#0a5c2e',
                      }}
                    />
                  ) : (
                    <LordIcon
                      src="https://cdn.lordicon.com/rxkwccmc.json"
                      width={16}
                      height={16}
                      isActive={true}
                      colors={{
                        primary: '#730a0a',
                        secondary: '#730a0a',
                      }}
                    />
                  )}
                  <span
                    aria-label={`Tendência ${trending.isPositive ? 'positiva' : 'negativa'} de ${trending.percentage.toFixed(1)}%`}
                  >
                    {trending.percentage.toFixed(1)}%
                  </span>
                </strong>
                <span className="text-muted-foreground ml-1 text-xs">{trending.period}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
