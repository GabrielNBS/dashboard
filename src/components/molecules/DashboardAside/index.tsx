'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { Home, BadgeDollarSign, ScanBarcode, Package, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function DashboardAside() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Estoque', href: '/estoque', icon: Package },
    { label: 'Financeiro', href: '/financeiro', icon: BadgeDollarSign },
    { label: 'Produto', href: '/produto', icon: ScanBarcode },
    { label: 'Logout', href: '/logout', icon: LogOut },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="hidden sm:fixed sm:top-0 sm:left-0 sm:flex sm:h-screen sm:w-48 sm:flex-col sm:bg-white sm:p-6 sm:shadow-md"
    >
      <div className="mb-6 flex items-center justify-center">
        <div className="bg-accent h-16 w-16 rounded-full">
          <Image
            src={'https://source.unsplash.com/random/800x600'}
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
                'flex items-center gap-3 rounded-md px-4 py-2 font-medium transition-colors',
                pathname === href ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-800" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
