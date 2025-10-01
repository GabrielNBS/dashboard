import React from 'react';
import { motion } from 'framer-motion';
import { Flag, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { Tooltip } from '@/components/ui';

/**
 * Utils
 */
const getProgressColorClasses = (percentage: number) => {
  if (percentage >= 100) return { bg: 'bg-teal-500', text: 'text-teal-600' };
  if (percentage >= 75) return { bg: 'bg-green-500', text: 'text-green-600' };
  if (percentage >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-600' };
  return { bg: 'bg-red-500', text: 'text-red-600' };
};

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const { bg: progressColor } = getProgressColorClasses(value);

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
      <motion.div
        className={cn('h-full rounded-full', progressColor)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
};

interface GoalCardProps {
  title?: string;
  goalValue: number;
  currentValue: number;
  unit?: string;
  tooltipText?: string;
  successMessage?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title = 'Objetivo de faturamento mensal',
  goalValue,
  currentValue,
  tooltipText = 'Este mostra o progresso do faturamento.',
  successMessage = 'Meta alcançada 🎉',
}) => {
  const percentage = goalValue > 0 ? (currentValue / goalValue) * 100 : 0;
  const barPercentage = Math.min(percentage, 100);
  const remaining = Math.max(goalValue - currentValue, 0);
  const { text: textColor } = getProgressColorClasses(percentage);

  return (
    <motion.div
      className="bg-primary w-full rounded-xl p-4 shadow-md sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-lg p-2">
            <Flag className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <h2 className="text-secondary text-sm font-semibold sm:text-base">{title}</h2>
        </div>
        {tooltipText && <Tooltip content={tooltipText} />}
      </div>

      {/* Valores Mobile */}
      <div className="mb-3 sm:hidden">
        <div className="flex items-baseline gap-2">
          <span className="text-secondary text-lg font-bold">{formatCurrency(currentValue)}</span>
          <span className="text-muted-foreground text-xs">de {formatCurrency(goalValue)}</span>
        </div>
      </div>

      {/* Valores Desktop */}
      <div className="mb-4 hidden sm:block">
        <p className="text-secondary text-2xl font-bold sm:text-3xl lg:text-4xl">
          {formatCurrency(currentValue)} /{' '}
          <span className="text-muted-foreground/60">{formatCurrency(goalValue)}</span>
        </p>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <ProgressBar value={barPercentage} />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
          <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
          {remaining > 0 ? `Faltam ${formatCurrency(remaining)}` : successMessage}
        </span>
        <span
          className={cn('flex items-center gap-1.5 text-xs font-semibold sm:text-sm', textColor)}
        >
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
          {percentage.toFixed(0)}%
        </span>
      </div>
    </motion.div>
  );
};
