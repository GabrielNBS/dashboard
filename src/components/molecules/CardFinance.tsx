import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/utils/icons/formatCurrency';

const cardFinanceVariants = [
  {
    title: 'Saldo',
    value: 1200,
    icon: <ArrowDownRight />,
    color: 'bg-primary text-base',
  },
  {
    title: 'Saldo',
    value: 1000,
    icon: <ArrowUpRight />,
    color: 'bg-primary text-base',
  },
  {
    title: 'Saldo',
    value: 3000,
    icon: <Wallet />,
    color: 'bg-primary text-base',
  },
];

function CardFinance() {
  return (
    <div className="text-subtitle grid grid-cols-3 gap-4">
      {cardFinanceVariants.map((item, index) => (
        <div
          className={clsx('centralize-column gap-2 rounded-lg px-8 py-4', item.color)}
          key={index}
        >
          <h2 className="text-hero-subtitle flex items-center gap-2 font-bold">
            {item.title}
            {item.icon}
          </h2>
          <span>{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default CardFinance;
