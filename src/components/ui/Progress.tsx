'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/utils/utils';

function Progress({
  className,
  value,
  stats = 'normal',
  ...props
}: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  stats?: 'normal' | 'critico' | 'atencao';
}) {
  // Define cores de fundo e indicador baseadas no status
  const backgroundColors = {
    critico: 'bg-bad',
    atencao: 'bg-warning',
    normal: 'bg-primary/20',
  };

  const indicatorColors = {
    critico: 'bg-on-bad',
    atencao: 'bg-on-warning',
    normal: 'bg-primary',
  };

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full transition-colors duration-300',
        backgroundColors[stats],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'h-full w-full flex-1 transition-all duration-500 ease-out',
          indicatorColors[stats]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
