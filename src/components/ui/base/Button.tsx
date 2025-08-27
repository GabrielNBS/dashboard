import React from 'react';
import { tv } from 'tailwind-variants';
import { ButtonProps } from '@/types/components';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export const button = tv({
  base: 'inline-flex cursor-pointer items-center justify-center rounded-md font-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      default: 'bg-primary hover:bg-primary/98 text-secondary',
      accept: 'bg-great hover:bg-great-hover text-on-great',
      edit: 'bg-warning hover:bg-warning-hover text-on-warning',
      destructive: 'bg-critical hover:bg-critical-hover text-on-critical',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      link: 'bg-transparent underline-offset-4 hover:underline text-blue-600 hover:bg-transparent',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-lg',
      lg: 'px-6 py-3 text-xl',
      xl: 'px-10 py-5 text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});

export default function Button({
  children,
  variant,
  size,
  className,
  disabled,
  tooltip,
  ...props
}: ButtonProps) {
  const buttonEl = (
    <button className={button({ variant, size, className })} disabled={disabled} {...props}>
      {children}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip.tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonEl;
}
