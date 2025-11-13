import React, { useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Tag,
  AlertTriangle,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Package,
  ChevronRight,
} from 'lucide-react';
import { ProductState } from '@/types/products';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatCurrency = (value: number): string => currencyFormatter.format(value);

interface ProductCardProps {
  product: ProductState;
  onEdit: (product: ProductState) => void;
  onRemove: (productId: string) => void;
  onClick: (product: ProductState) => void;
  isExpanded?: boolean;
}

export const ProductCard = memo(
  React.forwardRef<HTMLDivElement, ProductCardProps>(
    ({ product, onEdit, onRemove, onClick, isExpanded = false }, ref) => {
      const isProfit = useMemo(
        () => product.production.profitMargin >= 0,
        [product.production.profitMargin]
      );

      const handleEdit = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          onEdit(product);
        },
        [onEdit, product]
      );

      const handleRemove = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          onRemove(product.uid);
        },
        [onRemove, product.uid]
      );

      const handleClick = useCallback(() => {
        onClick(product);
      }, [onClick, product]);

      return (
        <motion.div
          ref={ref}
          layoutId={`product-card-${product.uid}`}
          onClick={handleClick}
          className={`group relative cursor-pointer overflow-hidden bg-white shadow-md transition-shadow duration-200 hover:shadow-xl ${
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
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-100 transition-opacity duration-200 sm:gap-2 md:opacity-0 md:group-hover:opacity-100">
            <motion.button
              type="button"
              onClick={handleEdit}
              className="rounded-full bg-white/95 p-1.5 text-slate-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-indigo-600 sm:p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </motion.button>
            <motion.button
              type="button"
              onClick={handleRemove}
              className="rounded-full bg-white/95 p-1.5 text-slate-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600 sm:p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </motion.button>
          </div>

          {/* Image Section */}
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 sm:h-56">
            {product.image ? (
              <>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-slate-300" />
              </div>
            )}

            {/* Profit Badge on Image */}
            <div className="absolute bottom-3 left-3">
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md ${
                  isProfit ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}
              >
                {isProfit ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span className="text-sm font-bold">
                  {product.production.profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-900 sm:text-xl">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                <Tag className="mr-1 h-3 w-3" />
                {product.category}
              </span>
              {!isProfit && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Prejuízo
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-600">Custo</span>
                </div>
                <div className="text-base font-bold text-slate-900 sm:text-lg">
                  {formatCurrency(product.production.totalCost)}
                </div>
              </div>

              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 transition-colors hover:bg-indigo-100">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-xs font-medium text-indigo-700">
                    {product.production.mode === 'lote' ? 'Venda/Un.' : 'Venda'}
                  </span>
                </div>
                <div className="text-base font-bold text-indigo-700 sm:text-lg">
                  {formatCurrency(product.production.unitSellingPrice)}
                </div>
                {product.production.mode === 'lote' && (
                  <span className="text-xs text-indigo-600">
                    Lote: {formatCurrency(product.production.sellingPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
              <span className="block md:hidden">Toque para ver detalhes</span>
              <span className="hidden md:block">Clique para ver detalhes</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      );
    }
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.product.uid === nextProps.product.uid &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.product.production.profitMargin === nextProps.product.production.profitMargin &&
      prevProps.product.production.totalCost === nextProps.product.production.totalCost &&
      prevProps.product.production.unitSellingPrice === nextProps.product.production.unitSellingPrice
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
