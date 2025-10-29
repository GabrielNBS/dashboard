'use client';

import React, { useMemo } from 'react';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';

import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { Package, BadgeDollarSign, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog, useToast } from '@/components/ui/feedback';

// UI Components
import CardWrapper from '../finance/cards/CardWrapper';
import QuickFilters from '@/components/ui/QuickFilter';
import { getStockStatus } from '@/utils/calculations/calcSale';
import IngredientCard from './IngredientCard';

// New unified components - replacing old duplicated logic
import { useIngredientFilter } from '@/hooks/ui/useUnifiedFilter';
import {
  GenericListContainer,
  createSearchConfig,
  createFilterStatsConfig,
} from '@/components/ui/GenericListContainer';

// Extensão do tipo Ingredient para incluir status
interface IngredientWithStatus extends Ingredient {
  status: 'critico' | 'atencao' | 'normal';
}

export default function IngredientCardList() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  const ingredientsWithStatus: IngredientWithStatus[] = useMemo(() => {
    return ingredients.map(ingredient => ({
      ...ingredient,
      status: getStockStatus(ingredient.totalQuantity, ingredient.maxQuantity),
    }));
  }, [ingredients]);

  const {
    search,
    statusFilter,
    filteredItems: filteredIngredients,
    setSearch,
    setStatusFilter,
    resetFilters,
    hasActiveFilters,
    totalItems,
    filteredCount,
  } = useIngredientFilter(ingredientsWithStatus, {
    statusFilter: 'all',
  });

  const { toast } = useToast();

  // Calcular resumo
  const summary = useMemo(() => {
    const ingredientsTotalValue = ingredients.reduce(
      (total, item) => total + item.averageUnitPrice * item.totalQuantity,
      0
    );

    return {
      total: ingredients.length,
      critico: ingredientsWithStatus.filter(i => i.status === 'critico').length,
      atencao: ingredientsWithStatus.filter(i => i.status === 'atencao').length,
      ingredientsTotalValue,
    };
  }, [ingredients, ingredientsWithStatus]);

  const handleDelete = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    const ingredientName = ingredient?.name || 'este ingrediente';

    showConfirmation(
      {
        title: 'Excluir Ingrediente',
        description: (
          <span>
            Tem certeza que deseja excluir <strong>&quot;{ingredientName}&quot;</strong>? Esta ação
            não pode ser desfeita.
          </span>
        ),
        variant: 'destructive',
      },
      () => {
        dispatch({ type: 'DELETE_INGREDIENT', payload: id });
        toast({
          title: 'Ingrediente excluído',
          description: `O ingrediente ${ingredientName} foi excluído com sucesso.`,
          duration: 5000,
          variant: 'destructive',
        });
      }
    );
  };

  const handleEdit = (ingredient: Ingredient) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: ingredient });
  };

  const searchConfig = createSearchConfig('Buscar ingrediente...', search, setSearch, 'flex-1');

  const filterStatsConfig = createFilterStatsConfig(
    totalItems,
    filteredCount,
    hasActiveFilters,
    'ingrediente',
    'ingredientes',
    resetFilters
  );

  const emptyStateConfig = {
    icon: <Package className="text-muted-foreground mb-4 h-12 w-12" />,
    title: 'Nenhum ingrediente encontrado',
    description: search
      ? 'Tente ajustar sua busca ou filtro'
      : 'Adicione novos ingredientes para começar',
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Layout - Hierárquico */}
      <div className="space-y-4 lg:hidden">
        {/* KPIs Principais - Destaque */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Ingredientes</p>
                <p className="text-xl font-bold text-gray-900">{summary.total}</p>
                <p className="text-xs text-gray-500">cadastrados</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor em estoque</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summary.ingredientsTotalValue)}
                </p>
                <p className="text-xs text-gray-500">valor total</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <BadgeDollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas de Estoque - Grid Compacto */}
        <div className="rounded-lg bg-gray-50 p-3">
          <h4 className="mb-3 text-sm font-medium text-gray-700">Status do estoque</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-white p-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-red-500" />
                <p className="truncate text-xs font-medium text-gray-500">Crítico</p>
              </div>
              <p className="text-sm font-bold text-red-600">{summary.critico}</p>
            </div>

            <div className="rounded-md bg-white p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <p className="truncate text-xs font-medium text-gray-500">Atenção</p>
              </div>
              <p className="text-sm font-bold text-yellow-600">{summary.atencao}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="hidden grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid lg:grid-cols-4">
        <CardWrapper
          title="Ingredientes"
          value={summary.total}
          icon={<Package />}
          subtitle="cadastrados"
          className="hover:border-primary border-t-4"
        />
        <CardWrapper
          title="Estoque crítico"
          value={summary.critico}
          icon={<AlertOctagon />}
          subtitle="atenção imediata"
          className="hover:border-primary border-t-4"
        />
        <CardWrapper
          title="Estoque em alerta"
          value={summary.atencao}
          icon={<AlertTriangle />}
          subtitle="precisam de reposição"
          className="hover:border-primary border-t-4"
        />
        <CardWrapper
          title="Valor total"
          value={formatCurrency(summary.ingredientsTotalValue)}
          icon={<BadgeDollarSign />}
          subtitle="em estoque"
          className="hover:border-primary border-t-4"
        />
      </div>

      <GenericListContainer
        items={filteredIngredients}
        search={searchConfig}
        filterStats={filterStatsConfig}
        emptyState={emptyStateConfig}
        headerContent={<QuickFilters activeFilter={statusFilter} onChange={setStatusFilter} />}
        renderItem={ingredient => (
          <IngredientCard ingredient={ingredient} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        gridCols="grid-cols-1 sm:grid-cols-2"
      />

      {/* Dialog de confirmação */}
      {confirmationState && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          description={confirmationState.description}
          variant={confirmationState.variant}
          confirmText={confirmationState.confirmText}
          confirmButtonText={confirmationState.confirmButtonText}
          cancelButtonText={confirmationState.cancelButtonText}
        />
      )}
    </div>
  );
}
