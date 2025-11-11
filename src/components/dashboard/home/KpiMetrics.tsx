import React, { useState, useMemo } from 'react';
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
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/UnifiedUtils';

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

const chartConfig = {
  colors: {
    revenue: '#3b82f6',
    expenses: '#ef4444',
    profit: '#22c55e',
    grid: '#e5e7eb',
    text: '#6b7281',
  },
  gradients: {
    revenue: 'url(#revenueGradient)',
    profit: 'url(#profitGradient)',
  },
};

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

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <p className="font-semibold text-gray-800">{formatFullDate(String(label || ''))}</p>
      </div>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={entry.dataKey || index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}</span>
            </div>
            <span className="font-bold text-gray-900">{formatCurrency(entry.value || 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CustomPieTooltipProps extends TooltipContentProps {
  total: number;
}

const CustomPieTooltip = ({ active, payload, total }: CustomPieTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload as { name: string; value: number; color: string };
  if (!data) return null;

  const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: data.color }} />
        <div>
          <p className="font-semibold text-slate-700">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      </div>
    </div>
  );
};

type ChartType = 'bars' | 'pie' | 'radial';

const chartTypes: { key: ChartType; label: string; icon: string }[] = [
  { key: 'bars', label: 'Barras', icon: '📊' },
  { key: 'pie', label: 'Pizza', icon: '🍕' },
  { key: 'radial', label: 'Meia Lua', icon: '🌙' },
];

export default function FinancialChart({
  chartData = [],
  aggregatedData = [],
}: FinancialChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bars');

  const data = useMemo(() => (chartData.length > 0 ? chartData : []), [chartData]);

  const totals = useMemo(() => {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    return { totalRevenue, totalExpenses, totalProfit };
  }, [data]);

  const pieData = useMemo(() => {
    if (aggregatedData.length > 0) {
      return aggregatedData;
    }
    const { totalRevenue, totalExpenses, totalProfit } = totals;
    return [
      { name: 'Receita', value: totalRevenue, color: chartConfig.colors.revenue },
      { name: 'Gastos', value: totalExpenses, color: chartConfig.colors.expenses },
      { name: 'Lucro', value: totalProfit, color: chartConfig.colors.profit },
    ];
  }, [aggregatedData, totals]);

  const totalForPie = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.value, 0);
  }, [pieData]);

  const radialData = useMemo(() => {
    return pieData.map(item => ({
      ...item,
      fill: item.color,
    }));
  }, [pieData]);

  const currentChart = useMemo(() => {
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
            <Tooltip content={<CustomPieTooltip total={totalForPie} />} />
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
            <RadialBar dataKey="value" cornerRadius={8} />
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
            <Tooltip content={<CustomPieTooltip total={totalForPie} />} />
          </RadialBarChart>
        );

      default:
        return <></>;
    }
  }, [chartType, data, pieData, radialData, totalForPie]);

  return (
    <div className="min-full mx-auto w-full max-w-7xl">
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:mb-6 sm:justify-between sm:gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {chartTypes.map(chart => (
              <button
                key={chart.key}
                type="button"
                onClick={() => setChartType(chart.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:text-sm ${
                  chartType === chart.key
                    ? 'scale-105 transform bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:scale-102 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span>{chart.icon}</span>
                <span className="hidden sm:inline">{chart.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full sm:h-80 md:h-96">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">Nenhum dado disponível</p>
                <p className="text-sm">Adicione algumas vendas para ver os gráficos</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {currentChart}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
