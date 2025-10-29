'use client';

import React from 'react';
import { Sale, PaymentMethod, PAYMENT_METHODS } from '@/types/sale';
import Button from '@/components/ui/base/Button';

import { DollarSign, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { JSX } from 'react';
import { calculateSellingResume } from '@/utils/calculations';
import { SiIfood } from 'react-icons/si';

interface SalesTableProps {
  sales: Sale[];
  onRemoveSale: (saleId: string) => void;
}

export default function SalesTable({ sales, onRemoveSale }: SalesTableProps) {
  // Mapa de ícones por método de pagamento
  const PAYMENT_ICONS: Record<PaymentMethod, JSX.Element> = {
    dinheiro: <DollarSign className="text-accent h-5 w-5" />,
    débito: <CreditCard className="text-primary h-5 w-5" />,
    crédito: <CreditCard className="text-secondary h-5 w-5" />,
    Ifood: <SiIfood className="text-destructive h-5 w-5" />,
  };

  function getPaymentIcon(method: PaymentMethod) {
    return PAYMENT_ICONS[method];
  }

  return (
    <div className="border-muted-foreground overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary text-muted uppercase">
          <tr>
            <th className="p-3">Data</th>
            <th className="p-3">Produto vendido</th>
            <th className="p-3 text-center">Qtd</th>
            <th className="p-3">Canal de venda</th>
            <th className="p-3">Taxa</th>
            <th className="p-3">Subtotal</th>
            <th className="p-3">Total da Venda</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-muted-foreground bg-surface divide-y">
          {/* Caso 1: Nenhuma venda */}
          {sales.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-muted-foreground p-4 text-center">
                Nenhuma venda encontrada com os filtros aplicados.
              </td>
            </tr>
          ) : (
            /* Caso 2: Renderiza vendas e itens */
            sales.map(sale =>
              sale.items.map((item, idx) => (
                <tr key={`${sale.id}-${item.product.uid}`} className="hover:bg-surface/90">
                  {/* Data */}
                  <td className="p-3">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>

                  {/* Produto */}
                  <td className="text-primary p-3 font-medium">{item.product.name}</td>

                  {/* Quantidade */}
                  <td className="p-3 text-center">{item.quantity}</td>

                  {/* Canal de venda (ícone + label) */}
                  <td className="flex items-center gap-2 p-3">
                    {getPaymentIcon(sale.sellingResume.paymentMethod)}
                    <span>
                      {
                        PAYMENT_METHODS[
                          sale.sellingResume.paymentMethod.toUpperCase() as keyof typeof PAYMENT_METHODS
                        ]
                      }
                    </span>
                  </td>

                  {/* Desconto / fees */}
                  <td className="text-on-critical p-3">
                    - {formatCurrency(sale.sellingResume.fees ?? 0)}
                  </td>

                  {/* Subtotal */}
                  <td className="p-3">
                    {formatCurrency(
                      calculateSellingResume(
                        [item],
                        sale.sellingResume.paymentMethod,
                        sale.sellingResume.discount
                      ).subtotal
                    )}
                  </td>

                  {/* Total da venda (só na primeira linha) */}
                  {idx === 0 && (
                    <td
                      className="text-primary p-3 align-middle font-bold"
                      rowSpan={sale.items.length}
                    >
                      {formatCurrency(sale.sellingResume.totalValue)}
                    </td>
                  )}

                  {/* Botão de ação (só na primeira linha) */}
                  {idx === 0 && (
                    <td className="p-3 text-center align-middle" rowSpan={sale.items.length}>
                      <Button
                        variant="default"
                        onClick={() => onRemoveSale(sale.id)}
                        aria-label={`Remover venda de ${new Date(sale.date).toLocaleDateString(
                          'pt-BR'
                        )}`}
                      >
                        Remover
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
