'use client';

import React from 'react';
import { CreditCard, Banknote, Smartphone, Tag } from 'lucide-react';
import { PaymentConfig, PaymentOption, DiscountType, PAYMENT_METHODS } from '@/types/sale';

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: PAYMENT_METHODS.CASH, label: 'Dinheiro', icon: Banknote, fee: 0 },
  { id: PAYMENT_METHODS.DEBIT, label: 'Débito', icon: CreditCard, fee: 2.5 },
  { id: PAYMENT_METHODS.CREDIT, label: 'Crédito', icon: CreditCard, fee: 3.5 },
  { id: PAYMENT_METHODS.IFOOD, label: 'iFood', icon: Smartphone, fee: 15 },
];

interface PaymentConfigurationProps {
  payment: PaymentConfig;
  onPaymentChange: (payment: PaymentConfig) => void;
}

export default function PaymentConfiguration({
  payment,
  onPaymentChange,
}: PaymentConfigurationProps) {
  const handleMethodChange = (method: typeof payment.method) => {
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
          {PAYMENT_OPTIONS.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
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
                  <span className="text-muted-foreground ml-auto text-xs">
                    +{option.fee}%
                  </span>
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
}
