'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceMetrics {
  navigationStart: number;
  loadComplete: number;
  totalTime: number;
}

export function usePerformanceMonitor() {
  const pathname = usePathname();

  const measureNavigation = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics: PerformanceMetrics = {
          navigationStart: navigation.fetchStart,
          loadComplete: navigation.loadEventEnd,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
        };

        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 Navigation to ${pathname}:`, {
            'Total Time': `${metrics.totalTime.toFixed(2)}ms`,
            'DOM Content Loaded': `${(navigation.domContentLoadedEventEnd - navigation.fetchStart).toFixed(2)}ms`,
            'First Paint': navigation.responseStart
              ? `${(navigation.responseStart - navigation.fetchStart).toFixed(2)}ms`
              : 'N/A',
          });
        }

        return metrics;
      }
    }
    return null;
  }, [pathname]);

  const measureRouteChange = useCallback(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const routeChangeTime = endTime - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ Route change to ${pathname}: ${routeChangeTime.toFixed(2)}ms`);
      }

      return routeChangeTime;
    };
  }, [pathname]);

  useEffect(() => {
    // Medir performance da navegação inicial
    const timer = setTimeout(() => {
      measureNavigation();
    }, 100);

    return () => clearTimeout(timer);
  }, [measureNavigation]);

  // Medir Core Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 ${entry.name}:`, entry);
          }
        }
      });

      // Observar métricas importantes
      try {
        observer.observe({
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
        });
      } catch {
        // Fallback para navegadores que não suportam todas as métricas
        console.warn('Some performance metrics not supported');
      }

      return () => observer.disconnect();
    }
  }, []);

  return {
    measureNavigation,
    measureRouteChange,
  };
}
