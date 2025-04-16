import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

function CardBase({ children }: CardProps) {
  return <div className="flex h-76 w-64 flex-col rounded-sm text-center shadow-lg">{children}</div>;
}

export default CardBase;
