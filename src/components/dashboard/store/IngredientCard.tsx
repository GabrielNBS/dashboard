import { Badge } from '@/components/ui/base/Badge';
import Button from '@/components/ui/base/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/base/Card';
import { Progress } from '@/components/ui/Progress';
import { IngredientCardProps } from '@/types/components';
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency';
import { getStockStatus } from '@/lib/utils/calculations/calcSale';
import { formatQuantity } from '@/lib/utils/helpers/normalizeQuantity';
import { AlertOctagon, AlertTriangle, Edit3, Trash2 } from 'lucide-react';

const IngredientCard = ({ ingredient, onEdit, onDelete }: IngredientCardProps) => {
  const maxQuantity = ingredient.maxQuantity ?? 0;
  const status = getStockStatus(ingredient.totalQuantity ?? 0, maxQuantity);
  const stockPercentage = maxQuantity > 0 ? (ingredient.totalQuantity / maxQuantity) * 100 : 0;

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
          <p className="font-semibold">
            {formatQuantity(ingredient.totalQuantity, ingredient.unit)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Preço de compra</p>
          <p className="font-semibold">{formatCurrency(ingredient.averageUnitPrice ?? 0)}</p>
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

export default IngredientCard;
