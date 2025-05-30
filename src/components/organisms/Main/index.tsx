'use client';

import { ReactNode } from 'react';

type MainSectionProps = {
  children: ReactNode;
};

export default function MainSection({ children }: MainSectionProps) {
  return (
    <main className="outline-accent h-dvh min-h-dvh w-full px-4 outline-1 transition-all">
      {children}
    </main>
  );
}
