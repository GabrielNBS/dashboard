import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
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

interface ProductModalProps {
  product: ProductState | null;
  isOpen: boolean;
  onClose: () => void;
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

// Optimized ProductCard with improved hover UX
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onEdit, onRemove, onClick, isExpanded = false }, ref) => {
    const isProfit = product.production.profitMargin >= 0;

    return (
      <motion.div
        ref={ref}
        layoutId={`product-card-${product.uid}`}
        onClick={() => onClick(product)}
        className={`group relative cursor-pointer overflow-hidden bg-white shadow-md transition-shadow duration-200 hover:shadow-lg ${
          isExpanded ? 'invisible' : ''
        }`}
        initial={{ borderRadius: '0.75rem' }}
        animate={{ borderRadius: '0.75rem' }}
        whileHover={{
          scale: 1.02,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        }}
      >
        {/* Action buttons - Always visible on mobile/tablet, hover on desktop */}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-100 transition-opacity duration-200 sm:gap-2 md:opacity-0 md:group-hover:opacity-100">
          <motion.button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-indigo-600 sm:p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onRemove(product.uid);
            }}
            className="rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600 sm:p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </motion.button>
        </div>

        {/* Header */}
        <motion.div
          layoutId={`product-header-${product.uid}`}
          className="from-primary to-primary/90 bg-gradient-to-r px-4 py-3 sm:px-5 sm:py-4"
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 40,
            duration: 0.4,
          }}
        >
          <motion.h3
            layoutId={`product-title-${product.uid}`}
            className="mb-2 line-clamp-1 text-base font-bold text-white sm:text-lg"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
              duration: 0.4,
            }}
          >
            {product.name}
          </motion.h3>
          <motion.div
            layoutId={`product-badges-${product.uid}`}
            className="flex items-center gap-2"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
              duration: 0.4,
            }}
          >
            <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
              {product.category}
            </span>
            {!isProfit && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Prejuízo
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          layoutId={`product-content-${product.uid}`}
          className="p-4 sm:p-5"
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 40,
            duration: 0.4,
          }}
        >
          {/* Profit Margin */}
          <motion.div
            className={`mb-4 rounded-lg border-l-4 p-3 ${
              isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
            layoutId={`product-margin-${product.uid}`}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
              duration: 0.4,
            }}
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
              <div
                className={`text-xl font-bold sm:text-2xl ${isProfit ? 'text-green-600' : 'text-red-600'}`}
              >
                {product.production.profitMargin.toFixed(1)}%
              </div>
            </div>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            layoutId={`product-metrics-${product.uid}`}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
              duration: 0.4,
            }}
          >
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs text-slate-600">Custo</span>
              </div>
              <div className="text-base font-bold text-slate-900 sm:text-lg">
                {formatCurrency(product.production.totalCost)}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs text-slate-600">Venda</span>
              </div>
              <div className="text-base font-bold text-indigo-600 sm:text-lg">
                {formatCurrency(product.production.sellingPrice)}
              </div>
            </div>
          </motion.div>

          {/* See More Indicator - Always visible on mobile/tablet, hover on desktop */}
          <div className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
            <span className="block md:hidden">Toque para ver detalhes</span>
            <span className="hidden md:block">Clique para ver detalhes</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

// Optimized Modal Component
export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!product) return null;

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            layoutId={`product-card-${product.uid}`}
            className="fixed top-2 right-2 bottom-2 left-2 z-50 mx-auto max-w-4xl overflow-hidden bg-white shadow-2xl sm:top-4 sm:right-4 sm:bottom-4 sm:left-4 md:top-1/2 md:left-1/2 md:h-[90vh] md:w-[90vw] md:max-w-4xl md:-translate-x-1/2 md:-translate-y-1/2"
            style={{ borderRadius: 12 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35,
              duration: 0.5,
            }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <motion.div
                layoutId={`product-header-${product.uid}`}
                className="from-primary to-primary/90 relative bg-gradient-to-r px-4 py-4 sm:px-6 sm:py-6"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 40,
                  duration: 0.4,
                }}
              >
                {/* Close Button */}
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:top-4 sm:right-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                <motion.h2
                  layoutId={`product-title-${product.uid}`}
                  className="mb-3 pr-12 text-xl font-bold text-white sm:text-2xl"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 40,
                    duration: 0.4,
                  }}
                >
                  {product.name}
                </motion.h2>

                <motion.div
                  layoutId={`product-badges-${product.uid}`}
                  className="flex flex-wrap gap-2"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 40,
                    duration: 0.4,
                  }}
                >
                  <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                    <Tag className="mr-1.5 h-3.5 w-3.5" />
                    {product.category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                    <Package className="mr-1.5 h-3.5 w-3.5" />
                    {product.production.mode === 'lote' ? 'Lote' : 'Individual'}
                  </span>
                  {!isProfit && (
                    <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                      <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                      Prejuízo
                    </span>
                  )}
                </motion.div>
              </motion.div>

              {/* Content */}
              <motion.div
                className="flex-1 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {/* Tabs */}
                <div className="border-b border-slate-200 px-4 sm:px-6">
                  <div className="flex gap-1 overflow-x-auto sm:gap-2">
                    {tabs.map(tab => (
                      <motion.button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
                          activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="whitespace-nowrap">{tab.label}</span>
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
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'overview' && (
                        <OverviewTab
                          product={product}
                          isProfit={isProfit}
                          realProfitValue={realProfitValue}
                          unitCost={unitCost}
                        />
                      )}
                      {activeTab === 'ingredients' && <IngredientsTab product={product} />}
                      {activeTab === 'details' && (
                        <DetailsTab
                          product={product}
                          isProfit={isProfit}
                          realProfitValue={realProfitValue}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Optimized Tab Components
const OverviewTab: React.FC<{
  product: ProductState;
  isProfit: boolean;
  realProfitValue: number;
  unitCost: number;
}> = ({ product, isProfit, realProfitValue, unitCost }) => (
  <div className="space-y-6">
    {/* Profit Margin Highlight */}
    <motion.div
      layoutId={`product-margin-${product.uid}`}
      className={`rounded-lg border-l-4 p-4 ${
        isProfit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      }`}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 40,
        duration: 0.4,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isProfit ? 'text-green-800' : 'text-red-800'}`}>
              Margem de lucro
            </span>
          </div>
          <div className={`text-3xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {product.production.profitMargin.toFixed(1)}%
          </div>
          <div className={`mt-1 text-sm ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
            {isProfit ? 'Lucro' : 'Prejuízo'}: {formatCurrency(Math.abs(realProfitValue))}
          </div>
        </div>
      </div>
    </motion.div>

    {/* Metrics Grid */}
    <motion.div
      className="grid gap-4 sm:grid-cols-2"
      layoutId={`product-metrics-${product.uid}`}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 40,
        duration: 0.4,
      }}
    >
      <div className="rounded-lg bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Custo total</span>
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {formatCurrency(product.production.totalCost)}
        </div>
        <span className="mt-1 text-sm text-slate-600">{formatCurrency(unitCost)} por unidade</span>
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
    </motion.div>

    {/* Progress Bar */}
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Relação Custo vs Venda</span>
        <span className="text-sm text-slate-600">
          {Math.min(100, (unitCost / product.production.unitSellingPrice) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <motion.div
          className={`h-2 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(100, (unitCost / product.production.unitSellingPrice) * 100)}%`,
          }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>

    {/* Production Info */}
    <div className="rounded-lg bg-blue-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Package className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">Informações de produção</span>
      </div>
      <div className="text-sm text-blue-800">
        {product.production.mode === 'lote' ? (
          <>
            <strong>Produção em lote:</strong> {product.production.yieldQuantity} unidades por lote
          </>
        ) : (
          <>
            <strong>Produção individual:</strong> 1 unidade por lote
          </>
        )}
      </div>
    </div>
  </div>
);

const IngredientsTab: React.FC<{ product: ProductState }> = ({ product }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5 text-indigo-600" />
        <span className="font-medium text-slate-900">Composição do produto</span>
      </div>
      <span className="text-sm text-slate-600">{product.ingredients.length} ingredientes</span>
    </div>

    <div className="rounded-lg bg-blue-50 p-3">
      <div className="text-sm text-blue-900">
        <strong>Rendimento:</strong> {product.production.yieldQuantity} unidades por lote
      </div>
    </div>

    <div className="space-y-2">
      {product.ingredients.map((ing: Ingredient, index: number) => (
        <motion.div
          key={ing.id}
          className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
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
        </motion.div>
      ))}
    </div>

    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between rounded-lg bg-indigo-600 p-3 text-white">
        <span className="font-medium">Total dos ingredientes</span>
        <span className="text-lg font-bold">
          {formatCurrency(
            product.ingredients.reduce(
              (acc: number, ing: Ingredient) => acc + ing.totalQuantity * ing.averageUnitPrice,
              0
            )
          )}
        </span>
      </div>
    </div>
  </div>
);

const DetailsTab: React.FC<{
  product: ProductState;
  isProfit: boolean;
  realProfitValue: number;
}> = ({ product, isProfit, realProfitValue }) => (
  <div className="space-y-6">
    <div>
      <h4 className="mb-3 font-medium text-slate-900">Informações do produto</h4>
      <div className="grid gap-4 sm:grid-cols-2">
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
                (acc: number, ing: Ingredient) => acc + ing.totalQuantity * ing.averageUnitPrice,
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
          <span className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}
            {formatCurrency(realProfitValue)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default ProductCard;
