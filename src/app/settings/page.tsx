// src/app/settings/page.tsx
// Página de configurações do sistema

'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { Settings, Store, DollarSign, Calculator, Cog, Save, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

// Componentes das seções
import StoreSettingsSection from '@/components/dashboard/settings/StoreSettingsSection';
import FixedCostsSection from '@/components/dashboard/settings/FixedCostsSection';
import VariableCostsSection from '@/components/dashboard/settings/VariableCostsSection';
import FinancialSettingsSection from '@/components/dashboard/settings/FinancialSettingsSection';
import SystemSettingsSection from '@/components/dashboard/settings/SystemSettingsSection';

export default function SettingsPage() {
  const { state, saveSettings, resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('store');
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    { id: 'store', label: 'Dados da Loja', icon: Store },
    { id: 'fixed-costs', label: 'Custos Fixos', icon: DollarSign },
    { id: 'variable-costs', label: 'Custos Variáveis', icon: Calculator },
    { id: 'financial', label: 'Configurações Financeiras', icon: DollarSign },
    { id: 'system', label: 'Sistema', icon: Cog },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveSettings();
      // Simular delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aqui você pode adicionar uma notificação de sucesso
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      // Aqui você pode adicionar uma notificação de erro
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const confirm = window.confirm(
      'Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.'
    );
    if (confirm) {
      resetSettings();
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'store':
        return <StoreSettingsSection />;
      case 'fixed-costs':
        return <FixedCostsSection />;
      case 'variable-costs':
        return <VariableCostsSection />;
      case 'financial':
        return <FinancialSettingsSection />;
      case 'system':
        return <SystemSettingsSection />;
      default:
        return <StoreSettingsSection />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="text-primary h-8 w-8" />
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Resetar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Navegação das seções */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              activeSection === id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo da seção ativa */}
      <div className="min-h-[600px]">{renderSection()}</div>
    </div>
  );
}
