import { StatusFilter } from '@/types/components';
import CardWrapper from '../dashboard/finance/cards/CardWrapper';
import StatusPulse from './StatusPulse';

function QuickFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  // Definição dos filtros rápidos
  const FILTERS = [
    { id: 'all', label: 'Todos', color: 'bg-gray-100' },
    { id: 'critico', label: 'Crítico', color: 'bg-red-100' },
    { id: 'atencao', label: 'Atenção', color: 'bg-yellow-100' },
    { id: 'normal', label: 'Normal', color: 'bg-green-100' },
  ] as const;

  const statusColors: Record<StatusFilter, string> = {
    critico: 'bg-on-bad',
    atencao: 'bg-on-warning',
    normal: 'bg-on-great',
    all: 'bg-foreground',
  };

  const backgroundStatusColors: Record<StatusFilter, string> = {
    critico: 'bg-bad',
    atencao: 'bg-warning',
    normal: 'bg-great',
    all: 'bg-surface',
  };

  return (
    <div className="flex flex-wrap gap-3">
      {FILTERS.map(filter => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id as StatusFilter)}
          className="relative w-full sm:w-auto"
        >
          {/* Badge pulse no canto superior direito */}
          <div className="absolute top-2 right-2">
            <StatusPulse color={statusColors[filter.id as StatusFilter]} />
          </div>

          <CardWrapper
            title={filter.label}
            value=""
            bgColor={backgroundStatusColors[filter.id as StatusFilter]}
            textColor={activeFilter === filter.id ? 'text-primary' : 'text-muteds'}
            layout="vertical"
          />
        </button>
      ))}
    </div>
  );
}

export default QuickFilters;
