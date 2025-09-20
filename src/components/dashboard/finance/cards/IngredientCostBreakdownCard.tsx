import React from 'react';
import { useSalesContext } from '@/contexts/sales/useSalesContext';
import { useSettings } from '@/contexts/settings/SettingsContext';
import {
  getRealIngredientsCost,
  getTotalVariableCost,
  getTotalUnitsSold,
  getTotalRevenue,
} from '@/utils/calculations/finance';
import { formatCurrency } from '@/utils/formatting/formatCurrency';

interface IngredientCostBreakdownCardProps {
  className?: string;
}

export default function IngredientCostBreakdownCard({
  className = '',
}: IngredientCostBreakdownCardProps) {
  const { state: salesState } = useSalesContext();
  const { state: settings } = useSettings();

  // Calcula custos reais dos ingredientes
  const realIngredientsCost = getRealIngredientsCost(salesState.sales);

  // Calcula custos configurados apenas para ingredientes
  const totalRevenue = getTotalRevenue(salesState.sales);
  const totalUnitsSold = getTotalUnitsSold(salesState.sales);
  const ingredientCostsConfig = settings.variableCosts.filter(cost => cost.type === 'ingredientes');
  const configuredIngredientsCost = getTotalVariableCost(
    ingredientCostsConfig,
    totalRevenue,
    totalUnitsSold
  );

  // Calcula a diferença
  const difference = realIngredientsCost - configuredIngredientsCost;
  const hasSignificantDifference = Math.abs(difference) > 0.01;

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Análise de Custos dos Ingredientes
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Custo Real (baseado nas vendas):</span>
          <span className="font-medium text-gray-900">{formatCurrency(realIngredientsCost)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Custo Configurado:</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(configuredIngredientsCost)}
          </span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Diferença:</span>
          <span
            className={`font-semibold ${
              difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : 'text-gray-900'
            }`}
          >
            {difference > 0 ? '+' : ''}
            {formatCurrency(difference)}
          </span>
        </div>

        {hasSignificantDifference && (
          <div
            className={`rounded-md p-3 text-sm ${
              difference > 0
                ? 'border border-red-200 bg-red-50 text-red-800'
                : 'border border-green-200 bg-green-50 text-green-800'
            }`}
          >
            {difference > 0 ? (
              <>
                <strong>⚠️ Atenção:</strong> Os custos reais dos ingredientes estão{' '}
                {formatCurrency(Math.abs(difference))} acima do configurado. Considere atualizar
                suas configurações de custos variáveis.
              </>
            ) : (
              <>
                <strong>✅ Ótimo:</strong> Os custos reais estão{' '}
                {formatCurrency(Math.abs(difference))} abaixo do configurado. Sua margem real pode
                ser melhor que o esperado.
              </>
            )}
          </div>
        )}

        {!hasSignificantDifference && (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            <strong>ℹ️ Info:</strong> Os custos reais e configurados estão alinhados. Suas métricas
            financeiras estão precisas.
          </div>
        )}
      </div>
    </div>
  );
}
