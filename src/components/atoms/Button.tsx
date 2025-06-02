import React from 'react';
import { tv } from 'tailwind-variants';
import { ButtonProps } from '@/types/buttonProps';

export const button = tv({
  base: 'inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      default: 'bg-accent text-white hover:bg-accent/80',
      accept: 'bg-green-600 text-white hover:bg-green-700',
      edit: 'bg-yellow-600 text-white hover:bg-yellow-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    },
    size: {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export default function Button({ children, variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
