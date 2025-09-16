'use client';

import React from 'react';
import { Sale } from '@/types/sale'; // Certifique-se que o caminho para seus tipos está correto
import Button from '@/components/ui/base/Button'; // Certifique-se que o caminho para seu botão está correto
import { useHydrated } from '@/hooks/ui/useHydrated';

interface SalesTableProps {
  sales: Sale[];
  onRemoveSale: (saleId: string) => void;
}

export default function SalesTable({ sales, onRemoveSale }: SalesTableProps) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th className="p-3">Data</th>
            <th className="p-3">Produto Vendido</th>
            <th className="p-3 text-center">Qtd</th>
            <th className="p-3">Preço Unit.</th>
            <th className="p-3">Subtotal</th>
            <th className="p-3">Total da Venda</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {/* Caso 1: A lista de vendas está vazia */}
          {sales.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-muted-foreground p-4 text-center">
                Nenhuma venda encontrada com os filtros aplicados.
              </td>
            </tr>
          ) : (
            /* Caso 2: Mapeia cada venda e seus itens para as linhas da tabela */
            sales.map(sale =>
              sale.items.map((item, idx) => (
                <tr key={`${sale.id}-${item.product.uid}`} className="hover:bg-gray-50">
                  {/* Colunas que aparecem em todas as linhas */}
                  <td className="p-3">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                  <td className="text-primary p-3 font-medium">{item.product.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3">
                    R$ {item.product.production.sellingPrice.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-3">R$ {item.subtotal.toFixed(2).replace('.', ',')}</td>

                  {idx === 0 && (
                    <td
                      className="text-primary p-3 align-middle font-bold"
                      rowSpan={sale.items.length}
                    >
                      R$ {sale.sellingResume.totalValue.toFixed(2).replace('.', ',')}
                    </td>
                  )}
                  {idx === 0 && (
                    <td className="p-3 text-center align-middle" rowSpan={sale.items.length}>
                      <Button
                        variant="ghost"
                        onClick={() => onRemoveSale(sale.id)}
                        className="p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                        aria-label={`Remover venda de ${new Date(sale.date).toLocaleDateString('pt-BR')}`}
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
