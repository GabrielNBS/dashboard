import React, { useState } from 'react';
import { ProductState } from '@/types/products';
import { calculateRealProfitMarginFromProduction, calculateUnitCost } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import {
  PieChart,
  Scale,
  Tag,
  AlertTriangle,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Package,
  Calculator,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/base';
import CountBadgeNotify from '@/components/ui/base/CountBadgeNotify';

interface ProductCardProps {
  product: ProductState;
  onEdit: (product: ProductState) => void;
  onRemove: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onRemove }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { production, ingredients } = product;
  const { totalCost, sellingPrice, mode, yieldQuantity, unitSellingPrice } = production;

  const unitCost = calculateUnitCost(totalCost, production.mode, production.yieldQuantity);

  // Calculate profit metrics - memoized calculations
  const realProfitValue = sellingPrice - totalCost;
  const displayProfitMargin = calculateRealProfitMarginFromProduction(production, sellingPrice);
  const isProfit = displayProfitMargin >= 0;

  return (
    <div className="bg-card border-border rounded-xl border shadow-md">
      {/* Header minimalista */}
      <div className="bg-foreground rounded-t-xl px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-background mb-2 text-lg font-semibold">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-info text-on-info inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                <Tag className="mr-1 h-3 w-3" />
                {product.category}
              </span>
              <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                <Scale className="mr-1 h-3 w-3" />
                {mode === 'lote' ? 'Produção em Lote' : 'Unitário'}
              </span>
              {!isProfit && (
                <span className="bg-bad text-on-bad inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Prejuízo
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => onEdit(product)}
              className="text-muted-foreground hover:bg-muted hover:text-accent cursor-pointer rounded-lg p-2 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => onRemove(product.uid || '')}
              className="text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer rounded-lg p-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs minimalistas */}
      <div className="bg-foreground px-6 py-3">
        <div className="flex gap-1">
          {[
            { key: 'overview', label: 'Visão Geral', count: null },
            { key: 'ingredients', label: 'Ingredientes', count: ingredients.length },
            { key: 'details', label: 'Detalhes', count: null },
          ].map(tab => (
            <Button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-background border-primary border'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
              {tab.count && <CountBadgeNotify count={tab.count} isActive={activeTab === tab.key} />}
            </Button>
          ))}
        </div>
      </div>

      {/* Conteúdo das tabs */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Destaque da margem - estilo minimalista */}
            <div
              className={`rounded-lg border-l-4 p-4 ${
                isProfit ? 'border-on-great bg-great' : 'border-on-bad bg-bad'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    {isProfit ? (
                      <TrendingUp className="text-on-great h-5 w-5" />
                    ) : (
                      <TrendingDown className="text-on-bad h-5 w-5" />
                    )}
                    <span
                      className={`text-sm font-medium ${isProfit ? 'text-on-great' : 'text-on-bad'}`}
                    >
                      Margem de Lucro
                    </span>
                  </div>
                  <div
                    className={`text-3xl font-bold ${isProfit ? 'text-on-great' : 'text-on-bad'}`}
                  >
                    {displayProfitMargin.toFixed(1)}%
                  </div>
                  <div
                    className={`mt-1 text-sm ${isProfit ? 'text-on-great/80' : 'text-on-bad/80'}`}
                  >
                    {isProfit ? 'Lucro' : 'Prejuízo'}: {formatCurrency(Math.abs(realProfitValue))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de métricas - layout minimalista */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calculator className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">Custo Total</span>
                </div>
                <div className="text-card-foreground text-2xl font-bold">
                  {formatCurrency(totalCost)}
                </div>
                <span className="text-muted-foreground mt-1 text-sm">por unidade</span>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm font-medium">Preço de Venda</span>
                </div>
                <div className="text-primary text-2xl font-bold">
                  {formatCurrency(sellingPrice)}
                </div>
                <span className="text-muted-foreground mt-1 text-sm">por unidade</span>
              </div>
            </div>

            {/* Progress bar minimalista */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Relação Custo vs Venda
                </span>
                <span className="text-muted-foreground text-sm">
                  {((unitCost / unitSellingPrice) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-border h-2 w-full rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isProfit ? 'bg-on-great' : 'bg-on-bad'
                  }`}
                  style={{ width: `${Math.min(100, (unitCost / unitSellingPrice) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="bg-info rounded-lg p-4">
              <div className="mb-2 flex items-center gap-2">
                <Package className="text-on-info h-4 w-4" />
                <span className="text-on-info text-sm font-medium">Informações de Produção</span>
              </div>
              {mode === 'lote' ? (
                <div className="text-on-info text-sm">
                  <strong>Produção em Lote:</strong> {yieldQuantity} unidades por lote
                </div>
              ) : (
                <div className="text-on-info text-sm">
                  <strong>Produção Individual:</strong> 1 unidade por lote
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            {/* Header da seção */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="text-primary h-5 w-5" />
                <span className="text-card-foreground font-medium">Composição do Produto</span>
              </div>
              <span className="text-muted-foreground text-sm">
                {ingredients.length} ingredientes
              </span>
            </div>

            {/* Resumo do rendimento */}
            <div className="bg-info rounded-lg p-3">
              <div className="text-on-info text-sm">
                <strong>Rendimento:</strong> {yieldQuantity} unidades por lote
              </div>
            </div>

            {/* Lista de ingredientes */}
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div
                  key={ing.id}
                  className="bg-muted hover:bg-muted/80 flex items-center justify-between rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-background border-border flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-card-foreground font-medium">{ing.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {ing.totalQuantity} {ing.unit}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-card-foreground font-semibold">
                      {formatCurrency(ing.totalQuantity * ing.averageUnitPrice)}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatCurrency(ing.averageUnitPrice)}/{ing.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total dos ingredientes */}
            <div className="border-border border-t pt-4">
              <div className="bg-primary text-primary-foreground flex items-center justify-between rounded-lg p-3">
                <span className="font-medium">Total dos Ingredientes</span>
                <span className="text-lg font-bold">
                  {formatCurrency(
                    ingredients.reduce(
                      (acc, ing) => acc + ing.totalQuantity * ing.averageUnitPrice,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Informações do produto */}
            <div>
              <h4 className="text-card-foreground mb-3 font-medium">Informações do Produto</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-muted-foreground text-sm">ID do Produto</label>
                  <div className="bg-muted border-border rounded border p-2 font-mono text-sm">
                    {product.uid}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground text-sm">Categoria</label>
                  <div className="flex items-center gap-2 p-2">
                    <Tag className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{product.category}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground text-sm">Modo de Produção</label>
                  <div className="flex items-center gap-2 p-2">
                    <Scale className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm capitalize">{mode}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground text-sm">Última Atualização</label>
                  <div className="p-2 text-sm">{new Date().toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
            </div>

            {/* Análise financeira detalhada */}
            <div>
              <h4 className="text-card-foreground mb-3 font-medium">
                Análise Financeira Detalhada
              </h4>
              <div className="space-y-3">
                <div className="border-border flex items-center justify-between border-b py-2">
                  <span className="text-muted-foreground">Custo por Ingrediente</span>
                  <span className="font-medium">
                    {formatCurrency(
                      ingredients.reduce(
                        (acc, ing) => acc + ing.totalQuantity * ing.averageUnitPrice,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="border-border flex items-center justify-between border-b py-2">
                  <span className="text-muted-foreground">Custo Total</span>
                  <span className="font-medium">{formatCurrency(totalCost)}</span>
                </div>
                <div className="border-border flex items-center justify-between border-b py-2">
                  <span className="text-muted-foreground">Preço de Venda</span>
                  <span className="text-on-great font-medium">{formatCurrency(sellingPrice)}</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-lg px-3 py-2">
                  <span className="font-medium">Resultado Final</span>
                  <span
                    className={`text-lg font-bold ${isProfit ? 'text-on-great' : 'text-on-bad'}`}
                  >
                    {isProfit ? '+' : ''}
                    {formatCurrency(realProfitValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas unitárias */}
            <div>
              <h4 className="text-card-foreground mb-3 font-medium">Métricas Unitárias</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-muted-foreground mb-1 text-sm">Custo por Unidade</div>
                  <div className="text-card-foreground text-lg font-bold">
                    {formatCurrency(unitCost)}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-muted-foreground mb-1 text-sm">Preço por Unidade</div>
                  <div className="text-on-great text-lg font-bold">
                    {formatCurrency(unitSellingPrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
