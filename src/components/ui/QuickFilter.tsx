import { StatusFilter } from '@/types/components';
import { motion } from 'framer-motion';
import { useCallback, useRef } from 'react';
import LordIcon from './LordIcon';

// Simplified filter configuration using CSS variables from the design system
const FILTERS = [
  {
    id: 'all',
    label: 'Todos',
    description: 'Mostrar todos os itens',
    lordIconSrc: 'https://cdn.lordicon.com/vayiyuqd.json', // filter icon
    color: 'var(--color-muted-foreground)',
    bgColor: 'var(--color-muted)',
    activeColor: 'var(--color-primary)',
    activeTextColor: 'var(--color-primary-foreground)',
  },
  {
    id: 'critico',
    label: 'Crítico',
    description: 'Estoque muito baixo - ação imediata',
    lordIconSrc: 'https://cdn.lordicon.com/keaiyjcx.json', // alert circle icon
    color: 'var(--color-muted-foreground)',
    bgColor: 'var(--color-muted)',
    activeColor: 'var(--color-primary)',
    activeTextColor: 'var(--color-primary-foreground)',
  },
  {
    id: 'atencao',
    label: 'Atenção',
    description: 'Estoque baixo - reposição necessária',
    lordIconSrc: 'https://cdn.lordicon.com/aszgxiei.json', // warning triangle icon
    color: 'var(--color-muted-foreground)',
    bgColor: 'var(--color-muted)',
    activeColor: 'var(--color-primary)',
    activeTextColor: 'var(--color-primary-foreground)',
  },
  {
    id: 'normal',
    label: 'Normal',
    description: 'Estoque adequado - sem problemas',
    lordIconSrc: 'https://cdn.lordicon.com/zdfcfvwu.json', // check circle icon
    color: 'var(--color-muted-foreground)',
    bgColor: 'var(--color-muted)',
    activeColor: 'var(--color-primary)', // A darker version for active state
    activeTextColor: 'var(--color-primary-foreground)',
  },
] as const;
function QuickFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: StatusFilter | string;
  onChange: (v: StatusFilter) => void;
}) {
  const isChangingRef = useRef(false);

  const handleFilterChange = useCallback(
    (filterId: StatusFilter) => {
      if (isChangingRef.current || activeFilter === filterId) return;
      isChangingRef.current = true;
      onChange(filterId);
      setTimeout(() => {
        isChangingRef.current = false;
      }, 100);
    },
    [activeFilter, onChange]
  );

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {FILTERS.map(filter => {
        const isActive = activeFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id as StatusFilter)}
            title={filter.description} // Use native title for tooltip
            style={{
              backgroundColor: isActive ? filter.activeColor : filter.bgColor,
              color: isActive ? filter.activeTextColor : filter.color,
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${isActive ? filter.activeColor : 'transparent'}`,
            }}
            className="group relative flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium shadow-md transition-colors duration-200 ease-in-out hover:brightness-105 sm:min-w-0 sm:flex-none sm:gap-2 sm:px-4"
          >
            <div className="relative z-10 flex-shrink-0">
              <LordIcon src={filter.lordIconSrc} width={18} height={18} isActive={isActive} />
            </div>

            <span className="relative z-10 truncate text-xs sm:text-sm">{filter.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default QuickFilters;
