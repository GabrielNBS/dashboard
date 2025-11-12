import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { ReactNode, memo, useMemo } from 'react';
import { TrendingData } from '@/hooks/business/useTrendingMetrics';
import LordIcon from '@/components/ui/LordIconDynamic';

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
  trendingColors?: {
    positive?: {
      text?: string;
      icon?: string;
      period?: string;
    };
    negative?: {
      text?: string;
      icon?: string;
      period?: string;
    };
  };
};

const CardWrapper = memo(function CardWrapper({
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
  trendingColors = {
    positive: {
      text: 'text-on-great',
      icon: '#0a5c2e',
      period: 'text-muted-foreground',
    },
    negative: {
      text: 'text-on-bad',
      icon: '#730a0a',
      period: 'text-muted-foreground',
    },
  },
}: CardWrapperProps) {
  const formattedValue = useMemo(() => {
    if (type === 'custom' || typeof value !== 'number') return value;

    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value;
    }
  }, [type, value]);

  // Helper para converter classe Tailwind em cor hex
  const getIconColor = useMemo(() => {
    return (colorValue: string | undefined, defaultColor: string): string => {
      if (!colorValue) return defaultColor;
      
      // Se já é hex, retorna direto
      if (colorValue.startsWith('#')) return colorValue;
      
      // Mapeamento de classes Tailwind comuns para hex
      const colorMap: Record<string, string> = {
        'bg-bad': '#730a0a',
        'bg-great': '#0a5c2e',
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#ffffff',
        'bg-accent': '#3b82f6',
        'text-bad': '#730a0a',
        'text-great': '#0a5c2e',
        'text-primary': '#1a1a1a',
        'text-secondary': '#ffffff',
        'text-accent': '#3b82f6',
        'text-on-bad': '#730a0a',
        'text-on-great': '#0a5c2e',
      };
      
      return colorMap[colorValue] || defaultColor;
    };
  }, []);

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
          <div className="mt-1" role="text" aria-label={`Valor: ${formattedValue}`}>
            {formattedValue}
          </div>
        ) : (
          <p
            className="mt-1 text-lg font-bold sm:text-xl"
            role="text"
            aria-label={`Valor: ${formattedValue}`}
          >
            {formattedValue}
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
              <div className={`items-center gap-2 ${trendingColors.positive?.text || 'text-on-great'}`}>
                <strong className="flex items-center gap-1">
                  <LordIcon
                    src="https://cdn.lordicon.com/erxuunyq.json"
                    width={16}
                    height={16}
                    isActive={true}
                    colors={{
                      primary: getIconColor(trendingColors.positive?.icon, '#0a5c2e'),
                      secondary: getIconColor(trendingColors.positive?.icon, '#0a5c2e'),
                    }}
                  />
                  <span aria-label="Tendência positiva de 15%">15%</span>
                </strong>
              </div>
            ) : (
              <div
                className={`items-center gap-2 ${trending.isPositive ? trendingColors.positive?.text || 'text-on-great' : trendingColors.negative?.text || 'text-on-bad'}`}
              >
                <strong className="flex items-center gap-1">
                  {trending.isPositive ? (
                    <LordIcon
                      src="https://cdn.lordicon.com/erxuunyq.json"
                      width={16}
                      height={16}
                      isActive={true}
                      colors={{
                        primary: getIconColor(trendingColors.positive?.icon, '#0a5c2e'),
                        secondary: getIconColor(trendingColors.positive?.icon, '#0a5c2e'),
                      }}
                    />
                  ) : (
                    <LordIcon
                      src="https://cdn.lordicon.com/rxkwccmc.json"
                      width={16}
                      height={16}
                      isActive={true}
                      colors={{
                        primary: getIconColor(trendingColors.negative?.icon, '#730a0a'),
                        secondary: getIconColor(trendingColors.negative?.icon, '#730a0a'),
                      }}
                    />
                  )}
                  <span
                    aria-label={`Tendência ${trending.isPositive ? 'positiva' : 'negativa'} de ${trending.percentage.toFixed(1)}%`}
                  >
                    {trending.percentage.toFixed(1)}%
                  </span>
                </strong>
                <span className={`ml-1 text-xs ${trending.isPositive ? trendingColors.positive?.period || 'text-muted-foreground' : trendingColors.negative?.period || 'text-muted-foreground'}`}>
                  {trending.period}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
});

CardWrapper.displayName = 'CardWrapper';

export default CardWrapper;
