import { Badge } from '@/components/ui/base/Badge';
import Button from '@/components/ui/base/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/base/Card';
import { Progress } from '@/components/ui/Progress';
import { ProductState } from '@/types/products';
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency';
import { Edit2, List, PieChart, Scale, Tag, Trash2, AlertTriangle, InfoIcon } from 'lucide-react';
import { calculateRealProfitMarginFromProduction } from '@/utils/calcSale';

interface ProductCardProps {
  product: ProductState;
  onEdit: (product: ProductState) => void;
  onRemove: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onRemove }) => {
  const { production, ingredients } = product;
  const { totalCost, sellingPrice, mode, yieldQuantity } = production;

  const realProfitValue = sellingPrice - totalCost;
  const displayProfitMargin = calculateRealProfitMarginFromProduction(production, sellingPrice);

  return (
    <Card className="flex overflow-hidden rounded-xl border-0 shadow-lg transition-all hover:shadow-md">
      <div className="flex w-full flex-col">
        <CardHeader className="text-surface p-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-muted-foreground mb-1 flex items-center gap-2 text-xl font-bold">
                {product.name}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </Badge>
                <Badge variant="outline">
                  <Scale className="h-3 w-3" />
                  {mode === 'lote' ? 'Produção em Lote' : 'Unitário'}
                </Badge>
                {displayProfitMargin < 0 && (
                  <Badge variant="danger" className="flex items-center gap-1 py-1">
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
                tooltip={{ tooltipContent: 'remover produto' }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={() => onEdit(product)}
                variant="ghost"
                className="text-primary hover:bg-primary/20 h-8 w-8 p-0"
                aria-label="Editar produto"
                tooltip={{ tooltipContent: 'Editar produto' }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div
            className={`mb-4 rounded-lg p-3 ${displayProfitMargin >= 0 ? 'bg-muted' : 'bg-bad'}`}
          >
            <div className="flex justify-between">
              <p className="text-muted-foreground mb-1 text-xs font-medium">Margem</p>
              <InfoIcon className="h-4 w-4 cursor-pointer" />
            </div>
            <div
              className={`text-xl font-bold ${displayProfitMargin >= 0 ? 'text-primary' : 'text-on-critical'}`}
            >
              {displayProfitMargin.toFixed(1)}%
              <span className="mt-1 block text-sm">
                {displayProfitMargin >= 0 ? 'Lucro: ' : 'Prejuízo: '}
                {formatCurrency(Math.abs(realProfitValue))}
              </span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium">Custo</p>
              <p className="text-primary text-lg font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium">Venda</p>
              <p className="text-on-great text-lg font-bold">{formatCurrency(sellingPrice)}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-muted-foreground mb-1 flex justify-between text-xs">
              <span>Custo: {formatCurrency(totalCost)}</span>
              <span className={realProfitValue >= 0 ? 'text-on-great' : 'text-on-bad'}>
                {realProfitValue >= 0 ? 'Lucro: ' : 'Prejuízo: '}
                {formatCurrency(Math.abs(realProfitValue))}
              </span>
            </div>
            <Progress
              value={sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0}
              className="h-2"
              stats={displayProfitMargin >= 0 ? 'bg-on-great' : 'bg-on-bad'}
              max={100}
            />
          </div>

          {mode === 'lote' && yieldQuantity > 0 && (
            <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
              <PieChart className="h-4 w-4" />
              <span>Rendimento: {yieldQuantity} unidades</span>
            </div>
          )}

          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Ingredientes ({ingredients.length})</span>
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
              {ingredients.map(ingredient => (
                <li
                  key={ingredient.id}
                  className="bg-muted/30 flex justify-between rounded p-3 text-sm"
                >
                  <span className="font-medium">- {ingredient.name}</span>
                  <span>
                    {ingredient.totalQuantity} {ingredient.unit} ×{' '}
                    {formatCurrency(ingredient.averageUnitPrice)} = {formatCurrency(totalCost)}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </CardContent>

        <CardFooter className="text-muted-foreground mb-2 flex justify-between p-3 text-xs">
          <span>ID: {product.uid}</span>
          <span>Atualizado em: {new Date().toLocaleDateString()}</span>
        </CardFooter>
      </div>
    </Card>
  );
};
