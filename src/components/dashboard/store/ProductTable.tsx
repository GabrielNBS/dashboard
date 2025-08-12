'use client';

import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { Ingredient } from '@/types/ingredients';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatQuantity } from '@/utils/normalizeQuantity';
import { getStockStatus } from '@/utils/ingredientUtils';

// Components Shader UI
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

  return (
    <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-1">
      {ingredients.map(ingredient => {
        const status = getStockStatus(ingredient.quantity, ingredient.unit);
        const stockPercentage = (ingredient.quantity / (ingredient.maxQuantity ?? 100)) * 100;

        const badgeVariant =
          status === 'Sem estoque'
            ? 'destructive'
            : status === 'Estoque baixo'
              ? 'secondary'
              : 'default';

        return (
          <Card key={ingredient.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex items-center gap-3">
              <CardTitle className="flex-1 truncate">{ingredient.name}</CardTitle>
              <Badge variant="secondary" className="capitalize">
                {ingredient.unit}
              </Badge>
              <Badge variant={badgeVariant}>
                {status === 'Sem estoque'
                  ? 'Crítico'
                  : status === 'Estoque baixo'
                    ? 'Baixo'
                    : 'Normal'}
              </Badge>
            </CardHeader>

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
                <Progress value={stockPercentage} className="h-2" />
              </div>
            </CardContent>

            <CardFooter className="justify-end gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="edit"
                    onClick={() => handleEditIngredient(ingredient)}
                    aria-label={`Editar ingrediente ${ingredient.name}`}
                  >
                    Editar
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
                    Deletar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
