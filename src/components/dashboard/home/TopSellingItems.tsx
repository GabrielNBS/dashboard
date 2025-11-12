'use client';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { ThumbsDown } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, memo } from 'react';

interface TopSellingItem {
  id: string;
  nome: string;
  imagem: string;
  quantidade: number;
  revenue: number;
  percentualVendas: number;
}

const TopSellingItems = memo(() => {
  const {
    state: { sales },
  } = useSalesContext();

  const topItems = useMemo(() => {
    const items = sales
      .reduce((acc: TopSellingItem[], sale) => {
        sale.items.forEach(item => {
          const existingItem = acc.find(i => i.nome === item.product.name);
          if (existingItem) {
            existingItem.quantidade += item.quantity;
            existingItem.revenue += item.subtotal;
          } else {
            acc.push({
              id: item.product.uid,
              nome: item.product.name,
              imagem: 'https://placehold.co/150',
              quantidade: item.quantity,
              revenue: item.subtotal,
              percentualVendas: 0,
            });
          }
        });
        return acc;
      }, [])
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const totalRevenue = items.reduce((acc, item) => acc + item.revenue, 0);

    items.forEach(item => {
      item.percentualVendas = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;
    });

    return items;
  }, [sales]);

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
    <aside className="w-full" aria-labelledby="top-products-title">
      <div className="bg-card overflow-hidden rounded-lg shadow-sm">
        <header className="from-primary to-secondary-foreground bg-gradient-to-r px-4 py-3">
          <h3 id="top-products-title" className="text-primary-foreground text-sm font-semibold">
            Top produtos
          </h3>
        </header>

        <div className="min-h-64 space-y-2 p-3">
          {topItems.length === 0 && (
            <div
              className="text-muted-foreground flex justify-center gap-4 py-6 text-center text-sm"
              role="status"
            >
              <ThumbsDown aria-hidden="true" />
              <p>Nenhum item foi vendido ainda</p>
            </div>
          )}

          {topItems.length > 0 && (
            <ol className="space-y-2" role="list" aria-label="Lista dos produtos mais vendidos">
              {topItems.map((item, index) => (
                <li
                  key={item.id}
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-md p-2 transition-colors"
                >
                  <div aria-label={`Posição ${index + 1}`}>{getRankBadge(index)}</div>

                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      src={item.imagem}
                      alt={`Imagem do produto ${item.nome}`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md border object-cover"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      priority={index === 0}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{item.nome}</div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span aria-label={`${item.quantidade} unidades vendidas`}>
                        {item.quantidade} un.
                      </span>
                      <span aria-hidden="true">•</span>
                      <span
                        className="text-on-great font-medium"
                        aria-label={`Receita de ${formatCurrency(item.revenue)}`}
                      >
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPercentageColor(
                        item.percentualVendas
                      )}`}
                      aria-label={`${item.percentualVendas.toFixed(1)}% das vendas totais`}
                    >
                      {item.percentualVendas.toFixed(1)}%
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <footer className="bg-muted/30 border-t px-4 py-2">
          <div className="text-muted-foreground text-xs">
            <div className="flex justify-between" role="status" aria-live="polite">
              <span>Total: {topItems.length} produtos</span>
              <span>
                {topItems.reduce((acc, item) => acc + item.percentualVendas, 0).toFixed(1)}% das
                vendas
              </span>
            </div>
          </div>
        </footer>
      </div>
    </aside>
  );
});

TopSellingItems.displayName = 'TopSellingItems';

export default TopSellingItems;
