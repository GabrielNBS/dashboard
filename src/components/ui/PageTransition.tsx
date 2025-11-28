'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.15, // Transição mais rápida e suave
} as const;

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
