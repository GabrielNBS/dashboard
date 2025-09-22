'use client';

import React from 'react';
import { CreditCard, Banknote, Smartphone, Tag } from 'lucide-react';
import {
  PaymentConfig,
  PaymentOption,
  PaymentMethod,
  DiscountType,
  PAYMENT_METHODS,
} from '@/types/sale';
import { usePaymentFeesReadOnly } from '@/contexts/settings/SettingsContext';

interface PaymentConfigurationProps {
  payment: PaymentConfig;
  onPaymentChange: (payment: PaymentConfig) => void;
}

export default React.memo(function PaymentConfiguration({
  payment,
  onPaymentChange,
}: PaymentConfigurationProps) {
  const paymentFees = usePaymentFeesReadOnly();

  const paymentOptions: PaymentOption[] = [
    { id: 'dinheiro', label: PAYMENT_METHODS.CASH, icon: Banknote, fee: paymentFees.cash },
    { id: 'débito', label: PAYMENT_METHODS.DEBIT, icon: CreditCard, fee: paymentFees.debit },
    { id: 'crédito', label: PAYMENT_METHODS.CREDIT, icon: CreditCard, fee: paymentFees.credit },
    { id: 'Ifood', label: PAYMENT_METHODS.IFOOD, icon: Smartphone, fee: paymentFees.ifood },
  ];

  const handleMethodChange = (method: PaymentMethod) => {
    onPaymentChange({ ...payment, method });
  };

  const handleDiscountChange = (discount: typeof payment.discount) => {
    onPaymentChange({ ...payment, discount });
  };

  return (
    <div className="bg-surface rounded-lg p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Pagamento</h3>

      {/* Método de Pagamento */}
      <div className="mb-4">
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Método de Pagamento
        </label>
        <div className="grid grid-cols-2 gap-2">
          {paymentOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleMethodChange(option.id)}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 text-sm transition-all ${
                  payment.method === option.id
                    ? 'border-accent-light bg-accent-light text-on-warning'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{option.label}</span>
                {option.fee > 0 && (
                  <span className="text-muted-foreground ml-auto text-xs">+{option.fee}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desconto */}
      <div className="mb-4">
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          <Tag className="mr-1 inline h-4 w-4" />
          Desconto
        </label>
        <div className="flex gap-2">
          <select
            title="Tipos de descontos"
            value={payment.discount.type}
            onChange={e =>
              handleDiscountChange({
                ...payment.discount,
                type: e.target.value as DiscountType,
              })
            }
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="percentage">%</option>
            <option value="fixed">R$</option>
          </select>

          <input
            type="number"
            min="0"
            step="0.01"
            value={payment.discount.value}
            onChange={e =>
              handleDiscountChange({
                ...payment.discount,
                value: Number(e.target.value),
              })
            }
            className="flex-1 rounded border px-3 py-2 text-sm"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
});
