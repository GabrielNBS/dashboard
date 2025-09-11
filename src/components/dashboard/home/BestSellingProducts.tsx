import { formatCurrency } from '@/utils/formatting/formatCurrency';
import React from 'react';

const TopSellingItems = () => {
  // Dados de exemplo dos top itens vendidos
  const topItems = [
    {
      id: 1,
      nome: 'Smartphone Pro Max',
      imagem:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&crop=center',
      quantidade: 245,
      lucrobruto: 125500.0,
      percentualVendas: 18.5,
    },
    {
      id: 2,
      nome: 'Notebook Gaming',
      imagem:
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=100&h=100&fit=crop&crop=center',
      quantidade: 156,
      lucrobruto: 234000.0,
      percentualVendas: 15.2,
    },
    {
      id: 3,
      nome: 'Fones Bluetooth',
      imagem:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
      quantidade: 489,
      lucrobruto: 87300.0,
      percentualVendas: 12.8,
    },
    {
      id: 4,
      nome: 'Smartwatch Sport',
      imagem:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center',
      quantidade: 198,
      lucrobruto: 59400.0,
      percentualVendas: 9.7,
    },
    {
      id: 5,
      nome: 'Tablet Pro',
      imagem:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop&crop=center',
      quantidade: 123,
      lucrobruto: 98400.0,
      percentualVendas: 8.3,
    },
  ];

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
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPercentageColor(item.percentualVendas)}`}
                >
                  {item.percentualVendas}%
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
