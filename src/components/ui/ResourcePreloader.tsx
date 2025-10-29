'use client';

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  resources?: string[];
}

export default function ResourcePreloader({ resources = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload de recursos críticos
    const defaultResources = [
      // Fontes críticas
      '/fonts/inter-var.woff2',
      // Ícones críticos
      'https://cdn.lordicon.com/ewtxwele.json', // Dashboard
      'https://cdn.lordicon.com/ysoasulr.json', // Store
      'https://cdn.lordicon.com/uomkwtjh.json', // Product
      // Imagens críticas
      '/icon-192x192.png',
    ];

    const allResources = [...defaultResources, ...resources];

    allResources.forEach(resource => {
      const link = document.createElement('link');

      if (resource.endsWith('.woff2') || resource.endsWith('.woff')) {
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (resource.endsWith('.json')) {
        link.rel = 'prefetch';
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
      } else if (
        resource.endsWith('.png') ||
        resource.endsWith('.jpg') ||
        resource.endsWith('.webp')
      ) {
        link.rel = 'preload';
        link.as = 'image';
      } else {
        link.rel = 'prefetch';
      }

      link.href = resource;
      document.head.appendChild(link);
    });

    // Cleanup function para remover links quando o componente for desmontado
    return () => {
      allResources.forEach(resource => {
        const existingLink = document.querySelector(`link[href="${resource}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      });
    };
  }, [resources]);

  return null; // Este componente não renderiza nada visível
}
