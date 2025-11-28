// src/components/dashboard/settings/FinancialSettingsSection.tsx
// Seção de configurações financeiras

'use client';

import React from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { DollarSign, Target, Shield, TrendingUp, ClipboardPlus } from 'lucide-react';
import { CurrencyInput, PercentageInput } from '@/components/ui/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Label } from '@/components/ui/base/label';
import { PERCENTAGE_LIMITS } from '@/schemas/validationSchemas';

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

  return (
    <div className="space-y-6">
      <div className="mb-10 flex items-center justify-center gap-3">
        <ClipboardPlus className="text-primary h-6 w-6" />
        <h2 className="text-lg font-bold lg:text-xl">Configurações financeiras</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Margem de Lucro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <h3 className="text-lg font-medium text-gray-900">Margem de lucro</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Margem de lucro padrão (%)
              </label>
              <PercentageInput
                value={state.financial.defaultProfitMargin?.toString() || ''}
                onChange={value =>
                  handleFinancialChange('defaultProfitMargin', parseFloat(value) || 0)
                }
                placeholder="30%"
                maxValue={PERCENTAGE_LIMITS.margin.max}
                minValue={PERCENTAGE_LIMITS.margin.min}
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
            <Shield className="text-primary h-5 w-5" />
            <h3 className="text-lg font-medium text-gray-900">Reserva de emergência</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Percentual de reserva (%)
              </label>
              <PercentageInput
                value={state.financial.emergencyReservePercentage?.toString() || ''}
                onChange={value =>
                  handleFinancialChange('emergencyReservePercentage', parseFloat(value) || 0)
                }
                placeholder="10%"
                maxValue={50}
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
            <Target className="text-primary h-5 w-5" />
            <h3 className="text-lg font-medium text-gray-900">Meta de vendas</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Meta mensal (R$)
              </label>
              <CurrencyInput
                value={state.financial.monthlySalesGoal?.toString() || ''}
                onChange={value =>
                  handleFinancialChange('monthlySalesGoal', parseFloat(value) || 0)
                }
                placeholder="R$ 50.000,00"
                maxValue={9999999.99}
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
            <DollarSign className="text-primary h-5 w-5" />
            <h3 className="text-lg font-medium text-gray-900">Configurações de moeda</h3>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Moeda principal
              </Label>
              <Select
                value={state.financial.currency}
                onValueChange={(value: string) => handleFinancialChange('currency', value)}
              >
                <SelectTrigger className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectValue placeholder="Selecionar moeda principal" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo das Configurações */}
      <div className="from-primary to-primary/80 hidden flex-col rounded-lg bg-gradient-to-r p-6 lg:flex">
        <h3 className="text-secondary mb-4 text-lg font-medium">
          Resumo das configurações financeiras
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Margem de lucro</span>
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
              <Target className="text-primary h-4 w-4" />
              <span className="text-primary font-medium">Meta mensal</span>
            </div>
            <span className="text-primary text-2xl font-bold">
              R$ {state.financial.monthlySalesGoal.toLocaleString()}
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="text-on-great h-4 w-4" />
              <span className="text-on-great font-medium">Moeda</span>
            </div>
            <span className="text-on-great text-2xl font-bold">{state.financial.currency}</span>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="hidden rounded-lg bg-yellow-50 p-4 lg:flex">
        <h4 className="mb-2 text-sm font-medium text-yellow-900">💡 Dicas de configuração</h4>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>
            • <strong>Margem de lucro:</strong> Recomendamos entre 20% e 40% para a maioria dos
            segmentos
          </li>
          <li>
            • <strong>Reserva de emergência:</strong> Ideal manter 10-15% do lucro para imprevistos
          </li>
          <li>
            • <strong>Meta de vendas:</strong> Defina metas realistas baseadas no histórico da loja
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
