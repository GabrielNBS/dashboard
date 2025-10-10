'use client';

import React from 'react';
import { Flag, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting/formatCurrency';

interface GoalCardWrapperProps {
  title: string;
  goalValue: number;
  currentValue: number;
  tooltipText?: string;
  className?: string;
  textColor?: string;
}

export default function GoalCardWrapper({
  title,
  goalValue,
  currentValue,
  className = '',
  textColor = 'text-primary',
}: GoalCardWrapperProps) {
  const percentage = goalValue > 0 ? (currentValue / goalValue) * 100 : 0;
  const barPercentage = Math.min(percentage, 100);
  const remaining = Math.max(goalValue - currentValue, 0);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-teal-500';
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 100) return 'text-muted';
    if (percentage >= 75) return 'text-on-great';
    if (percentage >= 40) return 'text-on-warning';
    return 'text-on-bad';
  };

  return (
    <div
      className={`flex ${textColor} w-full cursor-pointer flex-col rounded-lg border border-t-4 border-transparent p-3 shadow-md transition-all duration-300 ease-in-out sm:p-4 ${className}`}
    >
      <div className="w-full">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className={`flex ${textColor} items-center gap-2 text-xs font-light sm:text-sm`}>
            <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
            {title}
          </h3>
          <span
            className={`flex items-center gap-1 text-xs font-semibold sm:text-sm ${getTextColor(percentage)}`}
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            {percentage.toFixed(0)}%
          </span>
        </div>

        {/* Valores */}
        <div className="mb-3">
          <p className={`text-lg font-bold ${textColor} sm:text-xl`}>
            {formatCurrency(currentValue)} / {formatCurrency(goalValue)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(percentage)}`}
              style={{ width: `${barPercentage}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <p className="text-muted-foreground text-xs sm:text-sm">
          {remaining > 0 ? `Faltam ${formatCurrency(remaining)}` : 'Meta alcançada 🎉'}
        </p>
      </div>
    </div>
  );
}
