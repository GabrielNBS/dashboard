// src/components/dashboard/settings/PaymentFeesSection.tsx
'use client';

import React from 'react';
import { usePaymentFees } from '@/contexts/settings/SettingsContext';
import { CreditCard, Banknote, Smartphone, DollarSign } from 'lucide-react';
import { PercentageInput } from '@/components/ui/forms';
import { PERCENTAGE_LIMITS } from '@/schemas/validationSchemas';

export default function PaymentFeesSection() {
  const { paymentFees, updatePaymentFees } = usePaymentFees();

  const handleFeeChange = React.useCallback(
    (method: keyof typeof paymentFees, value: string) => {
      const numericValue = parseFloat(value) || 0;
      updatePaymentFees({ [method]: numericValue });
    },
    [updatePaymentFees]
  );

  const paymentMethods = React.useMemo(
    () => [
      {
        key: 'cash' as const,
        label: 'Dinheiro',
        icon: Banknote,
        description: 'Taxa aplicada em pagamentos em dinheiro',
      },
      {
        key: 'debit' as const,
        label: 'Cartão de Débito',
        icon: CreditCard,
        description: 'Taxa aplicada em pagamentos no débito',
      },
      {
        key: 'credit' as const,
        label: 'Cartão de Crédito',
        icon: CreditCard,
        description: 'Taxa aplicada em pagamentos no crédito',
      },
      {
        key: 'ifood' as const,
        label: 'iFood',
        icon: Smartphone,
        description: 'Taxa aplicada em pedidos via iFood',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="text-primary h-6 w-6" />
        <div>
          <h2 className="text-xl font-semibold">Taxas de Pagamento</h2>
          <p className="text-muted-foreground text-sm">
            Configure as taxas aplicadas para cada método de pagamento
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {paymentMethods.map(({ key, label, icon: Icon, description }) => (
          <div key={key} className="bg-surface rounded-lg p-4 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{label}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa (%)</label>
              <PercentageInput
                value={paymentFees[key]?.toString() ?? ''}
                onChange={value => handleFeeChange(key, value)}
                placeholder="0%"
                className="w-full"
                maxValue={PERCENTAGE_LIMITS.paymentFee.max}
                minValue={PERCENTAGE_LIMITS.paymentFee.min}
              />
              <p className="text-muted-foreground text-xs">Taxa atual: {paymentFees[key] ?? 0}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-info rounded-lg p-4 shadow-md">
        <h4 className="text-primary mb-2 font-medium">💡 Dica</h4>
        <p className="text-primary text-sm">
          As taxas são aplicadas sobre o subtotal da venda. Por exemplo, uma taxa de 2,5% em uma
          venda de R$ 100,00 resultará em R$ 2,50 de desconto no valor final.
        </p>
      </div>
    </div>
  );
}
