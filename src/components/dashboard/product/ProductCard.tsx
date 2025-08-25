import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';
import { ProductState } from '@/types/products';
import { formatCurrency } from '@/utils/formatCurrency';
import { Edit2, List, PieChart, Scale, Tag, Trash2, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: ProductState;
  onEdit: (product: ProductState) => void;
  onRemove: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onRemove }) => {
  const totalCost = product.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
  const sellingPrice = product.sellingPrice ?? 0;
  const profitMargin = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0;
  const profitValue = sellingPrice - totalCost;

  return (
    <Card className="flex overflow-hidden rounded-xl border-0 py-0 shadow-lg transition-all hover:shadow-md">
      <div className="flex w-full flex-col">
        {/* Header com fundo colorido e informações principais */}
        <CardHeader className="bg-muted-foreground/10 text-surface p-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-primary mb-1 flex items-center gap-2 text-xl font-black">
                {product.name}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="default" className="bg-accent text-surface flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </Badge>
                <Badge variant="default" className="bg-accent text-surface flex items-center gap-1">
                  <Scale className="h-3 w-3" />
                  {product.productionMode === 'lote' ? 'Produção em Lote' : 'Unitário'}
                </Badge>
                {profitMargin < 0 && (
                  <Badge variant="warning" className="flex items-center gap-1 py-1">
                    <AlertTriangle className="h-3 w-3" />
                    Prejuízo
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                onClick={() => onRemove(product.uid)}
                variant="ghost"
                className="text-primary hover:bg-primary/20 h-8 w-8 p-0"
                aria-label="Remover produto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={() => onEdit(product)}
                variant="ghost"
                className="text-primary hover:bg-primary/20 h-8 w-8 p-0"
                aria-label="Editar produto"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Margem com destaque visual */}
          <div className={`mb-4 rounded-lg p-3 ${profitMargin >= 0 ? 'bg-great' : 'bg-bad'}`}>
            <p className="text-muted-foreground mb-1 text-xs font-medium">Margem</p>
            <div
              className={`text-lg font-bold ${profitMargin >= 0 ? 'text-on-great' : 'text-on-critical'}`}
            >
              {profitMargin.toFixed(1)}%
              <span className="mt-1 block text-sm">
                {profitMargin >= 0 ? 'Lucro: ' : 'Prejuízo: '}
                {formatCurrency(Math.abs(profitValue))}
              </span>
            </div>
          </div>

          {/* Resumo financeiro com layout melhorado */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium">Custo</p>
              <p className="text-destructive text-lg font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium">Venda</p>
              <p className="text-on-great text-lg font-bold">{formatCurrency(sellingPrice)}</p>
            </div>
          </div>

          {/* Barra de lucro visual */}
          <div className="mb-4">
            <div className="text-muted-foreground mb-1 flex justify-between text-xs">
              <span>Custo: {formatCurrency(totalCost)}</span>
              <span className={profitValue >= 0 ? 'text-on-great' : 'text-on-bad'}>
                {profitValue >= 0 ? 'Lucro: ' : 'Prejuízo: '}
                {formatCurrency(Math.abs(profitValue))}
              </span>
            </div>
            <Progress
              value={sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0}
              className="h-2"
              stats={profitMargin >= 0 ? 'bg-green-500' : 'bg-red-500'}
            />
          </div>

          {/* Informações adicionais */}
          {product.productionMode === 'lote' && product.yieldQuantity && (
            <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
              <PieChart className="h-4 w-4" />
              <span>Rendimento: {product.yieldQuantity} unidades</span>
            </div>
          )}

          {/* Lista de ingredientes com acordeão */}
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Ingredientes ({product.ingredients.length})</span>
              </div>
              <svg
                className="text-muted-foreground h-5 w-5 transition-transform group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </summary>
            <ul className="mt-3 space-y-2">
              {product.ingredients.map(ingredient => (
                <li
                  key={ingredient.id}
                  className="bg-muted/30 flex justify-between rounded p-2 text-sm"
                >
                  <span className="font-medium">- {ingredient.name}</span>
                  <span>
                    {ingredient.quantity} {ingredient.unit} ×{' '}
                    {formatCurrency(ingredient.buyPrice ?? 0)} ={' '}
                    {formatCurrency(ingredient.totalValue)}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </CardContent>

        <CardFooter className="bg-muted/30 text-muted-foreground mb-2 flex justify-between px-4 py-2 text-xs">
          <span>ID: {product.uid}</span>
          <span>Atualizado em: {new Date().toLocaleDateString()}</span>
        </CardFooter>
      </div>
    </Card>
  );
};
