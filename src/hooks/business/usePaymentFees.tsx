// src/hooks/business/usePaymentFees.tsx
'use client';

import React from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { PaymentMethod } from '@/types/sale';

export function usePaymentFees() {
  const { state } = useSettings();

  const getFeeForMethod = React.useCallback(
    (method: PaymentMethod): number => {
      const methodMap: Record<PaymentMethod, keyof typeof state.paymentFees> = {
        dinheiro: 'cash',
        débito: 'debit',
        crédito: 'credit',
        Ifood: 'ifood',
      };

      return state.paymentFees[methodMap[method]] || 0;
    },
    [state.paymentFees]
  );

  const getPaymentFeesConfig = React.useMemo(() => {
    return {
      cash: state.paymentFees.cash,
      debit: state.paymentFees.debit,
      credit: state.paymentFees.credit,
      ifood: state.paymentFees.ifood,
    };
  }, [
    state.paymentFees.cash,
    state.paymentFees.debit,
    state.paymentFees.credit,
    state.paymentFees.ifood,
  ]);

  return React.useMemo(
    () => ({
      paymentFees: state.paymentFees,
      getFeeForMethod,
      getPaymentFeesConfig,
    }),
    [state.paymentFees, getFeeForMethod, getPaymentFeesConfig]
  );
}
