// src/components/dashboard/settings/VariableCostsSection.tsx
// Seção de configurações de custos variáveis

'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { VariableCostSettings } from '@/types/settings';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { Calculator, Plus, Edit, Trash2 } from 'lucide-react';
import { CurrencyInput, PercentageInput } from '@/components/ui/forms';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';
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
  const [isAdding, setIsAdding] = useState(false);
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
    setIsAdding(true);
  };

  const handleEditCost = (cost: VariableCostSettings) => {
    setEditingCost(cost);
    setIsAdding(false);
  };

  const handleSaveCost = () => {
    if (editingCost && editingCost.name.trim()) {
      if (isAdding) {
        dispatch({ type: 'ADD_VARIABLE_COST', payload: editingCost });
      } else {
        dispatch({ type: 'UPDATE_VARIABLE_COST', payload: editingCost });
      }
      setEditingCost(null);
      setIsAdding(false);
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

  const handleCancel = () => {
    setEditingCost(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="text-primary h-6 w-6" />
          <h2 className="text-xl font-semibold">Custos variáveis</h2>
        </div>
        <Button onClick={handleAddCost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Custo
        </Button>
      </div>

      {/* Resumo */}
      <div className="bg-accent/10 rounded-lg p-4">
        <h3 className="text-foreground mb-2 text-lg font-medium">Resumo dos custos variáveis</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-accent">Total de Custos:</span>
            <span className="text-foreground ml-2 font-bold">
              {state.variableCosts.length} custo(s)
            </span>
          </div>
          <div>
            <span className="text-accent">Tipos:</span>
            <span className="text-foreground ml-2 font-bold">
              {new Set(state.variableCosts.map(cost => cost.type)).size} tipo(s)
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      {editingCost && (
        <div className="bg-muted space-y-4 rounded-lg p-4">
          <h3 className="text-lg font-medium">
            {isAdding ? 'Adicionar Novo Custo Variável' : 'Editar Custo Variável'}
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-muted-foreground mb-1 block text-sm font-medium">
                Nome do Custo *
              </label>
              <Input
                value={editingCost.name}
                onChange={e => setEditingCost({ ...editingCost, name: e.target.value })}
                placeholder="Ex: Ingredientes, Embalagens, Comissões"
                required
              />
            </div>

            <div>
              <Label className="text-muted-foreground mb-1 block text-sm font-medium">
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
                  <SelectValue placeholder="Selecionar tipo de custo variável" />
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
              <Label className="text-muted-foreground mb-1 block text-sm font-medium">
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
                  <SelectValue placeholder="Selecionar categoria do custo variável" />
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
              <label className="text-muted-foreground mb-1 block text-sm font-medium">
                Percentual sobre Vendas (%)
              </label>
              <PercentageInput
                value={editingCost.percentage?.toString() || ''}
                onChange={value =>
                  setEditingCost({ ...editingCost, percentage: parseFloat(value) || 0 })
                }
                placeholder="0%"
                maxValue={PERCENTAGE_LIMITS.variableCost.max}
                minValue={PERCENTAGE_LIMITS.variableCost.min}
              />
            </div>

            <div>
              <label className="text-muted-foreground mb-1 block text-sm font-medium">
                Valor Fixo por Unidade (R$)
              </label>
              <CurrencyInput
                value={editingCost.fixedValue?.toString() || ''}
                onChange={value =>
                  setEditingCost({ ...editingCost, fixedValue: parseFloat(value) || 0 })
                }
                placeholder="R$ 0,00"
                maxValue={CURRENCY_LIMITS.variableCost.max}
                minValue={CURRENCY_LIMITS.variableCost.min}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-muted-foreground mb-1 block text-sm font-medium">
                Observações
              </label>
              <textarea
                value={editingCost.notes}
                onChange={e => setEditingCost({ ...editingCost, notes: e.target.value })}
                placeholder="Observações adicionais sobre este custo..."
                className="focus:ring-primary border-border w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
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

      {/* Lista de Custos Variáveis */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Custos Variáveis Configurados</h3>

        {state.variableCosts.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <Calculator className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <p>Nenhum custo variável configurado.</p>
            <p className="text-sm">Clique em &apos;Adicionar Custo&apos; para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.variableCosts.map(cost => (
              <div
                key={cost.id}
                className="border-border bg-card rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-foreground font-medium">{cost.name}</h4>
                      <span className="bg-accent/20 text-accent rounded-full px-2 py-1 text-xs">
                        {cost.type}
                      </span>
                      <span className="bg-primary/20 text-primary rounded-full px-2 py-1 text-xs">
                        {cost.category}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-2 grid grid-cols-2 gap-4 text-sm">
                      {cost.percentage && cost.percentage > 0 && (
                        <div>
                          <span className="font-medium">Percentual:</span>
                          <span className="ml-1">{cost.percentage}%</span>
                        </div>
                      )}
                      {cost.fixedValue && cost.fixedValue > 0 && (
                        <div>
                          <span className="font-medium">Valor Fixo:</span>
                          <span className="ml-1">R$ {cost.fixedValue.toFixed(2)}</span>
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
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCost(cost.id)}
                      className="text-destructive hover:text-destructive/80"
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
