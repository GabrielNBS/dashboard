'use client';

import { useState, useMemo } from 'react';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatQuantity } from '@/utils/normalizeQuantity';
import { Trash2, Edit3, Package, BadgeDollarSign, AlertTriangle, AlertOctagon } from 'lucide-react';

// UI Components
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/badge';
import CardWrapper from '../finance/cards/CardWrapper';
import SearchInput from '@/components/ui/SearchInput';
import StatusPulse from '@/components/ui/StatusPulse';

// ============================================================
// 🔹 Tipos e constantes auxiliares
// ============================================================

// Status possíveis para ingredientes
type StatusFilter = 'critico' | 'atencao' | 'normal' | 'all';

// Definição dos filtros rápidos
const FILTERS = [
  { id: 'all', label: 'Todos', color: 'bg-gray-100' },
  { id: 'critico', label: 'Crítico', color: 'bg-red-100' },
  { id: 'atencao', label: 'Atenção', color: 'bg-yellow-100' },
  { id: 'normal', label: 'Normal', color: 'bg-green-100' },
] as const;

// Ordem de prioridade usada no sort
const priorityOrder: Record<'critico' | 'atencao' | 'normal', number> = {
  critico: 0,
  atencao: 1,
  normal: 2,
};

// ============================================================
// 🔹 Componente de Filtros Rápidos
// ============================================================
function QuickFilters({
  activeFilter,
  onChange,
}: {
  activeFilter: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const statusColors: Record<StatusFilter, string> = {
    critico: 'bg-red-500',
    atencao: 'bg-yellow-500',
    normal: 'bg-green-500',
    all: 'bg-gray-400',
  };

  return (
    <div className="flex flex-wrap gap-3">
      {FILTERS.map(filter => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id as StatusFilter)}
          className="relative w-full sm:w-auto"
        >
          {/* Badge pulse no canto superior direito */}
          <div className="absolute top-2 right-2">
            <StatusPulse color={statusColors[filter.id as StatusFilter]} />
          </div>

          <CardWrapper
            title={filter.label}
            value=""
            bgColor={activeFilter === filter.id ? `${filter.color} border-primary` : 'bg-surface'}
            textColor={activeFilter === filter.id ? 'text-primary' : 'text-muted-foreground'}
            layout="vertical"
          />
        </button>
      ))}
    </div>
  );
}

// ============================================================
// 🔹 Função utilitária para calcular status do estoque
// ============================================================
function getStockStatus(quantity: number, maxQuantity: number) {
  if (!maxQuantity || maxQuantity <= 0) return 'normal';
  const percentage = (quantity / maxQuantity) * 100;
  if (percentage < 15) return 'critico';
  if (percentage < 30) return 'atencao';
  return 'normal';
}

// ============================================================
// 🔹 Card de um ingrediente individual
// ============================================================
interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredientId: string) => void;
}

const IngredientCard = ({ ingredient, onEdit, onDelete }: IngredientCardProps) => {
  const maxQuantity = ingredient.maxQuantity ?? 0;
  const status = getStockStatus(ingredient.quantity, maxQuantity);
  const stockPercentage = maxQuantity > 0 ? (ingredient.quantity / maxQuantity) * 100 : 0;

  // Configuração de status para exibição
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

  return (
    <Card className="transition-shadow hover:shadow-md">
      {/* Cabeçalho */}
      <CardHeader className="flex flex-row items-center gap-3">
        <CardTitle className="flex-1 truncate">{ingredient.name}</CardTitle>
        <Badge className="capitalize">{ingredient.unit}</Badge>
        <Badge variant={variant}>
          <span className="flex items-center gap-1">
            {icon}
            {text}
          </span>
        </Badge>
      </CardHeader>

      {/* Conteúdo */}
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Quantidade</p>
          <p className="font-semibold">{formatQuantity(ingredient.quantity, ingredient.unit)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Preço de compra</p>
          <p className="font-semibold">{formatCurrency(ingredient.buyPrice ?? 0)}</p>
        </div>

        {/* Barra de progresso */}
        <div className="col-span-2 mt-3">
          <div className="text-foreground mb-1 flex justify-between text-sm">
            <span>Nível do Estoque</span>
            <span>{Math.round(stockPercentage)}%</span>
          </div>
          <Progress value={stockPercentage} stats={status} />
        </div>
      </CardContent>

      {/* Rodapé com ações */}
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button
          size="sm"
          variant="edit"
          onClick={() => onEdit(ingredient)}
          aria-label={`Editar ${ingredient.name}`}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(ingredient.id)}
          aria-label={`Excluir ${ingredient.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
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

  // ============================================================
  // Renderização final
  // ============================================================
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
