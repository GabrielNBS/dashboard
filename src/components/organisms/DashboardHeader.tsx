'use client';

import { useState } from 'react';
import IconHamburger from '@/components/atoms/IconHamburguer';
import NavMenu from '@/components/molecules/NavMenu';

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleStateMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-primary relative mt-2 ml-2 flex h-12 w-12 items-center justify-center rounded-full py-2 text-base sm:hidden">
      <IconHamburger isOpen={isMenuOpen} onClick={toggleStateMenu} />
      <NavMenu isVisible={isMenuOpen} />
    </header>
  );
}
