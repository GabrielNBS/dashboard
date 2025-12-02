'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { VariableCostSettings } from '@/types/settings';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { Calculator, Plus, Edit, Trash2, FileText, Tag, Percent } from 'lucide-react';
import { CurrencyInput, PercentageInput } from '@/components/ui/forms';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import {
  ConfirmationDialog,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/feedback';
import { CURRENCY_LIMITS, PERCENTAGE_LIMITS } from '@/schemas/validationSchemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Label } from '@/components/ui/base/label';

export default function VariableCostsSection() {
  const { state, dispatch } = useSettings();
  const [editingCost, setEditingCost] = useState<VariableCostSettings | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  const types = [
    { value: 'ingredientes', label: 'Ingredientes' },
    { value: 'embalagens', label: 'Embalagens' },
    { value: 'comissoes', label: 'Comissões' },
    { value: 'outros', label: 'Outros' },
  ];

  const categories = [
    { value: 'materia_prima', label: 'Matéria Prima' },
    { value: 'operacional', label: 'Operacional' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'outros', label: 'Outros' },
  ];

  const handleAddCost = () => {
    const newCost: VariableCostSettings = {
      id: Date.now().toString(),
      name: '',
      type: 'outros',
      category: 'outros',
      percentage: 0,
      fixedValue: 0,
      notes: '',
    };
    setEditingCost(newCost);
    setIsSheetOpen(true);
  };

  const handleEditCost = (cost: VariableCostSettings) => {
    setEditingCost({ ...cost });
    setIsSheetOpen(true);
  };

  const handleSaveCost = () => {
    if (editingCost && editingCost.name.trim()) {
      const isNew = !state.variableCosts.find(c => c.id === editingCost.id);
      if (isNew) {
        dispatch({ type: 'ADD_VARIABLE_COST', payload: editingCost });
      } else {
        dispatch({ type: 'UPDATE_VARIABLE_COST', payload: editingCost });
      }
      setEditingCost(null);
      setIsSheetOpen(false);
    }
  };

  const handleDeleteCost = (id: string) => {
    const cost = state.variableCosts.find(cost => cost.id === id);
    const costName = cost?.name || 'este custo variável';

    showConfirmation(
      {
        title: 'Excluir Custo Variável',
        description: `Tem certeza que deseja excluir "${costName}"? Esta ação não pode ser desfeita.`,
        variant: 'destructive',
      },
      () => {
        dispatch({ type: 'REMOVE_VARIABLE_COST', payload: id });
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-10 flex items-center justify-center gap-3">
        <Calculator className="text-primary h-6 w-6" />
        <h2 className="text-lg font-bold lg:text-xl">Custos Variáveis</h2>
      </div>

      {/* Lista de Custos Variáveis */}
      <div className="space-y-4">
        {state.variableCosts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
            <Calculator className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">Nenhum custo variável configurado</p>
            <p className="text-sm">Adicione custos que variam conforme suas vendas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {state.variableCosts.map(cost => (
              <div
                key={cost.id}
                className="group hover:border-primary/20 relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{cost.name}</h4>
                      <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize">
                        {cost.type}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {(cost.percentage ?? 0) > 0 && (
                        <p className="flex items-center gap-1 text-lg font-bold text-gray-900">
                          {cost.percentage}%
                          <span className="text-sm font-normal text-gray-500">sobre vendas</span>
                        </p>
                      )}
                      {(cost.fixedValue ?? 0) > 0 && (
                        <p className="flex items-center gap-1 text-lg font-bold text-gray-900">
                          R$ {cost.fixedValue?.toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">por unidade</span>
                        </p>
                      )}
                    </div>
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
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="capitalize">{cost.category.replace('_', ' ')}</span>
                  </div>
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
        <h3 className="text-secondary mb-4 text-lg font-medium">Resumo dos custos variáveis</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-gray-700">Quantidade</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">{state.variableCosts.length}</span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">Tipos</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {new Set(state.variableCosts.map(cost => cost.type)).size}
            </span>
          </div>
        </div>
      </div>

      {/* Sheet de Edição/Adição */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingCost?.id && state.variableCosts.find(c => c.id === editingCost.id)
                ? 'Editar Custo Variável'
                : 'Adicionar Custo Variável'}
            </SheetTitle>
            <SheetDescription>Preencha as informações do custo variável abaixo.</SheetDescription>
          </SheetHeader>

          {editingCost && (
            <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome do Custo *
                  </label>
                  <Input
                    value={editingCost.name}
                    onChange={e => setEditingCost({ ...editingCost, name: e.target.value })}
                    placeholder="Ex: Ingredientes, Embalagens, Comissões"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      Tipo de Custo
                    </Label>
                    <Select
                      value={editingCost.type}
                      onValueChange={(value: VariableCostSettings['type']) =>
                        setEditingCost({
                          ...editingCost,
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm font-medium text-gray-700">
                      Categoria
                    </Label>
                    <Select
                      value={editingCost.category}
                      onValueChange={(value: VariableCostSettings['category']) =>
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
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      % sobre Vendas
                    </label>
                    <PercentageInput
                      value={editingCost.percentage?.toString() || ''}
                      onChange={value =>
                        setEditingCost({ ...editingCost, percentage: parseFloat(value) || 0 })
                      }
                      placeholder="0%"
                      maxValue={PERCENTAGE_LIMITS.variableCost.max}
                      min={PERCENTAGE_LIMITS.variableCost.min}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Valor Fixo (R$)
                    </label>
                    <CurrencyInput
                      value={editingCost.fixedValue?.toString() || ''}
                      onChange={value =>
                        setEditingCost({ ...editingCost, fixedValue: parseFloat(value) || 0 })
                      }
                      placeholder="R$ 0,00"
                      maxValue={CURRENCY_LIMITS.variableCost.max}
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
