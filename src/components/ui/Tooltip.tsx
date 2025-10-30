import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

interface TooltipProps {
  /** Texto do tooltip */
  content: string;
  /** Posição do tooltip em relação ao ícone */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Largura máxima do tooltip */
  maxWidth?: string;
  /** Classe CSS adicional para o container */
  className?: string;
  /** Classe CSS adicional para o ícone */
  iconClassName?: string;
  /** Classe CSS adicional para o tooltip */
  tooltipClassName?: string;
  /** Ícone personalizado (opcional) */
  icon?: React.ReactNode;
  /** Tamanho do ícone */
  iconSize?: 'sm' | 'md' | 'lg';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  maxWidth = 'w-48',
  className,
  iconClassName,
  tooltipClassName,
  icon,
  iconSize = 'md',
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return '-top-12 right-0';
      case 'bottom':
        return 'top-8 right-0';
      case 'left':
        return 'top-0 -right-52';
      case 'right':
        return 'top-0 left-8';
      default:
        return '-top-12 right-0';
    }
  };

  const getIconSizeClasses = () => {
    switch (iconSize) {
      case 'sm':
        return 'h-3 w-3';
      case 'md':
        return 'h-4 w-4 sm:h-5 sm:w-5';
      case 'lg':
        return 'h-5 w-5 sm:h-6 sm:w-6';
      default:
        return 'h-4 w-4 sm:h-5 sm:w-5';
    }
  };

  const defaultIcon = (
    <Info
      className={cn(
        'text-primary group-hover:text-accent transition-colors duration-200',
        getIconSizeClasses(),
        iconClassName
      )}
    />
  );

  return (
    <div className={cn('group relative cursor-pointer', className)}>
      {icon || defaultIcon}
      <div
        className={cn(
          'bg-popover text-popover-foreground absolute z-10 hidden rounded-lg px-3 py-2 text-xs shadow-lg group-hover:block',
          maxWidth,
          getPositionClasses(),
          tooltipClassName
        )}
      >
        {content}
      </div>
    </div>
  );
};
