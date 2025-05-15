import CardBase from '@/components/atoms/Card';
import React from 'react';

export default function CardFinance({
  title = 'Título do cartão',
  value,
  variant = 'default',
  icon,
}: {
  title?: string;
  value?: string | number;
  variant?: 'default' | 'primary' | 'secondary';
  icon?: React.ReactNode;
}) {
  return (
    <CardBase variants={variant}>
      <h2 className="text-title flex items-center justify-center gap-2 font-bold">
        {title}
        {icon}
      </h2>
      <span className="text-subtitle mt-8 font-medium">{value}</span>
    </CardBase>
  );
}
