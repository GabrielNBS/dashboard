'use client';
import { useEffect, useState } from 'react';
import { ProductState } from '@/types/products';
import { Ingredient } from '@/types/ingredients';
import ProductCatalogMobile from './ProductCatalogMobile';
import ProductCatalog from './ProductCatalog';

interface UnifiedCartItem {
  uid: string;
  quantity: number;
  saleMode?: 'unit' | 'batch';
}

interface Props {
  products: ProductState[];
  cart: UnifiedCartItem[];
  availableIngredients: Ingredient[];
  onAddToCart: (uid: string, quantity?: number, saleMode?: 'unit' | 'batch') => void;
  canMakeProduct: (productUid: string, quantity: number) => boolean;
}

export default function UnifiedProductCatalog(props: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile ? <ProductCatalogMobile {...props} /> : <ProductCatalog {...props} />;
}
