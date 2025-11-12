'use client';

import { ReactNode, memo } from 'react';
import { IngredientProvider } from '@/contexts/Ingredients/IngredientsContext';
import { ProductBuilderProvider } from '@/contexts/products/ProductBuilderContext';
import { ProductProvider } from '@/contexts/products/ProductContext';
import { SalesProvider } from '@/contexts/sales/SalesContext';
import { SettingsProvider } from '@/contexts/settings/SettingsContext';

interface OptimizedProvidersProps {
  children: ReactNode;
}

const OptimizedProviders = memo(function OptimizedProviders({ children }: OptimizedProvidersProps) {
  return (
    <IngredientProvider>
      <ProductBuilderProvider>
        <ProductProvider>
          <SalesProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </SalesProvider>
        </ProductProvider>
      </ProductBuilderProvider>
    </IngredientProvider>
  );
});

export default OptimizedProviders;
