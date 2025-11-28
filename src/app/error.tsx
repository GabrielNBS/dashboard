'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/base/Button';
import LordIcon from '@/components/ui/LordIcon';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="bg-destructive/10 mb-8 rounded-full p-8">
        <LordIcon
          src="https://cdn.lordicon.com/tdrtiskw.json" // Icone de alerta/erro
          width={120}
          height={120}
          isActive={true}
          colors={{
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--destructive))',
          }}
        />
      </div>

      <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Algo deu errado!
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Encontramos um erro inesperado. Tente recarregar a página ou voltar para o início.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset} className="w-full sm:w-auto">
          Tentar Novamente
        </Button>

        <Link href="/">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Voltar ao Início
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="text-muted-foreground mt-8 font-mono text-xs">
          Código do erro: {error.digest}
        </p>
      )}
    </div>
  );
}
