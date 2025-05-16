'use client';

import { ReactNode } from 'react';

type MainSectionProps = {
  children: ReactNode;
};

export default function MainSection({ children }: MainSectionProps) {
  return (
    <main className="outline-accent sm:p-default h-dvh px-4 outline-1 transition-all">
      {children}
    </main>
  );
}
