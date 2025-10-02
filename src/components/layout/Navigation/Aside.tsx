'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../MainLayout';

import { LogOut } from 'lucide-react';
import LordIcon, { LordIconRef } from '@/components/ui/LordIcon';

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
      <Link
        href={href}
        className={`group/item relative flex items-center rounded-lg px-3 py-3 font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
                  isActive ? 'text-white' : 'text-gray-500 group-hover/item:text-gray-700'
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
      </Link>

      {/* Tooltip para quando colapsado */}
      <div
        className={`pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 transition-opacity duration-200 ${
          isExpanded ? 'opacity-0' : 'opacity-0 group-hover/item:opacity-100'
        }`}
      >
        <div className="rounded-md bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg">
          {label}
          <div className="absolute top-1/2 left-0 -ml-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
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

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed top-0 left-0 z-50 hidden h-dvh flex-col bg-white shadow-lg sm:flex"
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
            src="https://placehold.co/150"
            alt="Avatar do usuário"
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      {/* Separador */}
      <div className="mx-4 border-t border-gray-200" />

      {/* Menu de Navegação */}
      <nav className="flex-1 overflow-hidden px-2 py-4">
        <ul className="space-y-2">
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
          className="h-1 rounded-full bg-gray-300"
        />
      </div>
    </motion.aside>
  );
}
