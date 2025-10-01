'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Package,
  ScanBarcode,
  ShoppingCart,
  BadgeDollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Estoque', href: '/store', icon: Package },
  { label: 'Produto', href: '/product', icon: ScanBarcode },
  { label: 'PDV', href: '/pdv', icon: ShoppingCart },
  { label: 'Financeiro', href: '/finance', icon: BadgeDollarSign },
  { label: 'Configurações', href: '/settings', icon: Settings },
  { label: 'Logout', href: '/logout', icon: LogOut },
];

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Encontrar a página atual para mostrar no header
  const currentPage = menuItems.find(item => item.href === pathname);
  const pageTitle = currentPage?.label || 'Kiro';

  return (
    <>
      {/* Header fixo no topo */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="rounded-lg p-1.5 transition-colors hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg p-1.5 transition-colors hover:bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </button>
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
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={closeMenu}
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
            className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl sm:hidden"
          >
            {/* Header do menu */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm">
                  <span className="text-lg font-bold text-white">K</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Kiro</h2>
                  <p className="text-xs text-gray-500">Sistema de Gestão</p>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Lista de navegação */}
            <div className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-1 px-3">
                {menuItems.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;

                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto h-2 w-2 rounded-full bg-white/80"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Footer do menu */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">Usuário</p>
                  <p className="truncate text-xs text-gray-500">user@example.com</p>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Spacer para compensar o header fixo */}
      <div className="h-14 sm:hidden" />
    </>
  );
}
