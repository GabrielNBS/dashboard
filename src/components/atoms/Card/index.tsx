import React, { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = {
  children: ReactNode;
  variants?: 'default' | 'primary' | 'secondary';
};

const cardVariants = {
  default: 'bg-accent text-white',
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-secondary text-white',
};

function CardBase({ children, variants }: CardProps) {
  return (
    <div
      className={clsx(
        'flex h-48 max-w-full flex-col rounded-lg text-center shadow-lg',
        cardVariants[variants || 'default']
      )}
    >
      {children}
    </div>
  );
}

export default CardBase;
