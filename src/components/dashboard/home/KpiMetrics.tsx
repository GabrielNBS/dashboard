'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from 'recharts';
import { format, parseISO } from 'date-fns';

export type FinancialRecord = {
  date: string; // formato ISO
  revenue: number; // receita bruta do dia
  expenses: number; // gastos do dia
  profit: number; // lucro líquido do dia
};

export const financialData: FinancialRecord[] = [
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

// Formata valores para real brasileiro
const currencyFormatter = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

// Tooltip customizado com layout moderno
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="min-w-[220px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <p className="mb-2 font-semibold text-gray-700">{format(parseISO(label), 'dd/MM/yyyy')}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} className="text-gray-600">
            <span
              className="mr-2 inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: <span className="font-medium">{currencyFormatter(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Ponto customizado com animação de hover
const CustomDot = (props: any) => {
  const { cx, cy, stroke, fill, payload, dataKey, index, isActive } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isActive ? 8 : 4}
      stroke={stroke}
      strokeWidth={isActive ? 3 : 1.5}
      fill={fill}
      style={{ transition: 'r 0.3s ease, stroke-width 0.3s ease' }}
      cursor="pointer"
    />
  );
};

export function FinancialLineChart() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-extrabold text-indigo-700">Evolução Financeira (Ano)</h2>
      <div className="h-[450px] w-full">
        <ResponsiveContainer>
          <LineChart
            data={financialData}
            margin={{ top: 20, right: 40, left: 20, bottom: 10 }}
            // animação ao carregar
            animationDuration={1000}
          >
            {/* Grid leve com linhas pontilhadas */}
            <CartesianGrid strokeDasharray="4 4" stroke="#e0e7ff" />

            {/* Eixo X com ticks formatados e estilizados */}
            <XAxis
              dataKey="date"
              tickFormatter={dateString => format(parseISO(dateString), 'dd/MM')}
              stroke="#4f46e5"
              tick={{ fontSize: 12, fontWeight: '600' }}
              padding={{ left: 10, right: 10 }}
              minTickGap={10}
            />

            {/* Eixo Y formatado com moeda */}
            <YAxis
              tickFormatter={currencyFormatter}
              stroke="#4f46e5"
              tick={{ fontSize: 12, fontWeight: '600' }}
              width={80}
            />

            {/* Tooltip customizado */}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4f46e5', strokeWidth: 2 }} />

            {/* Legenda customizada no topo */}
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontWeight: '700', color: '#4f46e5' }}
              iconType="circle"
              iconSize={12}
            />

            {/* Linha Receita com sombra suave e pontos animados */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="url(#gradientRevenue)"
              strokeWidth={3}
              name="Receita"
              dot={<CustomDot />}
              activeDot={<CustomDot />}
            />

            {/* Linha Gastos com linha tracejada */}
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={3}
              name="Gastos"
              strokeDasharray="6 4"
              dot={<CustomDot />}
              activeDot={<CustomDot />}
            />

            {/* Área para Lucro, destacando volume */}
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#22C55E"
              fill="url(#gradientProfit)"
              name="Lucro"
              animationDuration={1500}
            />

            {/* Linha Lucro sobre a área */}
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#16a34a"
              strokeWidth={3}
              name="Lucro (linha)"
              dot={<CustomDot />}
              activeDot={<CustomDot />}
            />

            {/* Definindo gradientes para linhas e áreas */}
            <defs>
              <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="gradientProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
