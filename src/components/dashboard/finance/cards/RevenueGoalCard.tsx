import React from 'react';
import { motion } from 'framer-motion';
import { Info, Flag, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';
import { formatCurrency } from '@/utils/formatting/formatCurrency';

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
  title = 'Monthly Revenue Goal',
  goalValue,
  currentValue,
  tooltipText = 'This shows your revenue progress.',
  successMessage = 'Meta alcançada 🎉',
}) => {
  const percentage = goalValue > 0 ? (currentValue / goalValue) * 100 : 0;
  const barPercentage = Math.min(percentage, 100);
  const remaining = Math.max(goalValue - currentValue, 0);
  const { text: textColor } = getProgressColorClasses(percentage);

  return (
    <motion.div
      className="w-full max-w-md rounded-md p-4 shadow-md sm:max-w-lg sm:p-6 lg:max-w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--color-primary)] sm:text-lg dark:text-[var(--color-primary-dark)]">
          {title}
        </h2>
        {tooltipText && (
          <div className="group relative cursor-pointer">
            <Info className="h-4 w-4 text-neutral-500 transition-colors duration-200 group-hover:text-[var(--color-accent)] sm:h-5 sm:w-5 dark:text-neutral-400" />
            <div className="absolute -top-12 right-0 z-10 hidden w-48 rounded-lg bg-black/90 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
              {tooltipText}
            </div>
          </div>
        )}
      </div>

      {/* Valores */}
      <p className="mb-4 text-2xl font-bold break-words text-[var(--color-accent)] sm:text-3xl lg:text-4xl">
        {formatCurrency(currentValue)} /{' '}
        <span className="text-muted-foreground/60">{formatCurrency(goalValue)}</span>
      </p>

      {/* Progress */}
      <ProgressBar value={barPercentage} />

      {/* Status */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
          <Flag className="h-4 w-4" />
          {remaining > 0 ? `Faltam ${formatCurrency(remaining)}` : successMessage}
        </span>
        <span className={cn('flex items-center gap-1.5 text-sm font-semibold', textColor)}>
          <TrendingUp className="h-4 w-4" />
          {percentage.toFixed(0)}%
        </span>
      </div>
    </motion.div>
  );
};
