// components/RevenueGoalCard.tsx
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import React from 'react';
import { cn } from '@/utils/helpers/cn';

interface RevenueGoalCardProps {
  goalAmount: number;
  currentAmount: number;
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 75) return 'bg-emerald-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const RevenueGoalCard: React.FC<RevenueGoalCardProps> = ({ goalAmount, currentAmount }) => {
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  const remaining = Math.max(goalAmount - currentAmount, 0);
  const progressColor = getProgressColor(percentage);

  return (
    <motion.div
      className="neu-card w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
          Monthly Revenue Goal
        </h2>
        <div className="group relative cursor-pointer">
          <Info className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <div className="absolute -top-10 right-0 z-10 hidden w-48 rounded bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:block">
            This shows your monthly revenue progress.
          </div>
        </div>
      </div>

      <p className="mb-2 text-3xl font-bold text-[var(--color-accent)]">
        ${currentAmount.toLocaleString()} / ${goalAmount.toLocaleString()}
      </p>

      <ProgressBar value={percentage} />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {remaining > 0 ? `You need $${remaining.toLocaleString()} more` : 'Goal reached 🎉'}
        </span>
        <span
          className={cn(
            'text-sm font-semibold',
            percentage >= 75
              ? 'text-emerald-500'
              : percentage >= 50
                ? 'text-yellow-500'
                : 'text-red-500'
          )}
        >
          {Math.floor(percentage)}%
        </span>
      </div>
    </motion.div>
  );
};

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progressColor = getProgressColor(value);

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
      <motion.div
        className={cn('h-full rounded-full', progressColor)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
};
