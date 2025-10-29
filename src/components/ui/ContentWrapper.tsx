'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ContentWrapperProps {
  children: ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Pequeno delay para permitir que o skeleton apareça primeiro
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Tempo suficiente para o skeleton aparecer

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        minHeight: '100vh',
        transitionDelay: isVisible ? '50ms' : '0ms',
      }}
    >
      {children}
    </div>
  );
}
