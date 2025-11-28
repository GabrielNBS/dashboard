'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/base/Button';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="bg-destructive/10 mb-8 rounded-full p-8">
            {/* Fallback icon since LordIcon might not load if JS fails critically */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-destructive h-16 w-16"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>

          <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Erro Crítico
          </h1>

          <p className="text-muted-foreground mb-8 max-w-md text-lg">
            Ocorreu um erro grave que impediu o carregamento da aplicação.
          </p>

          <Button size="lg" onClick={reset}>
            Tentar Novamente
          </Button>

          {error.digest && (
            <p className="text-muted-foreground mt-8 font-mono text-xs">
              Código do erro: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
