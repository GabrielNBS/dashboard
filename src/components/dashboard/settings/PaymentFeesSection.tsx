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
      <div className="mb-10 flex items-center justify-center gap-3">
        <DollarSign className="text-primary h-6 w-6" />
        <h2 className="text-lg font-bold lg:text-xl">Taxas de Pagamento</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {paymentMethods.map(({ key, label, icon: Icon, description }) => (
          <div key={key} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="text-primary h-5 w-5" />
              <h3 className="text-lg font-medium text-gray-900">{label}</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Taxa (%)</label>
                <PercentageInput
                  value={paymentFees[key]?.toString() ?? ''}
                  onChange={value => handleFeeChange(key, value)}
                  placeholder="0%"
                  maxValue={PERCENTAGE_LIMITS.paymentFee.max}
                  min={PERCENTAGE_LIMITS.paymentFee.min}
                />
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo das Taxas */}
      <div className="from-primary to-primary/80 hidden flex-col rounded-lg bg-gradient-to-r p-6 lg:flex">
        <h3 className="text-secondary mb-4 text-lg font-medium">Resumo das taxas configuradas</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {paymentMethods.map(({ key, label, icon: Icon }) => (
            <div key={key} className="rounded-lg bg-white p-3">
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">{label}</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{paymentFees[key] ?? 0}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="hidden rounded-lg bg-yellow-50 p-4 lg:flex">
        <h4 className="mb-2 text-sm font-medium text-yellow-900">💡 Dica</h4>
        <p className="text-sm text-yellow-800">
          As taxas são aplicadas sobre o subtotal da venda. Por exemplo, uma taxa de 2,5% em uma
          venda de R$ 100,00 resultará em R$ 2,50 de desconto no valor final.
        </p>
      </div>
    </div>
  );
}
