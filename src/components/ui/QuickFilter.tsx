import { StatusFilter } from '@/types/components';
import { AlertCircle, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useRef } from 'react';

function QuickFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: StatusFilter | string;
  onChange: (v: StatusFilter) => void;
}) {
  // Ref para prevenir múltiplos cliques rápidos
  const isChangingRef = useRef(false);

  // Definição dos filtros rápidos com ícones
  const FILTERS = [
    {
      id: 'all',
      label: 'Todos',
      icon: Filter,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      activeColor: 'bg-primary text-white',
    },
    {
      id: 'critico',
      label: 'Crítico',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
      activeColor: 'bg-red-500 text-white border-red-500',
    },
    {
      id: 'atencao',
      label: 'Atenção',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      activeColor: 'bg-yellow-500 text-white border-yellow-500',
    },
    {
      id: 'normal',
      label: 'Normal',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
      activeColor: 'bg-green-500 text-white border-green-500',
    },
  ] as const;

  // Handler otimizado para prevenir cliques rápidos
  const handleFilterChange = useCallback(
    (filterId: StatusFilter) => {
      if (isChangingRef.current || activeFilter === filterId) return;

      isChangingRef.current = true;
      onChange(filterId);

      // Reset do flag após um pequeno delay
      setTimeout(() => {
        isChangingRef.current = false;
      }, 100);
    },
    [activeFilter, onChange]
  );

  return (
    <div className="flex flex-wrap gap-2 sm:gap-2">
      {FILTERS.map(filter => {
        const isActive = activeFilter === filter.id;
        const Icon = filter.icon;

        return (
          <motion.button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id as StatusFilter)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            // Adiciona layout para prevenir problemas de DOM
            layout
            // Configurações de transição mais suaves
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              layout: { duration: 0.2 },
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 sm:gap-2 sm:px-4 sm:py-2.5 ${
              isActive
                ? filter.activeColor + ' shadow-md'
                : `${filter.bgColor} ${filter.color} border-gray-200 hover:shadow-md`
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden whitespace-nowrap sm:inline">{filter.label}</span>

            {/* Indicador de filtro ativo com AnimatePresence para controle melhor */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  key="active-indicator"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="ml-0.5 h-2 w-2 rounded-full bg-white/90 sm:ml-1"
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

export default QuickFilters;
