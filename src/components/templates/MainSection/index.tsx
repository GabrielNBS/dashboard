'use client';

import { ReactNode } from 'react';

type MainSectionProps = {
  children: ReactNode;
};

export default function MainSection({ children }: MainSectionProps) {
  return (
    <main className="outline-accent p-4 pt-20 outline-1 transition-all sm:ml-52 sm:pt-8">
      {children}
    </main>
  );
}
