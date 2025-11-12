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

  // Mobile Card View
  const MobileView = () => (
    <div className="space-y-3 md:hidden">
      {sales.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border p-8 text-center">
          Nenhuma venda encontrada com os filtros aplicados.
        </div>
      ) : (
        sales.map(sale => (
          <div key={sale.id} className="bg-card rounded-lg border p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="text-muted-foreground text-xs">
                  {new Date(sale.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="text-primary mt-1 text-lg font-bold">
                  {formatCurrency(sale.sellingResume.totalValue)}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveSale(sale.id)}
                aria-label={`Remover venda de ${new Date(sale.date).toLocaleDateString('pt-BR')}`}
              >
                Remover
              </Button>
            </div>

            <div className="mb-3 flex items-center gap-2 text-sm">
              {getPaymentIcon(sale.sellingResume.paymentMethod)}
              <span className="font-medium">
                {
                  PAYMENT_METHODS[
                    sale.sellingResume.paymentMethod.toUpperCase() as keyof typeof PAYMENT_METHODS
                  ]
                }
              </span>
              {sale.sellingResume.fees && sale.sellingResume.fees > 0 && (
                <span className="text-muted-foreground text-xs">
                  (Taxa: {formatCurrency(sale.sellingResume.fees)})
                </span>
              )}
            </div>

            <div className="border-t pt-3">
              <div className="text-muted-foreground mb-2 text-xs font-medium">Itens</div>
              <div className="space-y-2">
                {sale.items.map(item => (
                  <div
                    key={`${sale.id}-${item.product.uid}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-muted-foreground text-xs">{item.quantity}x</div>
                    </div>
                    <div className="text-right font-medium">
                      {formatCurrency(
                        calculateSellingResume(
                          [item],
                          sale.sellingResume.paymentMethod,
                          sale.sellingResume.discount
                        ).subtotal
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Desktop Table View
  const DesktopView = () => (
    <div className="border-muted-foreground hidden overflow-x-auto rounded-lg border md:block">
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
          {sales.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-muted-foreground p-4 text-center">
                Nenhuma venda encontrada com os filtros aplicados.
              </td>
            </tr>
          ) : (
            sales.map(sale =>
              sale.items.map((item, idx) => (
                <tr key={`${sale.id}-${item.product.uid}`} className="hover:bg-surface/90">
                  <td className="p-3">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                  <td className="text-primary p-3 font-medium">{item.product.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
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
                  <td className="text-on-critical p-3">
                    - {formatCurrency(sale.sellingResume.fees ?? 0)}
                  </td>
                  <td className="p-3">
                    {formatCurrency(
                      calculateSellingResume(
                        [item],
                        sale.sellingResume.paymentMethod,
                        sale.sellingResume.discount
                      ).subtotal
                    )}
                  </td>
                  {idx === 0 && (
                    <td
                      className="text-primary p-3 align-middle font-bold"
                      rowSpan={sale.items.length}
                    >
                      {formatCurrency(sale.sellingResume.totalValue)}
                    </td>
                  )}
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

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}
