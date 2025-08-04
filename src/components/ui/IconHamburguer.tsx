'use client';

import { motion } from 'framer-motion';

/**
 * Props do componente IconHamburger
 */
type Props = {
  /** Se o menu está aberto */
  isOpen: boolean;
  /** Função chamada ao clicar no ícone */
  onClick: () => void;
};

/**
 * Componente IconHamburger - Ícone de menu hambúrguer animado
 *
 * Exibe um ícone de menu que se transforma em X quando aberto,
 * com animações suaves usando Framer Motion.
 *
 * @param isOpen - Se o menu está aberto
 * @param onClick - Função chamada ao clicar no ícone
 *
 * @example
 * <IconHamburger isOpen={menuOpen} onClick={toggleMenu} />
 */
export default function IconHamburger({ isOpen, onClick }: Props) {
  return (
    <motion.button
      className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[6px] p-1"
      onClick={onClick}
      aria-label="Toggle menu"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      {/* Linha superior do hambúrguer */}
      <motion.span
        className="bg-base h-0.5 w-6"
        variants={{
          open: { rotate: 45, y: 9 },
          closed: { rotate: 0, y: 0 },
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Linha do meio do hambúrguer */}
      <motion.span
        className="bg-base h-0.5 w-6"
        variants={{
          open: { opacity: 0 },
          closed: { opacity: 1 },
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Linha inferior do hambúrguer */}
      <motion.span
        className="bg-base h-0.5 w-6"
        variants={{
          open: { rotate: -45, y: -6 },
          closed: { rotate: 0, y: 0 },
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
