import React from 'react';
import { tv } from 'tailwind-variants';
import { ButtonProps } from '@/types/buttonProps';

export const button = tv({
  base: 'inline-flex cursor-pointer items-center justify-center rounded-md text-paragraph font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      default: 'bg-accent  hover:bg-accent/80',
      accept: 'bg-green-600  hover:bg-green-700',
      edit: 'bg-yellow-600  hover:bg-yellow-700',
      destructive: 'bg-red-600  hover:bg-red-700',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    },
    size: {
      sm: 'px-3 py-1 text-paragraph',
      md: 'px-4 py-2 text-subtitle',
      lg: 'px-6 py-3 text-title',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});

export default function Button({ children, variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
