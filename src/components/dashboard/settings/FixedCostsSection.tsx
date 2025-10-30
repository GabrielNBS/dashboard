'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { FixedCostSettings } from '@/types/settings';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { getTotalFixedCost } from '@/utils/calculations/finance';
import { CurrencyInput } from '@/components/ui/forms';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Label } from '@/components/ui/base/label';

export default function FixedCostsSection() {
  const { state, dispatch } = useSettings();
  const [editingCost, setEditingCost] = useState<FixedCostSettings | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

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
    const cost = state.fixedCosts.find(c => c.id === id);
    const costName = cost?.name || 'este custo fixo';

    showConfirmation(
      {
        title: 'Excluir custo fixo',
        description: `Tem certeza que deseja excluir "${costName}"? Esta ação não pode ser desfeita.`,
        variant: 'destructive',
      },
      () => {
        dispatch({ type: 'REMOVE_FIXED_COST', payload: id });
      }
    );
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
          <h2 className="text-xl font-semibold">Custos fixos</h2>
        </div>
        <Button onClick={handleAddCost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar custo
        </Button>
      </div>

      {/* Resumo */}
      <div className="bg-primary/10 rounded-lg p-4">
        <h3 className="text-primary mb-2 text-lg font-medium">Resumo dos custos fixos</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-primary">Total de custos:</span>
            <span className="text-foreground ml-2 font-bold">R$ {totalFixedCosts.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-primary">Quantidade:</span>
            <span className="text-foreground ml-2 font-bold">
              {state.fixedCosts.length} custo(s)
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      {editingCost && (
        <div className="bg-muted space-y-4 rounded-lg p-4">
          <h3 className="text-lg font-medium">
            {isAdding ? 'Adicionar novo custo fixo' : 'Editar custo fixo'}
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome do custo *
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
              <CurrencyInput
                value={editingCost.amount?.toString() || ''}
                onChange={value =>
                  setEditingCost({ ...editingCost, amount: parseFloat(value) || 0 })
                }
                placeholder="R$ 0,00"
                maxValue={999999.99} // Limite: R$ 999.999,99 para custos fixos
                required
              />
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">Categoria</Label>
              <Select
                value={editingCost.category}
                onValueChange={(value: typeof editingCost.category) =>
                  setEditingCost({
                    ...editingCost,
                    category: value,
                  })
                }
              >
                <SelectTrigger className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
                  <SelectValue placeholder="Selecionar categoria do custo" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">Recorrência</Label>
              <Select
                value={editingCost.recurrence}
                onValueChange={(value: typeof editingCost.recurrence) =>
                  setEditingCost({
                    ...editingCost,
                    recurrence: value,
                  })
                }
              >
                <SelectTrigger className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
                  <SelectValue placeholder="Selecionar recorrência do custo" />
                </SelectTrigger>
                <SelectContent>
                  {recurrences.map(recurrence => (
                    <SelectItem key={recurrence.value} value={recurrence.value}>
                      {recurrence.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Data de vencimento
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
        <h3 className="text-lg font-medium">Custos fixos configurados</h3>

        {state.fixedCosts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <DollarSign className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>Nenhum custo fixo configurado.</p>
            <p className="text-sm">Clique em &quot;Adicionar custo&quot; para começar.</p>
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

      {/* Dialog de confirmação */}
      {confirmationState && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          description={confirmationState.description}
          variant={confirmationState.variant}
          confirmText={confirmationState.confirmText}
          confirmButtonText={confirmationState.confirmButtonText}
          cancelButtonText={confirmationState.cancelButtonText}
        />
      )}
    </div>
  );
}
