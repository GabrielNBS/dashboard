'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import {
  Home,
  BadgeDollarSign,
  ScanBarcode,
  Package,
  LogOut,
  ShoppingCart,
  Settings,
} from 'lucide-react';

export default function Aside() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: Home },
    { label: 'Estoque', href: '/store', icon: Package },
    { label: 'Produto', href: '/product', icon: ScanBarcode },
    { label: 'PDV', href: '/pdv', icon: ShoppingCart },
    { label: 'Financeiro', href: '/finance', icon: BadgeDollarSign },
    { label: 'Configurações', href: '/settings', icon: Settings },
    { label: 'Logout', href: '/logout', icon: LogOut },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="hidden sm:top-0 sm:flex sm:h-dvh sm:flex-col sm:bg-white sm:p-6 sm:shadow-md"
    >
      <div className="mb-6 flex items-center justify-center">
        <div className="bg-accent h-16 w-16 overflow-hidden rounded-full">
          <img
            className=""
            src={'https://placehold.co/150'}
            alt="random image"
            width={64}
            height={64}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {menuItems.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-md px-2 py-2 font-medium transition-colors',
                pathname === href ? 'bg-primary text-white' : 'text-paragraph hover:bg-gray-100'
              )}
            >
              <Icon className="text-hero-gray-500 group-hover:text-paragraph h-5 w-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
