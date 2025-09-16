'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { FixedCostSettings } from '@/types/settings';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { getTotalFixedCost } from '@/utils/calculations/finance';

export default function FixedCostsSection() {
  const { state, dispatch } = useSettings();
  const [editingCost, setEditingCost] = useState<FixedCostSettings | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const categories = [
    { value: 'aluguel', label: 'Aluguel' },
    { value: 'energia', label: 'Energia' },
    { value: 'agua', label: 'Água' },
    { value: 'internet', label: 'Internet' },
    { value: 'funcionarios', label: 'Funcionários' },
    { value: 'outros', label: 'Outros' },
  ];

  const recurrences = [
    { value: 'diario', label: 'Diário' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensal', label: 'Mensal' },
    { value: 'anual', label: 'Anual' },
  ];

  const handleAddCost = () => {
    const newCost: FixedCostSettings = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      recurrence: 'mensal',
      category: 'outros',
      dueDate: '',
      notes: '',
    };
    setEditingCost(newCost);
    setIsAdding(true);
  };

  const handleEditCost = (cost: FixedCostSettings) => {
    setEditingCost(cost);
    setIsAdding(false);
  };

  const handleSaveCost = () => {
    if (editingCost && editingCost.name.trim()) {
      if (isAdding) {
        dispatch({ type: 'ADD_FIXED_COST', payload: editingCost });
      } else {
        dispatch({ type: 'UPDATE_FIXED_COST', payload: editingCost });
      }
      setEditingCost(null);
      setIsAdding(false);
    }
  };

  const handleDeleteCost = (id: string) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este custo fixo?');
    if (confirm) {
      dispatch({ type: 'REMOVE_FIXED_COST', payload: id });
    }
  };

  const handleCancel = () => {
    setEditingCost(null);
    setIsAdding(false);
  };

  const totalFixedCosts = getTotalFixedCost(state.fixedCosts);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="text-primary h-6 w-6" />
          <h2 className="text-xl font-semibold">Custos Fixos</h2>
        </div>
        <Button onClick={handleAddCost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Custo
        </Button>
      </div>

      {/* Resumo */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 text-lg font-medium text-blue-900">Resumo dos Custos Fixos</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Total de Custos:</span>
            <span className="ml-2 font-bold text-blue-900">R$ {totalFixedCosts.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-600">Quantidade:</span>
            <span className="ml-2 font-bold text-blue-900">{state.fixedCosts.length} custo(s)</span>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      {editingCost && (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <h3 className="text-lg font-medium">
            {isAdding ? 'Adicionar Novo Custo Fixo' : 'Editar Custo Fixo'}
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome do Custo *
              </label>
              <Input
                value={editingCost.name}
                onChange={e => setEditingCost({ ...editingCost, name: e.target.value })}
                placeholder="Ex: Aluguel, Energia, Internet"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Valor *</label>
              <Input
                type="number"
                value={editingCost.amount}
                onChange={e =>
                  setEditingCost({ ...editingCost, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0,00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
              <select
                value={editingCost.category}
                onChange={e =>
                  setEditingCost({
                    ...editingCost,
                    category: e.target.value as typeof editingCost.category,
                  })
                }
                className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                aria-label="Selecionar categoria do custo"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Recorrência</label>
              <select
                value={editingCost.recurrence}
                onChange={e =>
                  setEditingCost({
                    ...editingCost,
                    recurrence: e.target.value as typeof editingCost.recurrence,
                  })
                }
                className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                aria-label="Selecionar recorrência do custo"
              >
                {recurrences.map(recurrence => (
                  <option key={recurrence.value} value={recurrence.value}>
                    {recurrence.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Data de Vencimento
              </label>
              <Input
                type="date"
                value={editingCost.dueDate}
                onChange={e => setEditingCost({ ...editingCost, dueDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                value={editingCost.notes}
                onChange={e => setEditingCost({ ...editingCost, notes: e.target.value })}
                placeholder="Observações adicionais sobre este custo..."
                className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveCost} disabled={!editingCost.name.trim()}>
              {isAdding ? 'Adicionar' : 'Salvar'}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Custos Fixos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Custos Fixos Configurados</h3>

        {state.fixedCosts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <DollarSign className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>Nenhum custo fixo configurado.</p>
            <p className="text-sm">Clique em &quot;Adicionar Custo&quot; para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.fixedCosts.map(cost => (
              <div
                key={cost.id}
                className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">{cost.name}</h4>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {cost.category}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Valor:</span>
                        <span className="ml-1">R$ {cost.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Recorrência:</span>
                        <span className="ml-1 capitalize">{cost.recurrence}</span>
                      </div>
                      {cost.dueDate && (
                        <div>
                          <span className="font-medium">Vencimento:</span>
                          <span className="ml-1">
                            {new Date(cost.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {cost.notes && (
                        <div className="col-span-2">
                          <span className="font-medium">Observações:</span>
                          <span className="ml-1">{cost.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCost(cost)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCost(cost.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
