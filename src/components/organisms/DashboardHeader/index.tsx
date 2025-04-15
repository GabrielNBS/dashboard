'use client';

import { useState } from 'react';
import IconHamburger from '@/components/atoms/IconHamburger';
import NavMenu from '@/components/molecules/NavMenu';

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-primary relative mt-2 ml-2 flex h-12 w-12 items-center justify-center rounded-full py-2 text-base">
      <IconHamburger onClick={toggleMenu}>
        <span>{isMenuOpen ? 'x' : '☰'}</span>
      </IconHamburger>
      <NavMenu isVisible={isMenuOpen} />
    </header>
  );
}
