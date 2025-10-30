import React, { useState } from 'react';
import {
  Tag,
  AlertTriangle,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Package,
  Calculator,
  DollarSign,
  PieChart,
  ChevronRight,
} from 'lucide-react';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';

interface ProductCardProps {
  product: ProductState;
  onEdit: (product: ProductState) => void;
  onRemove: (productId: string) => void;
  onClick: (product: ProductState) => void;
  isExpanded?: boolean;
}

interface CompactModalContentProps {
  product: ProductState;
}

interface ExpandedProductModalProps {
  product: ProductState;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const calculateUnitCost = (totalCost: number, mode: string, yieldQuantity: number): number => {
  return mode === 'lote' ? totalCost / yieldQuantity : totalCost;
};

// Main ProductCard component used in the list
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onEdit, onRemove, onClick, isExpanded = false }, ref) => {
    const isProfit = product.production.profitMargin >= 0;

    return (
      <div
        ref={ref}
        onClick={() => onClick(product)}
        className={`group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl ${
          isExpanded ? 'invisible' : ''
        }`}
      >
        {/* Action buttons */}
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-indigo-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onRemove(product.uid);
            }}
            className="rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Mini Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-white">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
              {product.category}
            </span>
            {!isProfit && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Prejuízo
              </span>
            )}
          </div>
        </div>

        {/* Conteúdo Compacto */}
        <div className="p-5">
          {/* Margem de Lucro */}
          <div
            className={`mb-4 rounded-lg border-l-4 p-3 ${
              isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isProfit ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${isProfit ? 'text-green-800' : 'text-red-800'}`}
                >
                  Margem
                </span>
              </div>
              <div className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {product.production.profitMargin.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs text-slate-600">Custo</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {formatCurrency(product.production.totalCost)}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs text-slate-600">Venda</span>
              </div>
              <div className="text-lg font-bold text-indigo-600">
                {formatCurrency(product.production.sellingPrice)}
              </div>
            </div>
          </div>

          {/* Indicador de "Ver mais" */}
          <div className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
            <span>Ver detalhes completos</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

// Compact content for the modal when not fully expanded
export const CompactModalContent: React.FC<CompactModalContentProps> = ({ product }) => {
  const isProfit = product.production.profitMargin >= 0;

  return (
    <div className="space-y-4">
      {/* Margem de Lucro */}
      <div
        className={`rounded-lg border-l-4 p-3 ${
          isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isProfit ? 'text-green-800' : 'text-red-800'}`}>
              Margem
            </span>
          </div>
          <div className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {product.production.profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Calculator className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-600">Custo</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {formatCurrency(product.production.totalCost)}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-600">Venda</span>
          </div>
          <div className="text-lg font-bold text-indigo-600">
            {formatCurrency(product.production.sellingPrice)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Expanded content for the modal when fully expanded
export const ExpandedProductModal: React.FC<ExpandedProductModalProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const isProfit = product.production.profitMargin >= 0;
  const realProfitValue = product.production.sellingPrice - product.production.totalCost;
  const unitCost = calculateUnitCost(
    product.production.totalCost,
    product.production.mode,
    product.production.yieldQuantity
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'ingredients', label: 'Ingredientes', count: product.ingredients.length },
    { id: 'details', label: 'Detalhes' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {tab.count && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Destaque da Margem */}
          <div
            className={`rounded-lg border-l-4 p-4 ${
              isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  {isProfit ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${isProfit ? 'text-green-800' : 'text-red-800'}`}
                  >
                    Margem de lucro
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}
                >
                  {product.production.profitMargin.toFixed(1)}%
                </div>
                <div className={`mt-1 text-sm ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                  {isProfit ? 'Lucro' : 'Prejuízo'}: {formatCurrency(Math.abs(realProfitValue))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Métricas */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Custo total</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(product.production.totalCost)}
              </div>
              <span className="mt-1 text-sm text-slate-600">
                {formatCurrency(unitCost)} por unidade
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Preço de venda</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(product.production.sellingPrice)}
              </div>
              <span className="mt-1 text-sm text-slate-600">
                {formatCurrency(product.production.unitSellingPrice)} por unidade
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Relação Custo vs Venda</span>
              <span className="text-sm text-slate-600">
                {Math.min(100, (unitCost / product.production.unitSellingPrice) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isProfit ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(100, (unitCost / product.production.unitSellingPrice) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Info de Produção */}
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Informações de produção</span>
            </div>
            <div className="text-sm text-blue-800">
              {product.production.mode === 'lote' ? (
                <>
                  <strong>Produção em lote:</strong> {product.production.yieldQuantity} unidades por
                  lote
                </>
              ) : (
                <>
                  <strong>Produção individual:</strong> 1 unidade por lote
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ingredients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-slate-900">Composição do produto</span>
            </div>
            <span className="text-sm text-slate-600">
              {product.ingredients.length} ingredientes
            </span>
          </div>

          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-sm text-blue-900">
              <strong>Rendimento:</strong> {product.production.yieldQuantity} unidades por lote
            </div>
          </div>

          <div className="space-y-2">
            {product.ingredients.map((ing: Ingredient, index: number) => (
              <div
                key={ing.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{ing.name}</div>
                    <div className="text-sm text-slate-600">
                      {ing.totalQuantity} {ing.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">
                    {formatCurrency(ing.totalQuantity * ing.averageUnitPrice)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {formatCurrency(ing.averageUnitPrice)}/{ing.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between rounded-lg bg-indigo-600 p-3 text-white">
              <span className="font-medium">Total dos ingredientes</span>
              <span className="text-lg font-bold">
                {formatCurrency(
                  product.ingredients.reduce(
                    (acc: number, ing: Ingredient) =>
                      acc + ing.totalQuantity * ing.averageUnitPrice,
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
          <div>
            <h4 className="mb-3 font-medium text-slate-900">Informações do produto</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-600">ID do produto</label>
                <div className="rounded border border-slate-200 bg-slate-50 p-2 font-mono text-sm">
                  {product.uid}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">Categoria</label>
                <div className="flex items-center gap-2 p-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">{product.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-slate-900">Análise financeira detalhada</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 py-2">
                <span className="text-slate-600">Custo por ingrediente</span>
                <span className="font-medium">
                  {formatCurrency(
                    product.ingredients.reduce(
                      (acc: number, ing: Ingredient) =>
                        acc + ing.totalQuantity * ing.averageUnitPrice,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 py-2">
                <span className="text-slate-600">Custo total</span>
                <span className="font-medium">{formatCurrency(product.production.totalCost)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 py-2">
                <span className="text-slate-600">Preço de venda</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(product.production.sellingPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-medium">Resultado final</span>
                <span
                  className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isProfit ? '+' : ''}
                  {formatCurrency(realProfitValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
