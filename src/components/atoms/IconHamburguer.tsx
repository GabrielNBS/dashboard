'use client';

import { motion } from 'framer-motion';

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export default function IconHamburger({ isOpen, onClick }: Props) {
  return (
    <motion.button
      className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[6px] p-1"
      onClick={onClick}
      aria-label="Toggle menu"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      <motion.span
        className="bg-base h-0.5 w-6"
        variants={{
          open: { rotate: 45, y: 9 },
          closed: { rotate: 0, y: 0 },
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="bg-base h-0.5 w-6"
        variants={{
          open: { opacity: 0 },
          closed: { opacity: 1 },
        }}
        transition={{ duration: 0.2 }}
      />
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
