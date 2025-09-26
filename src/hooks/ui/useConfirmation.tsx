'use client';

import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: 'destructive' | 'warning' | 'default';
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  onConfirm: () => void;
}

export function useConfirmation() {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null);

  const showConfirmation = useCallback((options: ConfirmationOptions, onConfirm: () => void) => {
    setConfirmationState({
      ...options,
      isOpen: true,
      onConfirm,
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmationState(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmationState?.onConfirm) {
      confirmationState.onConfirm();
    }
    hideConfirmation();
  }, [confirmationState, hideConfirmation]);

  return {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  };
}
