'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import ConfirmationDialog from './ConfirmationDialog';

interface ConfirmationContextType {
  showConfirmation: (
    options: {
      title: string;
      description: string;
      confirmText?: string;
      confirmButtonText?: string;
      cancelButtonText?: string;
      variant?: 'destructive' | 'warning' | 'default';
    },
    onConfirm: () => void
  ) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}

      {/* Dialog de confirmação global */}
      {confirmationState && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          description={confirmationState.description}
          variant={confirmationState.variant}
          confirmText={confirmationState.confirmText}
          confirmButtonText={confirmationState.confirmButtonText}
          cancelButtonText={confirmationState.cancelButtonText}
        />
      )}
    </ConfirmationContext.Provider>
  );
}

export function useGlobalConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useGlobalConfirmation must be used within a ConfirmationProvider');
  }
  return context;
}
