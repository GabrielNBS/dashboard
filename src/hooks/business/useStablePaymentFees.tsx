// src/hooks/business/useStablePaymentFees.tsx
'use client';

import React from 'react';
import { usePaymentFeesReadOnly } from '@/contexts/settings/SettingsContext';
import { PaymentMethod } from '@/types/sale';

export function useStablePaymentFees() {
  const paymentFeesConfig = usePaymentFeesReadOnly();

  const getFeeForMethod = React.useCallback(
    (method: PaymentMethod): number => {
      const methodMap: Record<PaymentMethod, keyof typeof paymentFeesConfig> = {
        dinheiro: 'cash',
        débito: 'debit',
        crédito: 'credit',
        Ifood: 'ifood',
      };

      return paymentFeesConfig[methodMap[method]] || 0;
    },
    [paymentFeesConfig]
  );

  return React.useMemo(
    () => ({
      paymentFeesConfig,
      getFeeForMethod,
    }),
    [paymentFeesConfig, getFeeForMethod]
  );
}
