'use client';

import type { ReactNode } from 'react';
import { IngredientProvider } from '@/contexts/Ingredients/IngredientsContext';
import { ProductBuilderProvider } from '@/contexts/products/ProductBuilderContext';
import { ProductProvider } from '@/contexts/products/ProductContext';
import { SalesProvider } from '@/contexts/sales/SalesContext';
import { SettingsProvider } from '@/contexts/settings/SettingsContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ToastProvider, ToastGlobalRegister } from '@/components/ui/feedback/use-toast';
import { TooltipProvider } from '@/components/ui/feedback/tooltip';
import { SidebarProvider } from '@/contexts/SidebarContext';

interface OptimizedProvidersProps {
  children: ReactNode;
}

export default function OptimizedProviders({ children }: OptimizedProvidersProps) {
  return (
    <ToastProvider>
      <TooltipProvider>
        <ToastGlobalRegister />
        <SidebarProvider>
          <IngredientProvider>
            <NotificationProvider>
              <ProductBuilderProvider>
                <ProductProvider>
                  <SalesProvider>
                    <SettingsProvider>{children}</SettingsProvider>
                  </SalesProvider>
                </ProductProvider>
              </ProductBuilderProvider>
            </NotificationProvider>
          </IngredientProvider>
        </SidebarProvider>
      </TooltipProvider>
    </ToastProvider>
  );
}
