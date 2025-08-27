'use client';

import { useState } from 'react';
import IconHamburger from '@/components/ui/IconHamburguer';
import NavMenu from '@/components/dashboard/home/NavMenu';

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleStateMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-primary text-hero-base relative mt-2 ml-2 flex h-12 w-12 items-center justify-center rounded-full py-2 sm:hidden">
      <IconHamburger isOpen={isMenuOpen} onClick={toggleStateMenu} />
      <NavMenu isVisible={isMenuOpen} />
    </header>
  );
}
