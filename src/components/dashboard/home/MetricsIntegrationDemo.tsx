import React, { memo, useMemo } from 'react';
import { useDashboardMetrics } from '@/hooks/business/useDashboardMetrics';
import { formatCurrency } from '@/utils/formatting/formatCurrency';

/**
 * Demo component showing how the unified business logic connects
 * Dashboard metrics with home screen charts
 */
const MetricsIntegrationDemo = memo(function MetricsIntegrationDemo() {
  const { summary, chartData } = useDashboardMetrics();

  const stats = useMemo(() => {
    const avgRevenue = chartData.length > 0
      ? chartData.reduce((sum, day) => sum + day.revenue, 0) / chartData.length
      : 0;
    
    const bestDay = chartData.length > 0
      ? Math.max(...chartData.map(day => day.revenue))
      : 0;

    return { avgRevenue, bestDay };
  }, [chartData]);

  return (
    <div className="bg-background border-info rounded-lg border p-6 shadow-sm">
      <h3 className="text-primary mb-4 text-lg font-semibold">
        Integração de Métricas - Dashboard & Gráficos
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Business Metrics Summary */}
        <div>
          <h4 className="text-accent-foreground mb-3 font-medium">Resumo Financeiro</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receita Total:</span>
              <span className="font-medium">{formatCurrency(summary.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lucro Líquido:</span>
              <span className="font-medium">{formatCurrency(summary.netProfit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margem:</span>
              <span className="font-medium">{summary.margin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unidades Vendidas:</span>
              <span className="font-medium">{summary.totalUnitsSold}</span>
            </div>
          </div>
        </div>

        {/* Chart Data Preview */}
        <div>
          <h4 className="text-accent-foreground mb-3 font-medium">Dados do Gráfico</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dias com Vendas:</span>
              <span className="font-medium">{chartData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receita Média/Dia:</span>
              <span className="font-medium">{formatCurrency(stats.avgRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Melhor Dia:</span>
              <span className="font-medium">{formatCurrency(stats.bestDay)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-great mt-4 rounded-md p-3">
        <div className="flex items-center">
          <div className="bg-on-great mr-2 h-2 w-2 animate-pulse rounded-full"></div>
          <span className="text-on-great text-sm">
            ✅ Métricas do Dashboard integradas com gráficos da tela inicial
          </span>
        </div>
        <p className="text-on-great/80 mt-1 text-xs">
          Os dados são calculados usando a mesma lógica de negócio em ambos os componentes
        </p>
      </div>
    </div>
  );
});

MetricsIntegrationDemo.displayName = 'MetricsIntegrationDemo';

export default MetricsIntegrationDemo;
