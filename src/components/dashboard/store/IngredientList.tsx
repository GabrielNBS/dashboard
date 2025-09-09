'use client';

import { useMemo } from 'react';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/lib/hooks/ui/useHydrated';
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency';
import { Package, BadgeDollarSign, AlertTriangle, AlertOctagon } from 'lucide-react';

// UI Components
import CardWrapper from '../finance/cards/CardWrapper';
import SearchInput from '@/components/ui/forms/SearchInput';
import QuickFilters from '@/components/ui/QuickFilter';
import { getStockStatus } from '@/lib/utils/calculations/calcSale';
import IngredientCard from './IngredientCard';

// Importações dos componentes reutilizáveis
import { useItemFilter, SearchResultsContainer, FilterStats } from '@/lib/hooks/ui/useFilter';

// Ordem de prioridade para ordenação
const priorityOrder: Record<'critico' | 'atencao' | 'normal', number> = {
  critico: 0,
  atencao: 1,
  normal: 2,
};

// Extensão do tipo Ingredient para incluir status
interface IngredientWithStatus extends Ingredient {
  status: 'critico' | 'atencao' | 'normal';
}

export default function IngredientCardList() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;
  const hydrated = useHydrated();

  // Calcular ingredientes com status
  const ingredientsWithStatus: IngredientWithStatus[] = useMemo(() => {
    return ingredients.map(ingredient => ({
      ...ingredient,
      status: getStockStatus(ingredient.totalQuantity, ingredient.maxQuantity),
    }));
  }, [ingredients]);

  // Configurar filtro reutilizável
  const filterConfig = {
    searchFields: ['name'] as (keyof IngredientWithStatus)[],
    statusField: 'status' as keyof IngredientWithStatus,
    sortFn: (a: IngredientWithStatus, b: IngredientWithStatus) => {
      return priorityOrder[a.status] - priorityOrder[b.status];
    },
  };

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
  } = useItemFilter(ingredientsWithStatus, filterConfig);

  // Calcular resumo
  const summary = useMemo(() => {
    const totalValue = ingredients.reduce(
      (total, item) => total + item.averageUnitPrice * item.totalQuantity,
      0
    );

    return {
      total: ingredients.length,
      critico: ingredientsWithStatus.filter(i => i.status === 'critico').length,
      atencao: ingredientsWithStatus.filter(i => i.status === 'atencao').length,
      totalValue,
    };
  }, [ingredients, ingredientsWithStatus]);

  // Loading state
  if (!hydrated) {
    return <SearchResultsContainer items={[]} isLoading={true} renderItem={() => null} />;
  }

  // Ações
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ingrediente?')) {
      dispatch({ type: 'DELETE_INGREDIENT', payload: id });
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: ingredient });
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardWrapper
          title="Ingredientes"
          value={summary.total}
          icon={<Package />}
          subtitle="cadastrados"
        />
        <CardWrapper
          title="Estoque Crítico"
          value={summary.critico}
          icon={<AlertOctagon />}
          subtitle="atenção imediata"
        />
        <CardWrapper
          title="Estoque em Alerta"
          value={summary.atencao}
          icon={<AlertTriangle />}
          subtitle="precisam de reposição"
        />
        <CardWrapper
          title="Valor Total"
          value={formatCurrency(summary.totalValue)}
          icon={<BadgeDollarSign />}
          subtitle="em estoque"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Buscar ingrediente..."
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <QuickFilters activeFilter={statusFilter} onChange={setStatusFilter} />
      </div>

      <FilterStats
        totalCount={totalItems}
        filteredCount={filteredCount}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={resetFilters}
      />

      <SearchResultsContainer
        items={filteredIngredients}
        emptyState={{
          icon: <Package className="text-muted-foreground mb-4 h-12 w-12" />,
          title: 'Nenhum ingrediente encontrado',
          description: search
            ? 'Tente ajustar sua busca ou filtro'
            : 'Adicione novos ingredientes para começar',
        }}
        renderItem={ingredient => (
          <IngredientCard ingredient={ingredient} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        gridCols="sm:grid-cols-2"
      />
    </div>
  );
}
