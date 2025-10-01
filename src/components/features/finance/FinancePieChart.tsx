'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FinanceSummary } from '@/hooks/business/useSummaryFinance';

interface FinancePieChartProps {
  financialSummary: FinanceSummary;
}

const COLORS = {
  revenue: '#3B82F6', // blue-500
  variableCost: '#F59E0B', // amber-500
  fixedCost: '#6B7280', // gray-500
  profit: '#10B981', // emerald-500
};

export default function FinancePieChart({ financialSummary }: FinancePieChartProps) {
  const { totalRevenue, totalVariableCost, totalFixedCost, netProfit } = financialSummary;

  // Preparar dados para o gráfico
  const data = [
    {
      name: 'Lucro Líquido',
      value: Math.max(0, netProfit || 0),
      color: COLORS.profit,
    },
    {
      name: 'Custo Variável',
      value: totalVariableCost || 0,
      color: COLORS.variableCost,
    },
    {
      name: 'Custo Fixo',
      value: totalFixedCost || 0,
      color: COLORS.fixedCost,
    },
  ].filter(item => item.value > 0);

  // Custom tooltip para mostrar valores formatados
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label para mostrar percentuais
  const renderLabel = (entry: any) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
    return `${percent}%`;
  };

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={value => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
