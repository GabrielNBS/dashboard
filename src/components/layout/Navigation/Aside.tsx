'use client';

import React from 'react';
import PrefetchLink from '@/components/ui/PrefetchLink';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../MainLayout';

import { LogOut } from 'lucide-react';
import LordIcon, { LordIconRef } from '@/components/ui/LordIcon';
import { useSettings } from '@/contexts/settings/SettingsContext';

interface MenuItemProps {
  label: string;
  href: string;
  icon: string | React.ComponentType<{ className?: string }>;
  lordIconSrc?: string;
  isActive: boolean;
  isExpanded: boolean;
}

function MenuItem({ label, href, icon, lordIconSrc, isActive, isExpanded }: MenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const iconRef = React.useRef<LordIconRef>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex w-full items-center"
        >
          {icon === 'lordicon' && lordIconSrc ? (
            <LordIcon
              ref={iconRef}
              src={lordIconSrc}
              width={20}
              height={20}
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
  {
    label: 'Logout',
    href: '/logout',
    icon: LogOut,
  },
];

export default function Aside() {
  const pathname = usePathname();
  const { isExpanded, setIsExpanded } = useSidebar();
  const { state } = useSettings();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Evita problemas de hidratação usando um fallback consistente
  const logoSrc = mounted && state.store.logo ? state.store.logo : 'https://placehold.co/150';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="bg-card fixed top-0 left-0 z-50 hidden h-dvh flex-col shadow-lg sm:flex"
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
          className="bg-accent overflow-hidden rounded-full"
        >
          <Image
            src={logoSrc}
            alt="Logo da empresa"
            width={48}
            height={48}
            className="h-full w-full object-cover"
            priority={false}
          />
        </motion.div>
      </div>

      {/* Separador */}
      <div className="border-border mx-4 border-t" />

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
                isExpanded={isExpanded}
              />
            );
          })}
        </ul>
      </nav>

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
