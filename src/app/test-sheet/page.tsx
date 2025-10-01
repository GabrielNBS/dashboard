'use client';

import { useState } from 'react';
import Button from '@/components/ui/base/Button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/feedback/sheet';

export default function TestSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Teste de Animações do Sheet</h1>

      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Sheet da Direita (padrão)</h2>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button>Abrir Sheet da Direita</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Sheet da Direita</SheetTitle>
                <SheetDescription>
                  Este sheet deve deslizar suavemente da direita para a esquerda.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p>Conteúdo do sheet...</p>
                <p>A animação deve ser suave, sem "blinkar".</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Sheet da Esquerda</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Abrir Sheet da Esquerda</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Sheet da Esquerda</SheetTitle>
                <SheetDescription>
                  Este sheet deve deslizar suavemente da esquerda para a direita.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p>Conteúdo do sheet...</p>
                <p>Teste a animação de entrada e saída.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Sheet de Baixo</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Abrir Sheet de Baixo</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Sheet de Baixo</SheetTitle>
                <SheetDescription>
                  Este sheet deve deslizar suavemente de baixo para cima.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p>Conteúdo do sheet...</p>
                <p>Perfeito para mobile!</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="bg-muted mt-8 rounded-lg p-4">
        <h3 className="mb-2 font-semibold">Como testar:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Clique nos botões para abrir os sheets</li>
          <li>Observe se a animação é suave (não deve "blinkar")</li>
          <li>Teste fechar clicando no X ou clicando fora</li>
          <li>Verifique se o overlay também tem fade suave</li>
        </ul>
      </div>
    </div>
  );
}
