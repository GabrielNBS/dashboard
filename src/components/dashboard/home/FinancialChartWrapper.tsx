'use client';

import dynamic from 'next/dynamic';
import { Calendar } from 'lucide-react';

const FinancialChart = dynamic(() => import('./KpiMetrics'), {
  ssr: false,
  loading: () => (
    <div className="min-full mx-auto w-full max-w-7xl">
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6 dark:bg-gray-800">
        <div className="flex h-64 w-full items-center justify-center text-gray-500 sm:h-80 md:h-96">
          <div className="text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 animate-pulse opacity-50" />
            <p className="text-lg font-medium">Carregando gráficos...</p>
          </div>
        </div>
      </div>
    </div>
  ),
});

export default FinancialChart;
