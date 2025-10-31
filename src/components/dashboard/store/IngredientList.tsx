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
      <section aria-labelledby="ingredient-summary-mobile" className="space-y-4 lg:hidden">
        <h2 id="ingredient-summary-mobile" className="sr-only">
          Resumo dos ingredientes
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <article
            className="bg-card rounded-lg p-4 shadow-sm"
            role="region"
            aria-labelledby="total-ingredients"
          >
            <div className="flex items-center justify-between">
              <div>
                <p id="total-ingredients" className="text-muted-foreground text-sm font-medium">
                  Total de Ingredientes
                </p>
                <p
                  className="text-foreground text-xl font-bold"
                  aria-label={`${summary.total} ingredientes cadastrados`}
                >
                  {summary.total}
                </p>
                <p className="text-muted-foreground text-xs">cadastrados</p>
              </div>
              <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                <Package className="text-primary-foreground h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </article>

          <article
            className="bg-card rounded-lg p-4 shadow-sm"
            role="region"
            aria-labelledby="stock-value"
          >
            <div className="flex items-center justify-between">
              <div>
                <p id="stock-value" className="text-muted-foreground text-sm font-medium">
                  Valor em estoque
                </p>
                <p
                  className="text-foreground text-xl font-bold"
                  aria-label={`Valor total em estoque: ${formatCurrency(summary.ingredientsTotalValue)}`}
                >
                  {formatCurrency(summary.ingredientsTotalValue)}
                </p>
                <p className="text-muted-foreground text-xs">valor total</p>
              </div>
              <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                <BadgeDollarSign className="text-accent-foreground h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </article>
        </div>

        <section className="bg-muted rounded-lg p-3" aria-labelledby="stock-alerts">
          <h3 id="stock-alerts" className="text-muted-foreground mb-3 text-sm font-medium">
            Status do estoque
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <article
              className="bg-card rounded-md p-3"
              role="region"
              aria-labelledby="critical-stock"
            >
              <div className="flex items-center gap-2">
                <AlertOctagon className="text-destructive h-4 w-4" aria-hidden="true" />
                <p
                  id="critical-stock"
                  className="text-muted-foreground truncate text-xs font-medium"
                >
                  Crítico
                </p>
              </div>
              <p
                className="text-destructive text-sm font-bold"
                aria-label={`${summary.critico} ingredientes em estado crítico`}
              >
                {summary.critico}
              </p>
            </article>

            <article
              className="bg-card rounded-md p-3"
              role="region"
              aria-labelledby="attention-stock"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-accent h-4 w-4" aria-hidden="true" />
                <p
                  id="attention-stock"
                  className="text-muted-foreground truncate text-xs font-medium"
                >
                  Atenção
                </p>
              </div>
              <p
                className="text-accent text-sm font-bold"
                aria-label={`${summary.atencao} ingredientes precisando de atenção`}
              >
                {summary.atencao}
              </p>
            </article>
          </div>
        </section>
      </section>

      <section
        aria-labelledby="ingredient-summary-desktop"
        className="hidden grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid lg:grid-cols-4"
      >
        <h2 id="ingredient-summary-desktop" className="sr-only">
          Resumo dos ingredientes
        </h2>
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
