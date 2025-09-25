// src/components/dashboard/settings/FinancialSettingsSection.tsx
// Seção de configurações financeiras

'use client';

import React from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { DollarSign, Target, Shield, TrendingUp } from 'lucide-react';
import { CurrencyInput, PercentageInput } from '@/components/ui/forms';

export default function FinancialSettingsSection() {
  const { state, dispatch } = useSettings();

  const handleFinancialChange = (field: keyof typeof state.financial, value: string | number) => {
    dispatch({
      type: 'UPDATE_FINANCIAL',
      payload: { [field]: value },
    });
  };

  const currencies = [
    { value: 'BRL', label: 'Real Brasileiro (R$)' },
    { value: 'USD', label: 'Dólar Americano ($)' },
    { value: 'EUR', label: 'Euro (€)' },
  ];

  const currencyFormats = [
    { value: 'symbol', label: 'Símbolo (R$ 1.234,56)' },
    { value: 'code', label: 'Código (BRL 1.234,56)' },
    { value: 'name', label: 'Nome (Real 1.234,56)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="text-primary h-6 w-6" />
        <h2 className="text-xl font-semibold">Configurações Financeiras</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Margem de Lucro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Margem de Lucro</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Margem de Lucro Padrão (%)
              </label>
              <PercentageInput
                value={state.financial.defaultProfitMargin?.toString() || ''}
                onChange={value =>
                  handleFinancialChange('defaultProfitMargin', parseFloat(value) || 0)
                }
                placeholder="30%"
                maxValue={500} // Limite: 500% margem máxima
                minValue={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                Percentual padrão de lucro para novos produtos
              </p>
            </div>
          </div>
        </div>

        {/* Reserva de Emergência */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Reserva de Emergência</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Percentual de Reserva (%)
              </label>
              <PercentageInput
                value={state.financial.emergencyReservePercentage?.toString() || ''}
                onChange={value =>
                  handleFinancialChange('emergencyReservePercentage', parseFloat(value) || 0)
                }
                placeholder="10%"
                maxValue={50} // Limite: 50% reserva máxima
                minValue={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                Percentual do lucro reservado para emergências
              </p>
            </div>
          </div>
        </div>

        {/* Meta de Vendas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-medium text-gray-900">Meta de Vendas</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Meta Mensal (R$)
              </label>
              <CurrencyInput
                value={state.financial.monthlySalesGoal?.toString() || ''}
                onChange={value =>
                  handleFinancialChange('monthlySalesGoal', parseFloat(value) || 0)
                }
                placeholder="R$ 50.000,00"
                maxValue={9999999.99} // Limite: R$ 9.999.999,99 meta mensal
              />
              <p className="mt-1 text-xs text-gray-500">
                Meta de vendas mensal para acompanhamento
              </p>
            </div>
          </div>
        </div>

        {/* Configurações de Moeda */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Configurações de Moeda</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Moeda Principal
              </label>
              <select
                value={state.financial.currency}
                onChange={e => handleFinancialChange('currency', e.target.value)}
                className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                aria-label="Selecionar moeda principal"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Formato de Exibição
              </label>
              <select
                value={state.financial.currencyFormat}
                onChange={e => handleFinancialChange('currencyFormat', e.target.value)}
                className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                aria-label="Selecionar formato de exibição da moeda"
              >
                {currencyFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo das Configurações */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Resumo das Configurações Financeiras
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Margem de Lucro</span>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {state.financial.defaultProfitMargin}%
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">Reserva</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {state.financial.emergencyReservePercentage}%
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-gray-700">Meta Mensal</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">
              R$ {state.financial.monthlySalesGoal.toLocaleString()}
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-gray-700">Moeda</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">{state.financial.currency}</span>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="rounded-lg bg-yellow-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-yellow-900">💡 Dicas de Configuração</h4>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>
            • <strong>Margem de Lucro:</strong> Recomendamos entre 20% e 40% para a maioria dos
            segmentos
          </li>
          <li>
            • <strong>Reserva de Emergência:</strong> Ideal manter 10-15% do lucro para imprevistos
          </li>
          <li>
            • <strong>Meta de Vendas:</strong> Defina metas realistas baseadas no histórico da loja
          </li>
          <li>
            • <strong>Moeda:</strong> A moeda selecionada será usada em todos os relatórios
            financeiros
          </li>
        </ul>
      </div>
    </div>
  );
}
