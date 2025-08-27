'use client';

import React from 'react';
import { Receipt } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { SellingResume, PaymentConfig } from '@/types/sale';

interface OrderSummaryProps {
  sellingResume: SellingResume;
  payment: PaymentConfig;
  onConfirmSale: () => void;
  isCartEmpty: boolean;
}

export default function OrderSummary({
  sellingResume,
  payment,
  onConfirmSale,
  isCartEmpty,
}: OrderSummaryProps) {
  const { subtotal, fees, totalValue } = sellingResume;

  const discountValue: number = payment.discount
    ? payment.discount.type === 'percentage'
      ? (subtotal * payment.discount.value) / 100
      : payment.discount.value
    : 0;

  if (isCartEmpty) return null;

  return (
    <div className="bg-surface rounded-lg p-6 shadow-sm">
      {/* Resumo */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>

        {discountValue > 0 && (
          <div className="text-on-great flex justify-between text-sm">
            <span>Desconto:</span>
            <span>-R$ {discountValue.toFixed(2)}</span>
          </div>
        )}

        {fees && fees > 0 && (
          <div className="text-accent flex justify-between text-sm">
            <span>Taxa ({payment.method}):</span>
            <span>+R$ {fees.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total:</span>
          <span className="text-on-great text-lg">R$ {totalValue.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={onConfirmSale} className="mt-4 w-full gap-1">
        <Receipt />
        Finalizar Venda
      </Button>
    </div>
  );
}
