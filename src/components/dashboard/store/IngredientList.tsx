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
      <section aria-labelledby="ingredient-summary">
        <h2 id="ingredient-summary" className="sr-only">
          Resumo dos ingredientes
        </h2>

        {/* Mobile Layout */}
        <div className="space-y-4 lg:hidden">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Ingredientes</p>
                  <p className="text-primary text-xl font-bold">{summary.total}</p>
                </div>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <Package className="text-background h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Valor Total</p>
                  <p className="text-primary text-xl font-bold">
                    {formatCurrency(summary.ingredientsTotalValue)}
                  </p>
                </div>
                <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                  <BadgeDollarSign className="text-background h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <h3 className="text-accent-foreground mb-3 text-sm font-medium">Alertas de Estoque</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-md p-3">
                <p className="text-muted-foreground truncate text-xs font-medium">
                  Estoque Crítico
                </p>
                <p className="text-primary text-sm font-bold">{summary.critico}</p>
              </div>

              <div className="bg-background rounded-md p-3">
                <p className="text-muted-foreground truncate text-xs font-medium">
                  Estoque em Alerta
                </p>
                <p className="text-primary text-sm font-bold">{summary.atencao}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden grid-cols-4 gap-6 lg:grid">
          <CardWrapper
            title="Ingredientes"
            value={summary.total}
            icon={<Package aria-hidden="true" />}
            subtitle="cadastrados"
            className="hover:border-primary border-t-4"
          />
          <CardWrapper
            title="Estoque crítico"
            value={summary.critico}
            icon={<AlertOctagon aria-hidden="true" />}
            subtitle="atenção imediata"
            className="hover:border-primary border-t-4"
          />
          <CardWrapper
            title="Estoque em alerta"
            value={summary.atencao}
            icon={<AlertTriangle aria-hidden="true" />}
            subtitle="precisam de reposição"
            className="hover:border-primary border-t-4"
          />
          <CardWrapper
            title="Valor total"
            value={formatCurrency(summary.ingredientsTotalValue)}
            icon={<BadgeDollarSign aria-hidden="true" />}
            subtitle="em estoque"
            className="hover:border-primary border-t-4"
          />
        </div>
      </section>

      <section aria-labelledby="ingredient-list-title">
        <h2 id="ingredient-list-title" className="sr-only">
          Lista de ingredientes
        </h2>
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
      </section>

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
