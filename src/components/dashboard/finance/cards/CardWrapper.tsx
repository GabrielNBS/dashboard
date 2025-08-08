import { formatCurrency, formatPercent } from '@/utils/formatCurrency';

interface CardWrapperProps {
  title: string;
  value: number;
  type: 'currency' | 'percent';
  bgColor?: string;
  textColor?: string;
}

export default function CardWrapper({ title, value, type, bgColor, textColor }: CardWrapperProps) {
  const formattedValue = type === 'currency' ? formatCurrency(value) : formatPercent(value);

  return (
    <div className={`rounded p-4 ${bgColor}`}>
      <span className={`block font-semibold ${textColor}`}>{title}</span>
      <span className={`text-xl font-bold ${textColor}`}>{formattedValue}</span>
    </div>
  );
}
