import React from 'react';
import { IngredientCardProps } from '@/types/components';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { getStockStatus } from '@/utils/calculations/calcSale';
import { formatQuantity } from '@/utils/helpers/normalizeQuantity';
import { AlertOctagon, AlertTriangle, Edit3, Trash2 } from 'lucide-react';

// New unified components - replacing old card implementation
import { GenericCard, type BadgeConfig } from '@/components/ui/GenericCard';

const IngredientCard = ({ ingredient, onEdit, onDelete }: IngredientCardProps) => {
  // Calculate stock metrics
  const maxQuantity = ingredient.maxQuantity;
  const status = getStockStatus(ingredient.totalQuantity, maxQuantity);
  const stockPercentage = maxQuantity > 0 ? (ingredient.totalQuantity / maxQuantity) * 100 : 0;

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
      label: 'Preço de compra',
      value: formatCurrency(ingredient.averageUnitPrice),
    },
  ];

  // Configure progress bar for stock level
  const progressConfig = {
    value: stockPercentage,
    label: 'Nível do Estoque',
    status,
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
    <GenericCard
      item={ingredient}
      badges={badges}
      mainMetrics={mainMetrics}
      progress={progressConfig}
      actions={actions}
      variant="compact"
    />
  );
};

export default IngredientCard;
