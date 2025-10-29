'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SmoothPageWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function SmoothPageWrapper({ children, fallback }: SmoothPageWrapperProps) {
  const pathname = usePathname();
  const [isContentReady, setIsContentReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Reset states quando a rota muda
    setIsContentReady(false);
    setShowContent(false);

    // Simula o tempo de carregamento do conteúdo
    const contentTimer = setTimeout(() => {
      setIsContentReady(true);
    }, 100); // Tempo para o conteúdo estar pronto

    // Mostra o conteúdo após estar pronto
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 150);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(showTimer);
    };
  }, [pathname]);

  return (
    <div className="relative h-full w-full">
      {/* Skeleton/Fallback - aparece imediatamente */}
      {!showContent && fallback && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showContent ? 0 : 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {fallback}
        </motion.div>
      )}

      {/* Conteúdo real - aparece quando pronto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut', delay: showContent ? 0.1 : 0 }}
        className="h-full w-full"
        style={{
          pointerEvents: showContent ? 'auto' : 'none',
          position: showContent ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
