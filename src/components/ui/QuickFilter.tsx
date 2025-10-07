import { StatusFilter } from '@/types/components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import LordIcon from './LordIcon';

// Tooltip informativo para os filtros
const FilterTooltip = ({
  isVisible,
  label,
  description,
}: {
  isVisible: boolean;
  label: string;
  description: string;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
        >
          <div className="font-medium">{label}</div>
          <div className="text-xs text-gray-300">{description}</div>
          {/* Seta do tooltip */}
          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Componente para efeito de ondas no clique
const RippleEffect = ({ isTriggered }: { isTriggered: boolean }) => {
  return (
    <AnimatePresence>
      {isTriggered && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
      )}
    </AnimatePresence>
  );
};

function QuickFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: StatusFilter | string;
  onChange: (v: StatusFilter) => void;
}) {
  // Ref para prevenir múltiplos cliques rápidos
  const isChangingRef = useRef(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [clickedFilter, setClickedFilter] = useState<string | null>(null);

  // Definição dos filtros rápidos com ícones LordIcon
  const FILTERS = [
    {
      id: 'all',
      label: 'Todos',
      description: 'Mostrar todos os ingredientes',
      lordIconSrc: 'https://cdn.lordicon.com/msoeawqm.json', // filter icon
      color: 'text-slate-600',
      bgColor:
        'bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200',
      activeColor:
        'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25',
      borderColor: 'border-slate-200 hover:border-slate-300',
      activeBorderColor: 'border-blue-500',
    },
    {
      id: 'critico',
      label: 'Crítico',
      description: 'Estoque muito baixo - ação imediata',
      lordIconSrc: 'https://cdn.lordicon.com/keaiyjcx.json', // alert circle icon
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200',
      activeColor:
        'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
      borderColor: 'border-red-200 hover:border-red-300',
      activeBorderColor: 'border-red-500',
    },
    {
      id: 'atencao',
      label: 'Atenção',
      description: 'Estoque baixo - reposição necessária',
      lordIconSrc: 'https://cdn.lordicon.com/vduvxizq.json', // warning triangle icon
      color: 'text-amber-600',
      bgColor:
        'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200',
      activeColor:
        'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25',
      borderColor: 'border-amber-200 hover:border-amber-300',
      activeBorderColor: 'border-amber-500',
    },
    {
      id: 'normal',
      label: 'Normal',
      description: 'Estoque adequado - sem problemas',
      lordIconSrc: 'https://cdn.lordicon.com/oqdmuxru.json', // check circle icon
      color: 'text-emerald-600',
      bgColor:
        'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200',
      activeColor:
        'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25',
      borderColor: 'border-emerald-200 hover:border-emerald-300',
      activeBorderColor: 'border-emerald-500',
    },
  ] as const;

  // Handler otimizado para prevenir cliques rápidos
  const handleFilterChange = useCallback(
    (filterId: StatusFilter) => {
      if (isChangingRef.current || activeFilter === filterId) return;

      isChangingRef.current = true;

      // Trigger do efeito de ondas
      setClickedFilter(filterId);
      setTimeout(() => setClickedFilter(null), 600);

      onChange(filterId);

      // Reset do flag após um pequeno delay
      setTimeout(() => {
        isChangingRef.current = false;
      }, 100);
    },
    [activeFilter, onChange]
  );

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {FILTERS.map(filter => {
        const isActive = activeFilter === filter.id;
        const isHovered = hoveredFilter === filter.id;
        const isClicked = clickedFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id as StatusFilter)}
            onMouseEnter={() => setHoveredFilter(filter.id)}
            onMouseLeave={() => setHoveredFilter(null)}
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
              y: 0,
            }}
            layout
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              layout: { duration: 0.2 },
            }}
            className={`group relative flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-300 sm:gap-3 sm:px-5 sm:py-3.5 ${
              isActive
                ? `${filter.activeColor} ${filter.activeBorderColor} transform`
                : `${filter.bgColor} ${filter.color} ${filter.borderColor} hover:shadow-md`
            }`}
          >
            {/* Tooltip informativo */}
            <FilterTooltip
              isVisible={isHovered && !isActive}
              label={filter.label}
              description={filter.description}
            />

            {/* Efeito de ondas no clique */}
            <RippleEffect isTriggered={isClicked} />

            {/* Efeito de brilho no hover */}
            <div
              className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${
                isHovered && !isActive ? 'bg-white opacity-10' : ''
              }`}
            />

            {/* LordIcon com animações */}
            <div className="relative z-10 flex-shrink-0">
              <LordIcon
                src={filter.lordIconSrc}
                width={20}
                height={20}
                isActive={isActive}
                isHovered={isHovered}
                className="transition-transform duration-200"
              />
            </div>

            {/* Label com animação de entrada */}
            <motion.span
              className="relative z-10 hidden whitespace-nowrap sm:inline"
              initial={false}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 0.2 }}
            >
              {filter.label}
            </motion.span>

            {/* Indicador de filtro ativo aprimorado com efeito de pulso */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  key="active-indicator"
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{
                    duration: 0.3,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="relative z-10 ml-1"
                >
                  {/* Indicador principal */}
                  <div className="h-2 w-2 rounded-full bg-white/90 shadow-sm" />

                  {/* Efeito de pulso */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/50"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

export default QuickFilters;
