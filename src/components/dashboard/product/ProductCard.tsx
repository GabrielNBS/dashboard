// ============================================================
// 🔹 Refactored ProductCard - Using GenericCard Component
// ============================================================
// This component has been refactored to use the new GenericCard
// component, eliminating duplicate card layout code

import React from 'react';
import { ProductState } from '@/types/products';
import { calculateRealProfitMarginFromProduction } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { List, PieChart, Scale, Tag, AlertTriangle, InfoIcon } from 'lucide-react';

// New unified components - replacing old card implementation
import {
  GenericCard,
  createEditAction,
  createDeleteAction,
  type BadgeConfig,
} from '@/components/ui/GenericCard';
interface ProductCardProps {
  product: ProductState;
  onEdit: (product: ProductState) => void;
  onRemove: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onRemove }) => {
  const { production, ingredients } = product;
  const { totalCost, sellingPrice, mode, yieldQuantity } = production;

  // Calculate profit metrics - memoized calculations
  const realProfitValue = sellingPrice - totalCost;
  const displayProfitMargin = calculateRealProfitMarginFromProduction(production, sellingPrice);

  // Configure badges for the product status
  const badges: BadgeConfig[] = [
    {
      text: product.category,
      variant: 'outline',
      icon: <Tag className="h-3 w-3" />,
    },
    {
      text: mode === 'lote' ? 'Produção em Lote' : 'Unitário',
      variant: 'outline',
      icon: <Scale className="h-3 w-3" />,
    },
  ];

  // Add profit warning badge if needed
  if (displayProfitMargin < 0) {
    badges.push({
      text: 'Prejuízo',
      variant: 'danger',
      icon: <AlertTriangle className="h-3 w-3" />,
    });
  }

  // Configure main metrics to display
  const mainMetrics = [
    {
      label: 'Margem',
      value: (
        <div className={`${displayProfitMargin >= 0 ? 'text-primary' : 'text-on-critical'}`}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xl font-bold">{displayProfitMargin.toFixed(1)}%</span>
            <InfoIcon className="h-4 w-4 cursor-pointer" />
          </div>
          <span className="block text-sm">
            {displayProfitMargin >= 0 ? 'Lucro: ' : 'Prejuízo: '}
            {formatCurrency(Math.abs(realProfitValue))}
          </span>
        </div>
      ),
      className: `${displayProfitMargin >= 0 ? 'bg-muted' : 'bg-bad'}`,
    },
    {
      label: 'Custo',
      value: formatCurrency(totalCost),
    },
    {
      label: 'Venda',
      value: formatCurrency(sellingPrice),
      className: 'text-on-great',
    },
  ];

  // Configure progress bar for cost vs selling price
  const progressConfig = {
    value: sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0,
    label: `Custo: ${formatCurrency(totalCost)}`,
    status: displayProfitMargin >= 0 ? 'bg-on-great' : 'bg-on-bad',
    showPercentage: false,
  };

  // Configure expandable details section for ingredients
  const detailsConfig = {
    title: `Ingredientes (${ingredients.length})`,
    icon: <List className="h-4 w-4" />,
    content: (
      <div className="space-y-2">
        {/* Yield information for batch mode */}
        {mode === 'lote' && yieldQuantity > 0 && (
          <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
            <PieChart className="h-4 w-4" />
            <span>Rendimento: {yieldQuantity} unidades</span>
          </div>
        )}

        {/* Ingredients list */}
        <ul className="space-y-2">
          {ingredients.map(ingredient => (
            <li
              key={ingredient.id}
              className="bg-muted/30 flex justify-between rounded p-3 text-sm"
            >
              <span className="font-medium">- {ingredient.name}</span>
              <span>
                {ingredient.totalQuantity} {ingredient.unit} ×{' '}
                {formatCurrency(ingredient.averageUnitPrice)} ={' '}
                {formatCurrency(ingredient.totalQuantity * ingredient.averageUnitPrice)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  };

  // Configure footer information
  const footerInfo = [
    { label: 'ID', value: product.uid },
    { label: 'Atualizado em', value: new Date().toLocaleDateString() },
  ];

  // Configure action buttons
  const actions = [
    createDeleteAction(item => onRemove(item.uid || ''), 'Remover produto'),
    createEditAction(onEdit, 'Editar produto'),
  ];

  // Render using GenericCard with all configurations
  return (
    <GenericCard
      item={product}
      badges={badges}
      mainMetrics={mainMetrics}
      progress={progressConfig}
      details={detailsConfig}
      footerInfo={footerInfo}
      actions={actions}
      variant="detailed"
    />
  );
};
