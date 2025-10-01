'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ScanBarcode, ShoppingCart, MoreHorizontal } from 'lucide-react';

const mainNavItems = [
  { label: 'Início', href: '/', icon: Home },
  { label: 'Estoque', href: '/store', icon: Package },
  { label: 'Produto', href: '/product', icon: ScanBarcode },
  { label: 'PDV', href: '/pdv', icon: ShoppingCart },
  { label: 'Mais', href: '/more', icon: MoreHorizontal },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white sm:hidden">
      <div className="grid grid-cols-5">
        {mainNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center px-1 py-2 transition-colors ${
                isActive ? 'text-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`mb-1 h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
