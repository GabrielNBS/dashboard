'use client';

import * as React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { cn } from '@/utils/utils';
import Button from '@/components/ui/base/Button';
import Input from '@/components/ui/base/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: 'destructive' | 'warning' | 'default';
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'excluir permanentemente',
  confirmButtonText = 'Confirmar Exclusão',
  cancelButtonText = 'Cancelar',
  variant = 'destructive',
}: ConfirmationDialogProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [error, setError] = React.useState('');

  const isConfirmEnabled = inputValue.toLowerCase() === confirmText.toLowerCase();

  const handleConfirm = () => {
    if (!inputValue.trim()) {
      setError('Digite a frase de confirmação no campo acima para habilitar este botão');
      return;
    }

    if (!isConfirmEnabled) {
      setError(`Frase incorreta. Digite exatamente "${confirmText}" para habilitar a confirmação`);
      return;
    }

    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Limpa o erro quando o usuário começa a digitar corretamente
    if (error && value.length > 0) {
      setError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: 'text-on-critical/90',
          iconBg: 'bg-critical',
          title: 'text-on-critical',
        };
      case 'warning':
        return {
          icon: 'text-on-warning/90',
          iconBg: 'bg-warning',
          title: 'text-on-warning',
        };
      default:
        return {
          icon: 'text-muted',
          iconBg: 'bg-muted-foreground',
          title: 'text-muted-foreground',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl lg:max-w-xl">
        <DialogHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className={cn('flex-shrink-0 rounded-full p-2', styles.iconBg)}>
              <AlertTriangleIcon className={cn('h-6 w-6', styles.icon)} />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className={cn('text-left', styles.title)}>{title}</DialogTitle>
              <DialogDescription className="mt-2 text-left">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            label={`Digite "${confirmText}" para confirmar:`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={confirmText}
            error={error}
            className="font-mono"
            autoComplete="off"
            autoFocus
          />
          {!inputValue && (
            <p className="text-muted-foreground text-sm">
              O botão será habilitado após digitar a frase correta
            </p>
          )}
          {inputValue && !isConfirmEnabled && inputValue.length < confirmText.length && (
            <p className="text-accent text-sm">
              Continue digitando... Faltam {confirmText.length - inputValue.length} caracteres
            </p>
          )}
          {inputValue && !isConfirmEnabled && inputValue.length >= confirmText.length && (
            <p className="text-on-critical text-sm">
              Frase incorreta. Digite exatamente &quot;{confirmText}&quot;
            </p>
          )}
          {isConfirmEnabled && (
            <p className="text-on-great flex items-center gap-1 text-sm">
              <span>✓</span> Botão habilitado! Pressione Enter ou clique para confirmar
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            {cancelButtonText}
          </Button>
          <Button
            variant={isConfirmEnabled ? 'destructive' : 'outline'}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            {isConfirmEnabled && <span className="mr-1">✓</span>}
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
