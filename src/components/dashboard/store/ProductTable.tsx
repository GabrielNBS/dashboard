'use client';

import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatQuantity } from '@/utils/normalizeQuantity';
import {
  Trash2,
  Edit3,
  Package,
  BadgeDollarSign,
  AlertTriangle,
  AlertOctagon,
  TriangleAlert,
} from 'lucide-react';

// Components Shader UI
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CardWrapper from '../finance/cards/CardWrapper';

function getStockStatus(quantity: number, maxQuantity: number) {
  if (!maxQuantity) return 'normal';
  const percentage = (quantity / maxQuantity) * 100;

  if (percentage < 15) return 'critico';
  if (percentage < 30) return 'atencao';
  return 'normal';
}

export default function IngredientCardList() {
  const { state, dispatch } = useIngredientContext();
  const { ingredients } = state;

  const hydrated = useHydrated();
  if (!hydrated) return <div>Loading...</div>;

  function handleDeleteIngredient(ingredientId: string) {
    if (!confirm('Tem certeza que deseja excluir este ingrediente?')) return;
    dispatch({ type: 'DELETE_INGREDIENT', payload: ingredientId });
  }

  function handleEditIngredient(ingredient: Ingredient) {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: ingredient });
  }

  // Ordena por prioridade: crítico > atenção > normal
  const sortedIngredients = [...ingredients].sort((a, b) => {
    const order = { critico: 0, atencao: 1, normal: 2 };
    return (
      order[getStockStatus(a.quantity, a.maxQuantity ?? 100)] -
      order[getStockStatus(b.quantity, b.maxQuantity ?? 100)]
    );
  });

  // Contadores para os cards de resumo
  const totalCritico = ingredients.filter(
    i => getStockStatus(i.quantity, i.maxQuantity ?? 100) === 'critico'
  ).length;

  const totalAtencao = ingredients.filter(
    i => getStockStatus(i.quantity, i.maxQuantity ?? 100) === 'atencao'
  ).length;

  return (
    <>
      {/* Cards de Resumo */}
      <div className="flex w-full flex-row justify-between gap-6 lg:flex-col">
        <div className="flex gap-6">
          <CardWrapper
            title="Ingredientes"
            value={ingredients.length}
            icon={<Package />}
            subtitle={'ingredientes cadastrados'}
          />
          <CardWrapper
            title="Estoque Crítico"
            value={totalCritico}
            icon={<AlertOctagon />}
            subtitle={'com estoque critico'}
          />
          <CardWrapper
            title="Estoque em Atenção"
            value={totalAtencao}
            icon={<AlertTriangle />}
            subtitle={'itens precisam de reposição'}
          />
          <CardWrapper
            title="Valor total "
            value={formatCurrency(
              ingredients.reduce(
                (total, ingredient) => total + ingredient.quantity * (ingredient.buyPrice ?? 0),
                0
              )
            )}
            icon={<BadgeDollarSign />}
            subtitle={'em estoque'}
          />
        </div>
      </div>

      {/* Lista de Ingredientes */}
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {sortedIngredients.map(ingredient => {
          const status = getStockStatus(ingredient.quantity, ingredient.maxQuantity ?? 100);
          const stockPercentage = (ingredient.quantity / (ingredient.maxQuantity ?? 100)) * 100;

          const badgeVariant =
            status === 'critico' ? 'danger' : status === 'atencao' ? 'warning' : 'normal';

          const statusText =
            status === 'critico' ? (
              <p className="flex items-center gap-1">
                <AlertOctagon height={12} width={12} />
                Crítico
              </p>
            ) : status === 'atencao' ? (
              <p className="flex items-center gap-1">
                <TriangleAlert height={12} width={12} />
                Atenção
              </p>
            ) : (
              'Normal'
            );

          return (
            <Card key={ingredient.id} className={`transition-shadow hover:shadow-md`}>
              <CardHeader className="flex items-center gap-3">
                <CardTitle className="flex-1 truncate">{ingredient.name}</CardTitle>
                <Badge className="capitalize">{ingredient.unit}</Badge>
                <Badge variant={badgeVariant}>{statusText}</Badge>
              </CardHeader>

              {/* Conteúdo */}
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">Quantidade</p>
                  <p className="font-semibold">
                    {formatQuantity(ingredient.quantity, ingredient.unit)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Preço de compra</p>
                  <p className="font-semibold">{formatCurrency(ingredient.buyPrice ?? 0)}</p>
                </div>
                <div className="col-span-2 mt-4">
                  <div className="mb-1 flex justify-between text-sm text-gray-700">
                    <span>Nível do Estoque</span>
                    <span>{stockPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress stats={status} value={stockPercentage} className={`h-2`} />
                </div>
              </CardContent>

              {/* Rodapé */}
              <CardFooter className="justify-end gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="edit"
                      onClick={() => handleEditIngredient(ingredient)}
                      aria-label={`Editar ingrediente ${ingredient.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar ingrediente</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      aria-label={`Deletar ingrediente ${ingredient.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir ingrediente</p>
                  </TooltipContent>
                </Tooltip>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
