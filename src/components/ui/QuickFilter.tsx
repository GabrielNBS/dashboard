'use client';

import { useState } from 'react';

import { Filter } from 'lucide-react';
import CardWrapper from '../dashboard/finance/cards/CardWrapper';

type FilterOption = {
  id: string;
  label: string;
  color?: string;
};

const FILTERS: FilterOption[] = [
  { id: 'today', label: 'Hoje', color: 'bg-blue-100' },
  { id: 'week', label: 'Semana', color: 'bg-green-100' },
  { id: 'month', label: 'Mês', color: 'bg-yellow-100' },
  { id: 'year', label: 'Ano', color: 'bg-purple-100' },
];

export default function QuickFilters() {
  const [activeFilter, setActiveFilter] = useState<string>('today');

  return (
    <div className="flex flex-wrap gap-4">
      {FILTERS.map(filter => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className="w-full sm:w-auto"
        >
          <CardWrapper
            title={filter.label}
            value={activeFilter === filter.id ? 'Ativo' : ''}
            bgColor={activeFilter === filter.id ? `${filter.color} border-primary` : 'bg-surface'}
            textColor={activeFilter === filter.id ? 'text-primary' : 'text-muted-foreground'}
            layout="vertical"
            icon={<Filter />}
            subtitle={activeFilter === filter.id ? 'Filtrando...' : undefined}
          />
        </button>
      ))}
    </div>
  );
}
