import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Tag,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  Calculator,
  DollarSign,
  PieChart,
  X,
} from 'lucide-react';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';
import ProductionButton from '@/components/features/production/ProductionButton';

// Formatter instance
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatCurrency = (value: number): string => currencyFormatter.format(value);

const calculateUnitCost = (totalCost: number, mode: string, yieldQuantity: number): number => {
  return mode === 'lote' ? totalCost / yieldQuantity : totalCost;
};

interface ProductModalProps {
  product: ProductState | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen]);

  const calculations = useMemo(() => {
    if (!product) return null;

    const isProfit = product.production.profitMargin >= 0;
    const realProfitValue = product.production.sellingPrice - product.production.totalCost;
    const unitCost = calculateUnitCost(
      product.production.totalCost,
      product.production.mode,
      product.production.yieldQuantity
    );

    return { isProfit, realProfitValue, unitCost };
  }, [product]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!product || !calculations) return null;

  const { isProfit, realProfitValue, unitCost } = calculations;

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'ingredients', label: 'Ingredientes', count: product.ingredients.length },
    { id: 'details', label: 'Detalhes' },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 z-50 mx-auto flex max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:inset-6 md:inset-8 lg:top-1/2 lg:left-1/2 lg:h-[85vh] lg:w-[90vw] lg:max-w-5xl lg:-translate-x-1/2 lg:-translate-y-1/2"
            style={{ borderRadius: 16 }}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <div className="flex h-full flex-col">
              {/* Image Header Section */}
              <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 sm:h-64">
                {product.image ? (
                  <>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 90vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-20 w-20 text-slate-300" />
                  </div>
                )}

                {/* Close Button */}
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-10 rounded-full bg-white/95 p-2 text-slate-700 shadow-lg backdrop-blur-sm transition-colors hover:bg-white sm:top-4 sm:right-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Title and Badges Overlay */}
                <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6">
                  <h2 className="mb-3 text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                    {product.name}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-indigo-700 backdrop-blur-sm">
                      <Tag className="mr-1.5 h-3.5 w-3.5" />
                      {product.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-slate-700 backdrop-blur-sm">
                      <Package className="mr-1.5 h-3.5 w-3.5" />
                      {product.production.mode === 'lote' ? 'Lote' : 'Individual'}
                    </span>
                    {!isProfit && (
                      <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                        <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                        Prejuízo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex-shrink-0 border-b border-slate-200 px-4 sm:px-6">
                  <div className="flex gap-1 overflow-x-auto sm:gap-2">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-all duration-150 sm:px-4 ${
                          activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
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
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        className="space-y-4"
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
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const OverviewTab = memo<{
  product: ProductState;
  isProfit: boolean;
  realProfitValue: number;
  unitCost: number;
}>(({ product, isProfit, realProfitValue, unitCost }) => (
  <div className="space-y-4">
    {/* Profit Margin Highlight */}
    <div
      className={`rounded-xl border-2 p-4 ${
        isProfit
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50'
          : 'border-red-200 bg-gradient-to-br from-red-50 to-red-100/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}>
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-white" />
            ) : (
              <TrendingDown className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <span className={`text-sm font-medium ${isProfit ? 'text-green-800' : 'text-red-800'}`}>
              Margem de lucro
            </span>
            <div className={`text-xs ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
              {isProfit ? 'Lucro de' : 'Prejuízo de'} {formatCurrency(Math.abs(realProfitValue))}
            </div>
          </div>
        </div>
        <div className={`text-3xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {product.production.profitMargin.toFixed(1)}%
        </div>
      </div>
    </div>

    {/* Metrics Grid */}
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-lg bg-slate-100 p-2">
            <Calculator className="h-4 w-4 text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-600">Custo total</span>
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {formatCurrency(product.production.totalCost)}
        </div>
        <span className="text-sm text-slate-500">{formatCurrency(unitCost)}/un.</span>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-lg bg-indigo-500 p-2">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-indigo-900">
            {product.production.mode === 'lote' ? 'Preço unitário' : 'Preço de venda'}
          </span>
        </div>
        <div className="text-2xl font-bold text-indigo-700">
          {formatCurrency(product.production.unitSellingPrice)}
        </div>
        {product.production.mode === 'lote' && (
          <span className="text-sm text-indigo-600">
            Lote: {formatCurrency(product.production.sellingPrice)}
          </span>
        )}
      </div>
    </div>

    {/* Progress Bar */}
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Relação Custo vs Venda</span>
        <span className="text-sm font-bold text-slate-900">
          {Math.min(100, (unitCost / product.production.unitSellingPrice) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className={`h-3 rounded-full ${isProfit ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(100, (unitCost / product.production.unitSellingPrice) * 100)}%`,
          }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>

    {/* Production Info */}
    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-500 p-2">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-medium text-blue-900">
            {product.production.mode === 'lote' ? 'Produção em lote' : 'Produção individual'}
          </div>
          <div className="text-xs text-blue-700">
            {product.production.mode === 'lote'
              ? `${product.production.yieldQuantity} unidades por lote`
              : '1 unidade por produção'}
          </div>
        </div>
      </div>
    </div>

    {/* Production Button for Batch Products */}
    {product.production.mode === 'lote' && (
      <div className="border-t border-slate-200 pt-4">
        <ProductionButton product={product} />
      </div>
    )}
  </div>
));

OverviewTab.displayName = 'OverviewTab';

const IngredientsTab = memo<{ product: ProductState }>(({ product }) => {
  const totalIngredientsValue = useMemo(
    () =>
      product.ingredients.reduce(
        (acc: number, ing: Ingredient) => acc + ing.totalQuantity * ing.averageUnitPrice,
        0
      ),
    [product.ingredients]
  );

  return (
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
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.2,
              delay: index * 0.03,
              ease: 'easeOut'
            }}
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
          <span className="text-lg font-bold">{formatCurrency(totalIngredientsValue)}</span>
        </div>
      </div>
    </div>
  );
});

IngredientsTab.displayName = 'IngredientsTab';

const DetailsTab = memo<{
  product: ProductState;
  isProfit: boolean;
  realProfitValue: number;
}>(({ product, isProfit, realProfitValue }) => {
  const totalIngredientsValue = useMemo(
    () =>
      product.ingredients.reduce(
        (acc: number, ing: Ingredient) => acc + ing.totalQuantity * ing.averageUnitPrice,
        0
      ),
    [product.ingredients]
  );

  return (
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
            <span className="font-medium">{formatCurrency(totalIngredientsValue)}</span>
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
});

DetailsTab.displayName = 'DetailsTab';
