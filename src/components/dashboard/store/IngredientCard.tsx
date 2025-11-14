import React from 'react';
import { IngredientCardProps } from '@/types/components';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { getStockStatus } from '@/utils/calculations/calcSale';
import { formatQuantity } from '@/utils/helpers/normalizeQuantity';
import { AlertOctagon, AlertTriangle, Edit3, Trash2 } from 'lucide-react';

// New unified components - replacing old card implementation
import { GenericCard, type BadgeConfig } from '@/components/ui/GenericCard';

const IngredientCard = ({ ingredient, onEdit, onDelete }: IngredientCardProps) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [autoShowTooltip, setAutoShowTooltip] = React.useState(false);
  const [isTooltipMounted, setIsTooltipMounted] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  // Calculate stock metrics
  const maxQuantity = ingredient.maxQuantity;
  const status = getStockStatus(ingredient.totalQuantity, maxQuantity);
  const stockPercentage = maxQuantity > 0 ? (ingredient.totalQuantity / maxQuantity) * 100 : 0;

  // Verifica se o ingrediente está em estado crítico (ativou o alerta)
  const isCriticalAlert = status === 'critico' || (status === 'atencao' && stockPercentage <= 20);

  // Mostra o tooltip automaticamente por 3 segundos ao montar o componente (se for crítico)
  React.useEffect(() => {
    if (isCriticalAlert) {
      setAutoShowTooltip(true);
      const timer = setTimeout(() => {
        setAutoShowTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCriticalAlert]);

  // Gerencia a montagem e desmontagem do tooltip com animação
  const shouldShowTooltip = showTooltip || autoShowTooltip;

  React.useEffect(() => {
    if (shouldShowTooltip) {
      setIsTooltipMounted(true);
      setIsExiting(false);
    } else if (isTooltipMounted) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsTooltipMounted(false);
        setIsExiting(false);
      }, 200); // Duração da animação de saída
      return () => clearTimeout(timer);
    }
  }, [shouldShowTooltip, isTooltipMounted]);

  // Determina a mensagem do tooltip baseada no status
  const getTooltipMessage = () => {
    if (ingredient.totalQuantity === 0) {
      return `Estoque zerado! ${ingredient.name} precisa de reposição urgente.`;
    }
    if (status === 'critico') {
      return `Estoque crítico! ${ingredient.name} está com apenas ${stockPercentage.toFixed(0)}% do estoque máximo.`;
    }
    if (status === 'atencao' && stockPercentage <= 20) {
      return `Atenção! ${ingredient.name} está com ${stockPercentage.toFixed(0)}% do estoque máximo.`;
    }
    return '';
  };

  // Status configuration for display - centralized status logic
  const statusConfig = {
    critico: {
      text: 'Crítico',
      icon: <AlertOctagon className="h-3 w-3" />,
      variant: 'danger' as const,
    },
    atencao: {
      text: 'Atenção',
      icon: <AlertTriangle className="h-3 w-3" />,
      variant: 'warning' as const,
    },
    normal: {
      text: 'Normal',
      icon: null,
      variant: 'normal' as const,
    },
  };

  const { text, icon, variant } = statusConfig[status];

  // Configure badges for unit and status
  const badges: BadgeConfig[] = [
    {
      text: ingredient.unit,
      variant: 'default',
    },
    {
      text,
      variant,
      icon,
    },
  ];

  // Configure main metrics to display
  const mainMetrics = [
    {
      label: 'Quantidade',
      value: formatQuantity(ingredient.totalQuantity, ingredient.unit),
    },
    {
      label: ingredient.unit === 'un' ? 'Preço por unidade' : 'Preço por grama/litro',
      value: formatCurrency(ingredient.averageUnitPrice),
    },
  ];

  // Configure progress bar for stock level
  const progressConfig = {
    value: stockPercentage,
    label: 'Nível do Estoque',
    status: status as 'normal' | 'critico' | 'atencao',
    showPercentage: true,
  };

  // Configure action buttons with custom icons
  const actions = [
    {
      icon: <Edit3 className="h-4 w-4" />,
      label: 'Editar',
      onClick: () => onEdit(ingredient),
      variant: 'ghost' as const,
      tooltip: 'Editar ingrediente',
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      label: 'Excluir',
      onClick: () => onDelete(ingredient.id),
      variant: 'ghost' as const,
      tooltip: 'Excluir ingrediente',
    },
  ];

  return (
    <div className="relative">
      {/* Indicador de alerta pulsante */}
      {isCriticalAlert && (
        <div
          className="group/alert absolute top-2 right-2 z-10 cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="relative flex h-6 w-6 items-center justify-center transition-transform duration-200 ease-out group-hover/alert:scale-110">
            {/* Pulso animado */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            {/* Círculo sólido */}
            <span className="ring-background relative inline-flex h-4 w-4 rounded-full bg-red-600 ring-2 transition-all duration-200 group-hover/alert:ring-4">
              <span className="absolute inset-0 flex items-center justify-center">
                <AlertOctagon className="h-2.5 w-2.5 text-white transition-transform duration-200 group-hover/alert:rotate-12" />
              </span>
            </span>
          </div>

          {/* Tooltip */}
          {isTooltipMounted && (
            <div
              className={`absolute top-full right-0 mt-2 w-64 transition-all duration-200 ease-out ${
                isExiting
                  ? '-translate-y-1 scale-95 opacity-0'
                  : 'translate-y-0 scale-100 opacity-100'
              }`}
            >
              <div className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-start gap-2">
                  <AlertOctagon className="mt-0.5 h-4 w-4 flex-shrink-0 animate-pulse" />
                  <p className="leading-snug">{getTooltipMessage()}</p>
                </div>
                {/* Seta do tooltip */}
                <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-red-600" />
              </div>
            </div>
          )}
        </div>
      )}

      <GenericCard
        item={ingredient}
        badges={badges}
        mainMetrics={mainMetrics}
        progress={progressConfig}
        actions={actions}
        variant="compact"
      />
    </div>
  );
};

export default IngredientCard;
