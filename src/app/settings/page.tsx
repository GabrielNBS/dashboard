'use client';

import React, { useEffect, useState } from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import {
  Store,
  DollarSign,
  Calculator,
  CreditCard,
  Cog,
  RotateCcw,
  ClipboardPlus,
} from 'lucide-react';
import Button from '@/components/ui/base/Button';
import { useConfirmation } from '@/hooks/ui/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/feedback';
import { Header } from '@/components/ui/Header';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes das seções
import StoreSettingsSection from '@/components/dashboard/settings/StoreSettingsSection';
import FixedCostsSection from '@/components/dashboard/settings/FixedCostsSection';
import VariableCostsSection from '@/components/dashboard/settings/VariableCostsSection';
import FinancialSettingsSection from '@/components/dashboard/settings/FinancialSettingsSection';
import PaymentFeesSection from '@/components/dashboard/settings/PaymentFeesSection';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('store');
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm } =
    useConfirmation();

  const sections = [
    {
      id: 'store',
      label: 'Dados da Loja',
      icon: Store,
      description: 'Gerencie informações básicas e contato',
    },
    {
      id: 'fixed-costs',
      label: 'Custos Fixos',
      icon: DollarSign,
      description: 'Aluguel, salários e despesas recorrentes',
    },
    {
      id: 'variable-costs',
      label: 'Custos Variáveis',
      icon: Calculator,
      description: 'Comissões e gastos flutuantes',
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: ClipboardPlus,
      description: 'Metas e margens de lucro',
    },
    {
      id: 'payment-fees',
      label: 'Taxas',
      icon: CreditCard,
      description: 'Taxas de cartão e delivery',
    },
    { id: 'system', label: 'Sistema', icon: Cog, description: 'Preferências e backup' },
  ];

  const handleReset = () => {
    showConfirmation(
      {
        title: 'Resetar Configurações',
        description:
          'Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita e todas as suas configurações personalizadas serão perdidas.',
        variant: 'destructive',
        confirmText: 'Resetar Configurações',
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
        return (
          <div className="bg-card border-border flex flex-col items-center justify-center rounded-xl border py-16 text-center shadow-sm">
            <div className="bg-primary/10 mb-4 rounded-full p-4">
              <Cog className="text-primary h-10 w-10 animate-[spin_3s_linear_infinite]" />
            </div>
            <h3 className="text-foreground text-xl font-semibold">Em Desenvolvimento</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Estamos trabalhando nas configurações avançadas do sistema.
              <br />
              Em breve você terá controle total sobre backups e preferências.
            </p>
          </div>
        );
      default:
        return <StoreSettingsSection />;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Header Principal */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Header
          title="Configurações"
          subtitle="Gerencie todos os aspectos do seu negócio em um só lugar"
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 self-start border-dashed sm:self-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Resetar Padrões
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Sidebar de Navegação */}
        <nav className="sticky top-6 z-10 flex flex-col gap-2 lg:col-span-3">
          <div className="bg-card border-border grid grid-cols-6 gap-1 rounded-xl border p-1.5 shadow-sm lg:flex lg:flex-col">
            {sections.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  title={label}
                  className={`flex items-center justify-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 lg:w-full lg:justify-start lg:px-4 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <span className="hidden lg:inline">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="bg-primary ml-auto hidden h-1.5 w-1.5 rounded-full lg:block"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Área de Conteúdo */}
        <main className="min-h-[500px] lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
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
