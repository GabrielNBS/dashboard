'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/base/Button';
import Image from 'next/image';
import {
  Home,
  Package,
  ScanBarcode,
  ShoppingCart,
  BadgeDollarSign,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import DeveloperTag from '../Navigation/DeveloperTag';
import { useSidebar } from '../MainLayout';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import LordIcon from '@/components/ui/LordIcon';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Estoque', href: '/store', icon: Package },
  { label: 'Produto', href: '/product', icon: ScanBarcode },
  { label: 'PDV', href: '/pdv', icon: ShoppingCart },
  { label: 'Financeiro', href: '/finance', icon: BadgeDollarSign },
  { label: 'Configurações', href: '/settings', icon: Settings },
];

{
  /* Nao implementado 
    { label: 'Logout', href: '/logout', icon: LogOut },
  */
}

export default function MobileHeader() {
  const { isMobileMenuOpen: isMenuOpen, setIsMobileMenuOpen: setIsMenuOpen } = useSidebar();
  const { state } = useSettings();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Encontrar a página atual para mostrar no header
  const currentPage = menuItems.find(item => item.href === pathname);
  const pageTitle = currentPage?.label || 'Regula';

  const [imgError, setImgError] = useState(false);
  const fallbackSrc = 'https://cdn.lordicon.com/spzqjmbt.json';

  return (
    <>
      {/* Header fixo no topo */}
      <header className="border-border bg-background/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="sm"
              className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="text-foreground h-5 w-5" aria-hidden="true" />
            </Button>
            <h1 className="text-foreground text-lg font-semibold">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDropdown />
          </div>
        </div>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Menu lateral */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-card fixed top-0 left-0 z-50 flex h-full w-72 flex-col shadow-2xl lg:hidden"
            id="mobile-navigation"
            role="navigation"
            aria-label="Navegação móvel"
          >
            {/* Header do menu */}
            <div className="border-border flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm">
                  <span className="text-primary-foreground text-lg font-bold">R</span>
                </div>
                <div>
                  <h2 className="text-foreground text-lg font-bold">Regula</h2>
                  <p className="text-muted-foreground text-xs">Sistema de Gestão</p>
                </div>
              </div>
              <Button
                onClick={closeMenu}
                variant="ghost"
                size="sm"
                className="hover:bg-muted rounded-lg p-2 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="text-muted-foreground h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Lista de navegação */}
            <div className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-1 px-3" role="list">
                {menuItems.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;

                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-muted active:bg-muted/80'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={`Navegar para ${label}`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <span>{label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="bg-primary-foreground/80 ml-auto h-2 w-2 rounded-full"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* User Info - Moved from footer */}
              <div className="px-3 pb-4">
                <div className="bg-muted flex items-center gap-3 rounded-xl px-3 py-3">
                  <div className="bg-muted h-12 w-12 overflow-hidden rounded-full">
                    {imgError ||
                    !state.store.logo ||
                    state.store.logo.endsWith('.json') ||
                    fallbackSrc.endsWith('.json') ? (
                      <div className="flex h-full w-full items-center justify-center p-1">
                        <LordIcon
                          src={fallbackSrc}
                          width={48}
                          height={48}
                          colors={{
                            primary: 'hsl(var(--primary))',
                            secondary: 'hsl(var(--muted-foreground))',
                          }}
                        />
                      </div>
                    ) : (
                      <Image
                        src={state.store.logo}
                        alt="Logo da empresa"
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        priority={false}
                        unoptimized
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {state.store.storeName || 'Usuário'}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {state.store.email || 'email@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer do menu */}
            <div className="border-border border-t p-4">
              <DeveloperTag isExpanded={true} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Spacer para compensar o header fixo */}
      <div className="h-14 lg:hidden" />
    </>
  );
}
