// src/app/settings/page.tsx
// Página de configurações do sistema

'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { Store, DollarSign, Calculator, CreditCard, Cog, Save, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';

// Componentes das seções
import StoreSettingsSection from '@/components/dashboard/settings/StoreSettingsSection';
import FixedCostsSection from '@/components/dashboard/settings/FixedCostsSection';
import VariableCostsSection from '@/components/dashboard/settings/VariableCostsSection';
import FinancialSettingsSection from '@/components/dashboard/settings/FinancialSettingsSection';
import PaymentFeesSection from '@/components/dashboard/settings/PaymentFeesSection';
import SystemSettingsSection from '@/components/dashboard/settings/SystemSettingsSection';
import { Header } from '@/components/ui/Header';

export default function SettingsPage() {
  const { saveSettings, resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('store');
  const [isSaving, setIsSaving] = useState(false);
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  const sections = [
    { id: 'store', label: 'Dados da loja', icon: Store },
    { id: 'fixed-costs', label: 'Custos fixos', icon: DollarSign },
    { id: 'variable-costs', label: 'Custos variáveis', icon: Calculator },
    { id: 'financial', label: 'Configurações Financeiras', icon: DollarSign },
    { id: 'payment-fees', label: 'Taxas de Pagamento', icon: CreditCard },
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
    showConfirmation(
      {
        title: 'Resetar Configurações',
        description:
          'Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita e todas as suas configurações personalizadas serão perdidas.',
        variant: 'destructive',
        confirmText: 'resetar configurações',
        confirmButtonText: 'Resetar Tudo',
      },
      () => {
        resetSettings();
      }
    );
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
      case 'payment-fees':
        return <PaymentFeesSection />;
      case 'system':
        return <SystemSettingsSection />;
      default:
        return <StoreSettingsSection />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Header title="Configurações" subtitle="Gerencie os dados da sua loja" />
        </div>

        <div
          className="flex flex-col gap-2 sm:flex-row"
          role="group"
          aria-label="Ações das configurações"
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center justify-center gap-2"
            aria-label="Resetar todas as configurações"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Resetar</span>
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2"
            aria-label={isSaving ? 'Salvando configurações...' : 'Salvar configurações'}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </Button>
        </div>
      </header>

      <section aria-labelledby="settings-navigation">
        <h2 id="settings-navigation" className="sr-only">
          Navegação das configurações
        </h2>
        <div className="border-border border-b">
          <nav
            className="flex space-x-1 overflow-x-auto pb-0"
            role="tablist"
            aria-label="Seções de configurações"
          >
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'text-muted-foreground hover:border-border hover:text-foreground border-transparent'
                }`}
                role="tab"
                aria-selected={activeSection === id}
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section
        className="min-h-[600px]"
        role="tabpanel"
        id={`panel-${activeSection}`}
        aria-labelledby={`tab-${activeSection}`}
      >
        {renderSection()}
      </section>

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
