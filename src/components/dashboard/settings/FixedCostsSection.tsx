'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { FixedCostSettings } from '@/types/settings';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { DollarSign, Plus, Edit, Trash2, Calendar, FileText, Tag } from 'lucide-react';
import { getTotalFixedCost } from '@/utils/calculations/finance';
import { CurrencyInput } from '@/components/ui/forms';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { CURRENCY_LIMITS } from '@/schemas/validationSchemas';
import { RECURRENCE_OPTIONS } from '@/types/settings';
import { FIXED_COST_CATEGORIES } from '@/types/settings';
import {
  ConfirmationDialog,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/feedback';
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

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
    setIsSheetOpen(true);
  };

  const handleEditCost = (cost: FixedCostSettings) => {
    setEditingCost({ ...cost });
    setIsSheetOpen(true);
  };

  const handleSaveCost = () => {
    if (editingCost && editingCost.name.trim()) {
      const isNew = !state.fixedCosts.find(c => c.id === editingCost.id);
      if (isNew) {
        dispatch({ type: 'ADD_FIXED_COST', payload: editingCost });
      } else {
        dispatch({ type: 'UPDATE_FIXED_COST', payload: editingCost });
      }
      setEditingCost(null);
      setIsSheetOpen(false);
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

  const totalFixedCosts = getTotalFixedCost(state.fixedCosts);

  return (
    <div className="space-y-6">
      <div className="mb-10 flex items-center justify-center gap-3">
        <DollarSign className="text-primary h-6 w-6" />
        <h2 className="text-lg font-bold lg:text-xl">Custos Fixos</h2>
      </div>

      {/* Lista de Custos Fixos */}
      <div className="space-y-4">
        {state.fixedCosts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
            <DollarSign className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">Nenhum custo fixo configurado</p>
            <p className="text-sm">
              Adicione seus custos recorrentes para ter um controle financeiro preciso.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {state.fixedCosts.map(cost => (
              <div
                key={cost.id}
                className="group hover:border-primary/20 relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{cost.name}</h4>
                      <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize">
                        {cost.category}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {cost.amount.toFixed(2)}
                      <span className="ml-1 text-sm font-normal text-gray-500">
                        /{cost.recurrence}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCost(cost)}
                      className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCost(cost.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                  {cost.dueDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Vence dia {new Date(cost.dueDate).getDate()}</span>
                    </div>
                  )}
                  {cost.notes && (
                    <div className="flex w-full items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{cost.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="from-primary to-primary/80 hidden flex-col rounded-lg bg-gradient-to-r p-6 lg:flex">
        <h3 className="text-secondary mb-4 text-lg font-medium">Resumo dos custos fixos</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <span className="font-medium text-gray-700">Total Mensal</span>
            </div>
            <span className="text-2xl font-bold text-red-600">R$ {totalFixedCosts.toFixed(2)}</span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">Quantidade</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{state.fixedCosts.length}</span>
          </div>
        </div>
      </div>

      {/* Sheet de Edição/Adição */}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingCost?.id && state.fixedCosts.find(c => c.id === editingCost.id)
                ? 'Editar Custo Fixo'
                : 'Adicionar Custo Fixo'}
            </SheetTitle>
            <SheetDescription>Preencha as informações do custo fixo abaixo.</SheetDescription>
          </SheetHeader>

          {editingCost && (
            <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
              <div className="space-y-3">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Valor *</label>
                    <CurrencyInput
                      value={editingCost.amount?.toString() || ''}
                      onChange={value =>
                        setEditingCost({ ...editingCost, amount: parseFloat(value) || 0 })
                      }
                      placeholder="R$ 0,00"
                      maxValue={CURRENCY_LIMITS.fixedCost.max}
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      Categoria
                    </Label>
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
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIXED_COST_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      Recorrência
                    </Label>
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
                        <SelectValue placeholder="Recorrência" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECURRENCE_OPTIONS.map(recurrence => (
                          <SelectItem key={recurrence} value={recurrence}>
                            {recurrence}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Vencimento
                    </label>
                    <Input
                      type="date"
                      value={editingCost.dueDate}
                      onChange={e => setEditingCost({ ...editingCost, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    value={editingCost.notes}
                    onChange={e => setEditingCost({ ...editingCost, notes: e.target.value })}
                    placeholder="Observações adicionais..."
                    className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCost} disabled={!editingCost?.name.trim()}>
              Salvar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="flex justify-center">
        <Button onClick={handleAddCost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Custo
        </Button>
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
