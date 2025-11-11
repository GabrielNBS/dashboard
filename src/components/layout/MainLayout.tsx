'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Aside from './Navigation/Aside';
import MobileHeader from './Headers/MobileHeader';
import { useSmartPrefetch } from '@/hooks/ui/usePrefetch';
import ResourcePreloader from '@/components/ui/ResourcePreloader';
import { usePerformanceMonitor } from '@/hooks/ui/usePerformanceMonitor';

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { prefetchRelatedRoutes } = useSmartPrefetch();
  const { measureRouteChange } = usePerformanceMonitor();

  // Prefetch inteligente baseado na rota atual
  useEffect(() => {
    const endMeasurement = measureRouteChange();

    const timer = setTimeout(() => {
      prefetchRelatedRoutes(pathname);
      endMeasurement(); // Finaliza a medição da mudança de rota
    }, 100); // Pequeno delay para não interferir no carregamento inicial

    return () => clearTimeout(timer);
  }, [pathname, prefetchRelatedRoutes, measureRouteChange]);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <ResourcePreloader />
      <div className="bg-muted/30 min-h-dvh antialiased">
        <MobileHeader />
        <Aside />
        <main
          id="main-content"
          className="min-h-dvh w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24"
          role="main"
          aria-label="Conteúdo principal"
        >
          <div className="mx-auto max-w-none">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
