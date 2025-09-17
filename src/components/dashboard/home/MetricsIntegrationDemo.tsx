import React from 'react';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';
import { formatCurrency } from '@/utils/formatting/formatCurrency';

/**
 * Demo component showing how the unified business logic connects
 * Dashboard metrics with home screen charts
 */
export default function MetricsIntegrationDemo() {
  const { summary, chartData, aggregatedData } = useDashboardMetrics();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Integração de Métricas - Dashboard & Gráficos
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Business Metrics Summary */}
        <div>
          <h4 className="mb-3 font-medium text-slate-700">Resumo Financeiro</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Receita Total:</span>
              <span className="font-medium">{formatCurrency(summary.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Lucro Líquido:</span>
              <span className="font-medium">{formatCurrency(summary.netProfit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Margem:</span>
              <span className="font-medium">{summary.margin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Unidades Vendidas:</span>
              <span className="font-medium">{summary.totalUnitsSold}</span>
            </div>
          </div>
        </div>

        {/* Chart Data Preview */}
        <div>
          <h4 className="mb-3 font-medium text-slate-700">Dados do Gráfico</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Dias com Vendas:</span>
              <span className="font-medium">{chartData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Receita Média/Dia:</span>
              <span className="font-medium">
                {chartData.length > 0
                  ? formatCurrency(
                      chartData.reduce((sum, day) => sum + day.revenue, 0) / chartData.length
                    )
                  : formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Melhor Dia:</span>
              <span className="font-medium">
                {chartData.length > 0
                  ? formatCurrency(Math.max(...chartData.map(day => day.revenue)))
                  : formatCurrency(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-4 rounded-md bg-green-50 p-3">
        <div className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-green-800">
            ✅ Métricas do Dashboard integradas com gráficos da tela inicial
          </span>
        </div>
        <p className="mt-1 text-xs text-green-700">
          Os dados são calculados usando a mesma lógica de negócio em ambos os componentes
        </p>
      </div>
    </div>
  );
}
