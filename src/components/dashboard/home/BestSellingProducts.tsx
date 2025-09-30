'use client';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import React from 'react';

const TopSellingItems = () => {
  const {
    state: { sales },
  } = useSalesContext();

  const topItems = sales
    .reduce((acc, sale) => {
      sale.items.forEach(item => {
        const existingItem = acc.find(i => i.nome === item.product.name);
        if (existingItem) {
          existingItem.quantidade += item.quantity;
          existingItem.lucrobruto += item.subtotal;
        } else {
          acc.push({
            id: item.product.uid,
            nome: item.product.name,
            imagem:
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&crop=center',
            quantidade: item.quantity,
            lucrobruto: item.subtotal,
            percentualVendas: 0,
          });
        }
      });
      return acc;
    }, [])
    .sort((a, b) => b.lucrobruto - a.lucrobruto)
    .slice(0, 5);

  const totalRevenue = topItems.reduce((acc, item) => acc + item.lucrobruto, 0);

  topItems.forEach(item => {
    item.percentualVendas = totalRevenue > 0 ? (item.lucrobruto / totalRevenue) * 100 : 0;
  });

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 15) return 'text-green-600 bg-green-100';
    if (percentage >= 10) return 'text-blue-600 bg-blue-100';
    if (percentage >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getRankBadge = (index: number) => {
    const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-600'];
    const medals = ['🥇', '🥈', '🥉'];

    if (index < 3) {
      return (
        <div
          className={`h-6 w-6 ${colors[index]} flex items-center justify-center rounded-full text-xs font-bold text-white`}
        >
          {medals[index]}
        </div>
      );
    }

    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-xs font-bold text-white">
        {index + 1}
      </div>
    );
  };

  return (
    <div className="bg-surface w-full">
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="from-primary to-muted bg-gradient-to-r px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Top Produtos</h3>
        </div>

        <div className="space-y-2 p-3">
          {topItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-50"
            >
              {getRankBadge(index)}

              <div className="h-10 w-10 flex-shrink-0">
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="h-10 w-10 rounded-md border object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-primary truncate text-sm font-medium">{item.nome}</div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{item.quantidade} un.</span>
                  <span>•</span>
                  <span className="text-on-great font-medium">
                    {formatCurrency(item.lucrobruto)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPercentageColor(
                    item.percentualVendas,
                  )}`}
                >
                  {item.percentualVendas.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t bg-gray-50 px-4 py-2">
          <div className="text-muted-foreground text-xs">
            <div className="flex justify-between">
              <span>Total: {topItems.length} produtos</span>
              <span>
                {topItems.reduce((acc, item) => acc + item.percentualVendas, 0).toFixed(1)}% das
                vendas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingItems;
