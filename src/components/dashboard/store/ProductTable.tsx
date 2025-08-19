'use client';

import { useState, useMemo } from 'react';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatQuantity } from '@/utils/normalizeQuantity';
import { Trash2, Edit3, Package, BadgeDollarSign, AlertTriangle, AlertOctagon } from 'lucide-react';

// Components
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/badge';
import CardWrapper from '../finance/cards/CardWrapper';
import SearchInput from '@/components/ui/SearchInput';
import FilterSelect from '@/components/ui/FilterSelect';

type StockStatus = 'critico' | 'atencao' | 'normal';
type StatusFilter = StockStatus | 'all';

// Função pura para calcular status do estoque
function getStockStatus(quantity: number, maxQuantity: number): StockStatus {
  if (!maxQuantity || maxQuantity <= 0) return 'normal';

  const percentage = (quantity / maxQuantity) * 100;
  if (percentage < 15) return 'critico';
  if (percentage < 30) return 'atencao';
  return 'normal';
}

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredientId: string) => void;
}

// Componente de card individual refatorado
const IngredientCard = ({ ingredient, onEdit, onDelete }: IngredientCardProps) => {
  const maxQuantity = ingredient.maxQuantity ?? 0;
  const status = getStockStatus(ingredient.quantity, maxQuantity);
  const stockPercentage = maxQuantity > 0 ? (ingredient.quantity / maxQuantity) * 100 : 0;

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

      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Quantidade</p>
          <p className="font-semibold">{formatQuantity(ingredient.quantity, ingredient.unit)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Preço de compra</p>
          <p className="font-semibold">{formatCurrency(ingredient.buyPrice ?? 0)}</p>
        </div>

        <div className="col-span-2 mt-3">
          <div className="text-foreground mb-1 flex justify-between text-sm">
            <span>Nível do Estoque</span>
            <span>{Math.round(stockPercentage)}%</span>
          </div>
          <Progress value={stockPercentage} stats={status} />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button
          size="sm"
          variant="edit"
          onClick={() => onEdit(ingredient)}
          aria-label={`Editar ${ingredient.name}`}
          tooltip={{ tooltipContent: 'Editar ingrediente' }}
        >
          <Edit3 className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(ingredient.id)}
          aria-label={`Excluir ${ingredient.name}`}
          tooltip={{ tooltipContent: 'Excluir ingrediente' }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function IngredientCardList() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;
  const hydrated = useHydrated();

  // Estados para filtragem
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Pré-calcula status e valores
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

  // Filtragem e ordenação
  const filteredIngredients = useMemo(() => {
    const searchLower = search.toLowerCase();
    return ingredientsWithStatus
      .filter(ingredient => {
        const matchesSearch = ingredient.name.toLowerCase().includes(searchLower);
        const matchesStatus = statusFilter === 'all' || ingredient.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const priorityOrder: Record<StockStatus, number> = {
          critico: 0,
          atencao: 1,
          normal: 2,
        };
        return priorityOrder[a.status] - priorityOrder[b.status];
      });
  }, [ingredientsWithStatus, search, statusFilter]);

  if (!hydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Carregando ingredientes...</p>
      </div>
    );
  }

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
      {/* Cards de Resumo */}
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

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Buscar ingrediente..."
          value={search}
          onChange={setSearch}
          className="flex-1"
        />

        <div className="w-full sm:w-48">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'critico', label: 'Crítico' },
              { value: 'atencao', label: 'Atenção' },
              { value: 'normal', label: 'Normal' },
            ]}
          />
        </div>
      </div>

      {/* Lista de Ingredientes */}
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
