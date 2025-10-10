'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Aside from './Navigation/Aside';
import MobileHeader from './Headers/MobileHeader';

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

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="min-h-dvh bg-gray-50/30 antialiased">
        {/* Header mobile para dispositivos pequenos */}
        <MobileHeader />

        {/* Sidebar com navegação colapsável */}
        <Aside />

        {/* Área principal de conteúdo que se adapta ao sidebar */}
        <main className="min-h-dvh w-full px-24">
          <div className="mx-auto max-w-none">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
