'use client';

import { useState, useMemo } from 'react';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/utils/formatCurrency';
import { Package, BadgeDollarSign, AlertTriangle, AlertOctagon } from 'lucide-react';

// UI Components
import CardWrapper from '../finance/cards/CardWrapper';
import SearchInput from '@/components/ui/SearchInput';
import QuickFilters from '@/components/ui/QuickFilter';
import { StatusFilter } from '@/types/components';
import { getStockStatus } from '@/utils/ingredientUtils';
import IngredientCard from './IngredientCard';

// Ordem de prioridade usada no sort
const priorityOrder: Record<'critico' | 'atencao' | 'normal', number> = {
  critico: 0,
  atencao: 1,
  normal: 2,
};

// ============================================================
// 🔹 Lista de Ingredientes (com filtros e resumo)
// ============================================================
export default function IngredientCardList() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;
  const hydrated = useHydrated();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Calcula ingredientes com status + resumo
  const { ingredientsWithStatus, summary } = useMemo(() => {
    const ingredientsWithStatus = ingredients.map(ingredient => ({
      ...ingredient,
      status: getStockStatus(ingredient.quantity, ingredient.maxQuantity ?? 0),
    }));

    const totalValue = ingredients.reduce(
      (total, item) => total + item.quantity * (item.buyPrice ?? 0),
      0
    );

    return {
      ingredientsWithStatus,
      summary: {
        total: ingredients.length,
        critico: ingredientsWithStatus.filter(i => i.status === 'critico').length,
        atencao: ingredientsWithStatus.filter(i => i.status === 'atencao').length,
        totalValue,
      },
    };
  }, [ingredients]);

  // Aplica busca + filtro + ordenação
  const filteredIngredients = useMemo(() => {
    const searchLower = search.toLowerCase();
    return ingredientsWithStatus
      .filter(ingredient => {
        const matchesSearch = ingredient.name.toLowerCase().includes(searchLower);
        const matchesStatus = statusFilter === 'all' || ingredient.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        return (
          priorityOrder[a.status as keyof typeof priorityOrder] -
          priorityOrder[b.status as keyof typeof priorityOrder]
        );
      });
  }, [ingredientsWithStatus, search, statusFilter]);

  // Evita erro no Next.js SSR
  if (!hydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Carregando ingredientes...</p>
      </div>
    );
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
      {/* 🔸 Cards de Resumo */}
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

      {/* 🔸 Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Buscar ingrediente..."
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <QuickFilters activeFilter={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* 🔸 Lista de Ingredientes */}
      {filteredIngredients.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredIngredients.map(ingredient => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border py-12">
          <Package className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-medium">Nenhum ingrediente encontrado</h3>
          <p className="text-muted-foreground text-center">
            {search
              ? 'Tente ajustar sua busca ou filtro'
              : 'Adicione novos ingredientes para começar'}
          </p>
        </div>
      )}
    </div>
  );
}
