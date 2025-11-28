'use client';

import React, { useState, useRef, useEffect } from 'react';
import PrefetchLink from '@/components/ui/PrefetchLink';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../MainLayout';

import LordIcon, { LordIconRef } from '@/components/ui/LordIcon';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import DeveloperTag from './DeveloperTag';

interface MenuItemProps {
  label: string;
  href: string;
  icon: string | React.ComponentType<{ className?: string }>;
  lordIconSrc?: string;
  isActive: boolean;
  isHovered: boolean;
  isExpanded: boolean;
  badgeAlert?: boolean;
}

function MenuItem({
  label,
  href,
  icon,
  lordIconSrc,
  isActive,
  isHovered,
  isExpanded,
  badgeAlert,
}: MenuItemProps) {
  const iconRef = useRef<LordIconRef>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <li className="relative">
      <PrefetchLink
        href={href}
        className={`group/item relative flex items-center rounded-lg px-3 py-3 font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground hover:bg-muted hover:text-foreground'
        }`}
        prefetch={true}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Navegar para ${label}`}
      >
        <div className="flex w-full items-center">
          <div className="relative">
            {icon === 'lordicon' && lordIconSrc ? (
              <LordIcon
                ref={iconRef}
                src={lordIconSrc}
                width={24}
                height={24}
                className="flex-shrink-0"
                isActive={isActive}
                isHovered={isHovered}
              />
            ) : (
              typeof icon !== 'string' &&
              (() => {
                const IconComponent = icon as React.ComponentType<{ className?: string }>;
                return (
                  <IconComponent
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground group-hover/item:text-foreground'
                    }`}
                  />
                );
              })()
            )}

            {/* Badge de alerta */}
            {badgeAlert && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ring-card absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2"
                aria-label="Alerta de estoque crítico"
              />
            )}
          </div>

          <motion.span
            initial={false}
            animate={{
              opacity: isExpanded ? 1 : 0,
              x: isExpanded ? 0 : -10,
              width: isExpanded ? 'auto' : 0,
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="ml-3 overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        </div>
      </PrefetchLink>

      {/* Tooltip para quando colapsado */}
      <div
        className={`pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 transition-opacity duration-200 ${
          isExpanded ? 'opacity-0' : 'opacity-0 group-hover/item:opacity-100'
        }`}
      >
        <div className="bg-popover text-popover-foreground rounded-md px-3 py-2 text-sm whitespace-nowrap shadow-lg">
          {label}
          <div className="border-r-popover absolute top-1/2 left-0 -ml-1 -translate-y-1/2 border-4 border-transparent" />
        </div>
      </div>
    </li>
  );
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: 'lordicon',
    lordIconSrc: 'https://cdn.lordicon.com/ewtxwele.json',
  },
  {
    label: 'Estoque',
    href: '/store',
    icon: 'lordicon',
    lordIconSrc: 'https://cdn.lordicon.com/ysoasulr.json',
  },
  {
    label: 'Produto',
    href: '/product',
    icon: 'lordicon',
    lordIconSrc: 'https://cdn.lordicon.com/uomkwtjh.json',
  },
  {
    label: 'PDV',
    href: '/pdv',
    icon: 'lordicon',
    lordIconSrc: 'https://cdn.lordicon.com/pbrgppbb.json',
  },
  {
    label: 'Financeiro',
    href: '/finance',
    icon: 'lordicon',
    lordIconSrc: 'https://cdn.lordicon.com/kwnsnjyg.json',
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: 'lordicon',
    lordIconSrc: 'https://cdn.lordicon.com/umuwriak.json',
  },
];

{
  /* Nao implementado
{
    label: 'Logout',
    href: '/logout',
    icon: LogOut,
  },

 */
}

export default function Aside() {
  const pathname = usePathname();
  const { isExpanded, setIsExpanded } = useSidebar();
  const { state } = useSettings();
  const { state: ingredientState } = useIngredientContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // fallback para evitar hydratation
  const logoSrc = mounted && state.store.logo ? state.store.logo : '/icon.svg';

  // Verifica se há ingredientes com estoque crítico (zerado ou abaixo de 20% do máximo)
  // O badge só aparece quando NÃO estiver na página de estoque
  const hasCriticalStock = React.useMemo(() => {
    const isOnStorePage = pathname === '/store';
    if (isOnStorePage) return false;

    return ingredientState.ingredients.some(ingredient => {
      const criticalThreshold = ingredient.maxQuantity * 0.2;
      return ingredient.totalQuantity === 0 || ingredient.totalQuantity <= criticalThreshold;
    });
  }, [ingredientState.ingredients, pathname]);

  const [imgError, setImgError] = useState(false);
  const fallbackSrc = 'https://cdn.lordicon.com/spzqjmbt.json';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="bg-card fixed top-0 left-0 z-50 hidden h-dvh flex-col shadow-lg lg:flex"
      role="navigation"
      aria-label="Navegação principal"
      id="main-navigation"
    >
      {/* Header com Avatar */}
      <div className="flex h-20 items-center justify-center">
        <motion.div
          animate={{
            width: isExpanded ? 48 : 40,
            height: isExpanded ? 48 : 40,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-muted overflow-hidden rounded-full"
        >
          {imgError || !logoSrc || logoSrc.endsWith('.json') || fallbackSrc.endsWith('.json') ? (
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
              src={logoSrc}
              alt="Logo da empresa"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority={false}
              onError={() => setImgError(true)}
            />
          )}
        </motion.div>
      </div>

      {/* Separador */}
      <div className="border-border mx-4 border-t" />

      {/* Menu Itens */}
      <nav className="flex-1 overflow-hidden px-2 py-4" aria-label="Menu principal">
        <ul className="space-y-2" role="list">
          {menuItems.map(item => {
            const { label, href, icon, lordIconSrc } = item;
            const isActive = pathname === href;

            return (
              <MenuItem
                key={href}
                label={label}
                href={href}
                icon={icon}
                lordIconSrc={lordIconSrc}
                isActive={isActive}
                isHovered={false}
                isExpanded={isExpanded}
                badgeAlert={label === 'Estoque' && hasCriticalStock}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navegar para ${label}`}
              />
            );
          })}
        </ul>
      </nav>

      {/* Developer Tag */}
      <div className="px-2 pb-2">
        <DeveloperTag isExpanded={isExpanded} />
      </div>

      {/* Indicador visual de expansão */}
      <div className="flex h-12 items-center justify-center">
        <motion.div
          animate={{ width: isExpanded ? 48 : 16 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-muted h-1 rounded-full"
        />
      </div>
    </motion.aside>
  );
}
