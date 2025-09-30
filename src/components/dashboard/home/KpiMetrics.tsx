import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';

// Import the correct type for tooltip content
interface TooltipContentProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    name?: string;
    value?: number;
    color?: string;
    payload?: unknown;
  }>;
  label?: string | number;
}
import { Calendar } from 'lucide-react';

export type FinancialRecord = {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export type AggregatedData = {
  name: string;
  value: number;
  color: string;
};

interface FinancialChartProps {
  chartData?: FinancialRecord[];
  aggregatedData?: AggregatedData[];
}

// Configurações do gráfico facilmente editáveis
const chartConfig = {
  colors: {
    revenue: '#3B82F6',
    expenses: '#EF4444',
    profit: '#10B981',
    grid: '#F1F5F9',
    text: '#64748B',
  },
  gradients: {
    revenue: 'url(#revenueGradient)',
    profit: 'url(#profitGradient)',
  },
  animation: {
    duration: 800,
    easing: 'ease-out',
  },
};

// Formatação de moeda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatação de data nativa
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  } catch {
    return dateString;
  }
};

const formatFullDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return dateString;
  }
};

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-secondary/95 rounded-xl border border-slate-200 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="text-muted-foreground h-4 w-4" />
        <p className="text-primary/90 font-semibold">{formatFullDate(String(label || ''))}</p>
      </div>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={entry.dataKey || index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground text-sm">{entry.name}</span>
            </div>
            <span className="text-primary font-bold">{formatCurrency(entry.value || 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FinancialChart({
  chartData = [],
  aggregatedData = [],
}: FinancialChartProps) {
  const [chartType, setChartType] = useState<'bars' | 'pie' | 'radial'>('bars');

  // Use provided data or fallback to empty arrays
  const data = chartData.length > 0 ? chartData : [];

  // Cálculos de estatísticas
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  // Use provided aggregated data or calculate from chart data
  const pieData =
    aggregatedData.length > 0
      ? aggregatedData
      : [
          { name: 'Receita', value: totalRevenue, color: chartConfig.colors.revenue },
          { name: 'Gastos', value: totalExpenses, color: chartConfig.colors.expenses },
          { name: 'Lucro', value: totalProfit, color: chartConfig.colors.profit },
        ];

  // Dados para gráfico radial (formato específico)
  const radialData = pieData.map(item => ({
    ...item,
    fill: item.color,
    angle: (item.value / Math.max(totalRevenue, totalExpenses, totalProfit)) * 180,
  }));

  // Tooltip customizado para gráficos circulares
  const CustomPieTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;

    const data = payload[0]?.payload as { name: string; value: number; color: string };
    if (!data) return null;

    const percentage = ((data.value / (totalRevenue + totalExpenses + totalProfit)) * 100).toFixed(
      1
    );

    return (
      <div className="bg-secondary/95 rounded-xl border border-slate-200 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: data.color }} />
          <div>
            <p className="font-semibold text-slate-700">{data.name}</p>
            <p className="text-muted-foreground text-sm">
              {formatCurrency(data.value)} ({percentage}%)
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderChartElements = () => {
    switch (chartType) {
      case 'bars':
        return (
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.colors.revenue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.colors.revenue} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.colors.profit} stopOpacity={0.6} />
                <stop offset="95%" stopColor={chartConfig.colors.profit} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors.grid} opacity={0.7} />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: chartConfig.colors.text }}
              axisLine={{ stroke: chartConfig.colors.grid }}
              tickLine={{ stroke: chartConfig.colors.grid }}
            />

            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: chartConfig.colors.text }}
              axisLine={{ stroke: chartConfig.colors.grid }}
              tickLine={{ stroke: chartConfig.colors.grid }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

            <Area
              type="monotone"
              dataKey="profit"
              fill={chartConfig.gradients.profit}
              stroke={chartConfig.colors.profit}
              strokeWidth={2}
              name="Lucro"
            />
            <Bar
              dataKey="revenue"
              fill={chartConfig.colors.revenue}
              name="Receita"
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke={chartConfig.colors.expenses}
              strokeWidth={3}
              strokeDasharray="6 3"
              name="Gastos"
              dot={{ fill: chartConfig.colors.expenses, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              paddingAngle={0}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry) => {
                const { color, payload } = entry as { color: string; payload: { value: number } };
                return (
                  <span style={{ color, fontWeight: '600' }}>
                    {value}: {formatCurrency(payload.value)}
                  </span>
                );
              }}
            />
          </PieChart>
        );

      case 'radial':
        return (
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="80%"
            data={radialData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" cornerRadius={8} fill="#8884d8" />
            <Legend
              iconSize={18}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry) => {
                const { color, payload } = entry as { color: string; payload: { value: number } };
                return (
                  <span style={{ color, fontWeight: '600' }}>
                    {value}: {formatCurrency(payload.value)}
                  </span>
                );
              }}
            />
            <Tooltip content={<CustomPieTooltip />} />
          </RadialBarChart>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="min-full to-secondary mx-auto w-full max-w-7xl bg-gradient-to-br from-slate-50">
      {/* Controles do gráfico */}
      <div className="bg-secondary mb-6 rounded-lg p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-800">Evolução Temporal</h2>
          <div className="flex gap-2">
            {[
              { key: 'bars', label: 'Barras', icon: '📊' },
              { key: 'pie', label: 'Pizza', icon: '🍕' },
              { key: 'radial', label: 'Meia Lua', icon: '🌙' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setChartType(key as 'bars' | 'pie' | 'radial')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  chartType === key
                    ? 'bg-primary text-secondary scale-105 transform shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:scale-102 hover:bg-slate-200'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-96 w-full">
          {data.length === 0 ? (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <div className="text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">Nenhum dado disponível</p>
                <p className="text-sm">Adicione algumas vendas para ver os gráficos</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {renderChartElements()}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Seção de informações */}
      <div className="bg-secondary rounded-lg border-slate-100 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Informações</h3>
        <div className="text-sm text-slate-600">
          <p>• Os dados são carregados automaticamente das vendas registradas no sistema</p>
          <p>
            • Cores podem ser alteradas em{' '}
            <code className="rounded bg-slate-100 px-2 py-1">chartConfig.colors</code>
          </p>
          <p>• Formatos de data e moeda são configuráveis nas funções de formatação</p>
        </div>
      </div>
    </div>
  );
}
