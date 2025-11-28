'use client';

import Link from 'next/link';
import Button from '@/components/ui/base/Button';
import LordIcon from '@/components/ui/LordIcon';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="bg-muted/30 mb-8 rounded-full p-8">
        <LordIcon
          src="https://cdn.lordicon.com/usownftb.json" // Icone de pergunta/busca
          width={120}
          height={120}
          isActive={true}
          colors={{
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--muted-foreground))',
          }}
        />
      </div>

      <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Página não encontrada
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido
        movida ou excluída.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Voltar ao Início
          </Button>
        </Link>

        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
