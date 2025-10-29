'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

interface UsePrefetchOptions {
  routes?: string[];
  delay?: number;
  priority?: 'high' | 'low';
}

export function usePrefetch(options: UsePrefetchOptions = {}) {
  const router = useRouter();
  const { routes = [], delay = 100, priority = 'low' } = options;

  const prefetchRoute = useCallback(
    (route: string) => {
      if (priority === 'high') {
        router.prefetch(route);
      } else {
        // Prefetch com delay para não bloquear a thread principal
        setTimeout(() => {
          router.prefetch(route);
        }, delay);
      }
    },
    [router, delay, priority]
  );

  const prefetchRoutes = useCallback(
    (routesToPrefetch: string[]) => {
      routesToPrefetch.forEach((route, index) => {
        setTimeout(
          () => {
            router.prefetch(route);
          },
          delay * (index + 1)
        );
      });
    },
    [router, delay]
  );

  // Prefetch automático das rotas fornecidas
  useEffect(() => {
    if (routes.length > 0) {
      prefetchRoutes(routes);
    }
  }, [routes, prefetchRoutes]);

  return {
    prefetchRoute,
    prefetchRoutes,
  };
}

// Hook para prefetch baseado na rota atual
export function useSmartPrefetch() {
  const router = useRouter();

  const getRelatedRoutes = useCallback((currentPath: string): string[] => {
    const routeMap: Record<string, string[]> = {
      '/': ['/store', '/product', '/finance', '/pdv'],
      '/store': ['/product', '/finance'],
      '/product': ['/store', '/pdv'],
      '/finance': ['/store', '/product'],
      '/pdv': ['/product', '/store'],
      '/settings': ['/store', '/product'],
    };

    return routeMap[currentPath] || [];
  }, []);

  const prefetchRelatedRoutes = useCallback(
    (currentPath: string) => {
      const relatedRoutes = getRelatedRoutes(currentPath);
      relatedRoutes.forEach((route, index) => {
        setTimeout(
          () => {
            router.prefetch(route);
          },
          50 * (index + 1)
        ); // Stagger prefetch calls
      });
    },
    [router, getRelatedRoutes]
  );

  return {
    prefetchRelatedRoutes,
    getRelatedRoutes,
  };
}
