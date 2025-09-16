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
  TooltipProps,
} from 'recharts';
// Removido date-fns para usar funções nativas
import { Calendar } from 'lucide-react';

export type FinancialRecord = {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
};

const initialData: FinancialRecord[] = [
  { date: '2025-08-01', revenue: 1200, expenses: 800, profit: 400 },
  { date: '2025-08-02', revenue: 950, expenses: 600, profit: 350 },
  { date: '2025-08-03', revenue: 1500, expenses: 900, profit: 600 },
  { date: '2025-08-04', revenue: 1800, expenses: 1000, profit: 800 },
  { date: '2025-08-05', revenue: 700, expenses: 500, profit: 200 },
  { date: '2025-08-06', revenue: 1100, expenses: 700, profit: 400 },
  { date: '2025-08-07', revenue: 1300, expenses: 850, profit: 450 },
  { date: '2025-08-08', revenue: 2000, expenses: 1200, profit: 800 },
  { date: '2025-08-09', revenue: 1750, expenses: 950, profit: 800 },
  { date: '2025-08-10', revenue: 900, expenses: 600, profit: 300 },
  { date: '2025-08-11', revenue: 2100, expenses: 1400, profit: 700 },
  { date: '2025-08-12', revenue: 1950, expenses: 1100, profit: 850 },
  { date: '2025-08-13', revenue: 1600, expenses: 950, profit: 650 },
];

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
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="text-muted-foreground h-4 w-4" />
        <p className="text-primary/90 font-semibold">{formatFullDate(label || '')}</p>
      </div>
      <div className="space-y-2">
        {payload.map(entry => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground text-sm">{entry.name}</span>
            </div>
            <span className="text-primary font-bold">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FinancialChart() {
  const [data] = useState(initialData);
  const [chartType, setChartType] = useState<'bars' | 'pie' | 'radial'>('bars');

  // Cálculos de estatísticas
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  // Dados para gráfico de pizza e radial
  const aggregatedData = [
    { name: 'Receita', value: totalRevenue, color: chartConfig.colors.revenue },
    { name: 'Gastos', value: totalExpenses, color: chartConfig.colors.expenses },
    { name: 'Lucro', value: totalProfit, color: chartConfig.colors.profit },
  ];

  // Dados para gráfico radial (formato específico)
  const radialData = aggregatedData.map(item => ({
    ...item,
    fill: item.color,
    angle: (item.value / Math.max(totalRevenue, totalExpenses, totalProfit)) * 180,
  }));

  // Tooltip customizado para gráficos circulares
  const CustomPieTooltip = ({ active, payload }: TooltipProps) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    const percentage = ((data.value / (totalRevenue + totalExpenses + totalProfit)) * 100).toFixed(
      1
    );

    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: data.color }} />
          <div>
            <p className="font-semibold text-slate-700">{data.name}</p>
            <p className="text-sm text-slate-500">
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
              data={aggregatedData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              paddingAngle={0}
              dataKey="value"
            >
              {aggregatedData.map((entry, index) => (
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
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-gradient-to-br from-slate-50 to-white p-6">
      {/* Controles do gráfico */}
      <div className="mb-6 rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
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
                onClick={() => setChartType(key as 'bars' | 'pie' | 'radial')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  chartType === key
                    ? 'scale-105 transform bg-blue-500 text-white shadow-lg'
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
          <ResponsiveContainer width="100%" height="100%">
            {renderChartElements()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seção para adicionar dados facilmente */}
      <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Configurações</h3>
        <div className="text-sm text-slate-600">
          <p>
            • Para adicionar novos dados, modifique o array{' '}
            <code className="rounded bg-slate-100 px-2 py-1">initialData</code>
          </p>
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
