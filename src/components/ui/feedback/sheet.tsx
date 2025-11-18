'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { XIcon } from 'lucide-react';
import { cn } from '@/utils/utils'; // Assumindo que 'cn' é importado daqui

// 1. Definição do Componente Sheet (Drawer.Root)
interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="right">
      {children}
    </Drawer.Root>
  );
}

// 2. Componentes de Controle
function SheetTrigger({ className, ...props }: React.ComponentProps<typeof Drawer.Trigger>) {
  return <Drawer.Trigger className={className} {...props} />;
}

function SheetClose({ className, ...props }: React.ComponentProps<typeof Drawer.Close>) {
  return <Drawer.Close className={className} {...props} />;
}

// 4. Componente de Conteúdo (agora sem o Drawer.Portal interno)
interface SheetContentProps extends React.ComponentProps<typeof Drawer.Content> {
  side?: 'top' | 'right' | 'bottom' | 'left'; // Embora vaul use 'direction', mantemos 'side'
  className?: string;
  children?: React.ReactNode;
}

function SheetContent({ className, children, side = 'right', ...props }: SheetContentProps) {
  // O Drawer.Overlay é mantido aqui para garantir que o fundo escuro seja renderizado
  return (
    <>
      <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <Drawer.Content
        className={cn(
          'bg-card border-border fixed z-[60] flex flex-col shadow-2xl',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-full max-w-[90vw] border-l md:max-w-md lg:max-w-lg xl:max-w-xl',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-full max-w-[90vw] border-r md:max-w-md lg:max-w-lg xl:max-w-xl',
          side === 'top' && 'inset-x-0 top-0 h-auto max-h-[85vh] w-full border-b',
          side === 'bottom' && 'inset-x-0 bottom-0 h-auto max-h-[85vh] w-full border-t',
          className
        )}
        {...props}
      >
        <Drawer.Title className="sr-only">Dialog</Drawer.Title>=
        <div className="h-full w-full overflow-scroll p-6">{children}</div>
        <Drawer.Close className="text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-accent absolute top-4 right-4 rounded-full p-2 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </Drawer.Close>
      </Drawer.Content>
    </>
  );
}

// 5. Componentes de Título, Descrição, etc.
function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Drawer.Title>) {
  return (
    <Drawer.Title className={cn('text-foreground text-lg font-semibold', className)} {...props} />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Description>) {
  return (
    <Drawer.Description className={cn('text-muted-foreground text-sm', className)} {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
