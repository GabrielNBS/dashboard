'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardAside() {
  const optionsMenu = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Logout', href: '/logout' },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="hidden sm:fixed sm:top-0 sm:left-0 sm:flex sm:h-screen sm:w-64 sm:flex-col sm:bg-white sm:p-6 sm:shadow-md"
    >
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Menu</h2>
      <ul className="space-y-3">
        {optionsMenu.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
