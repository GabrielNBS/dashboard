'use client';

import React from 'react';
import Button from '@/components/ui/base/Button';
import { Sale } from '@/types/sale';

interface SalesTableProps {
  sales: Sale[];
  onRemoveSale: (saleId: string) => void;
}

export default function SalesTable({ sales, onRemoveSale }: SalesTableProps) {
  return (
    <table className="w-full text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Data</th>
          <th className="p-2">Produto</th>
          <th className="p-2">Qtd</th>
          <th className="p-2">Preço Unit.</th>
          <th className="p-2">Subtotal</th>
          <th className="p-2">Total Venda</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {sales.length === 0 ? (
          <tr>
            <td colSpan={7} className="p-4 text-center text-gray-400">
              Nenhuma venda registrada.
            </td>
          </tr>
        ) : (
          sales.map(sale =>
            sale.items.map((item, idx) => (
              <tr key={`${sale.id}-${idx}`} className="border-b border-gray-200">
                <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="p-2">{item.product.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">R$ {item.product.sellingPrice.toFixed(2)}</td>
                <td className="p-2">R$ {item.subtotal.toFixed(2)}</td>
                {/* total geral da venda aparece apenas na última linha do grupo */}
                {idx === 0 ? (
                  <td className="p-2 font-bold" rowSpan={sale.items.length}>
                    R$ {sale.sellingResume.totalValue.toFixed(2)}
                  </td>
                ) : null}
                {idx === 0 ? (
                  <td className="p-2" rowSpan={sale.items.length}>
                    <Button
                      variant="ghost"
                      onClick={() => onRemoveSale(sale.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))
          )
        )}
      </tbody>
    </table>
  );
}
