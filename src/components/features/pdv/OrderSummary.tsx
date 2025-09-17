'use client';

import React from 'react';
import { Receipt } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { SellingResume, PaymentConfig } from '@/types/sale';
import { formatCurrency } from '@/utils/formatting/formatCurrency';

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
  // Se o carrinho estiver vazio, não renderiza
  if (isCartEmpty) return null;

  // Valores seguros para cálculos
  const subtotal = sellingResume.subtotal ?? 0;
  const fees = sellingResume.fees ?? 0;
  const totalValue = sellingResume.totalValue ?? 0;

  // Calcula desconto de forma segura
  const discountValue =
    (payment.discount?.value ?? 0)
      ? payment.discount.type === 'percentage'
        ? (subtotal * (payment.discount.value ?? 0)) / 100
        : (payment.discount.value ?? 0)
      : 0;

  return (
    <div className="bg-surface rounded-lg p-6 shadow-sm">
      {/* Resumo */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discountValue > 0 && (
          <div className="text-on-great flex justify-between text-sm">
            <span>Desconto:</span>
            <span>-{formatCurrency(discountValue)}</span>
          </div>
        )}

        {fees > 0 && (
          <div className="text-accent flex justify-between text-sm">
            <span>Taxa ({payment.method}):</span>
            <span>+{formatCurrency(fees)}</span>
          </div>
        )}

        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total:</span>
          <span className="text-on-great text-lg">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Botão de confirmação */}
      <Button onClick={onConfirmSale} className="mt-4 w-full gap-1">
        <Receipt />
        Finalizar Venda
      </Button>
    </div>
  );
}
