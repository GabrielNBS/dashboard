'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  Target,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatting/formatCurrency';
import type { FinanceSummary } from '@/hooks/business/useSummaryFinance';
import { cn } from '@/utils/utils';
import LazyFinancePieChart from './LazyFinancePieChart';
import LordIcon from '@/components/ui/LordIcon';

interface FinancialMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  financialSummary: FinanceSummary;
}

export default function FinancialMetricsModal({
  isOpen,
  onClose,
  financialSummary,
}: FinancialMetricsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Estilos padronizados para cards e containers
  const cardStyles = {
    base: 'bg-card rounded-lg shadow-sm p-4',
    withBorder: 'bg-card rounded-lg border p-4',
    metric: 'bg-card rounded-lg shadow-sm p-4',
    info: 'bg-info/10 border-info/20 rounded-lg border p-4',
    warning: 'bg-warning/10 border-warning/20 rounded-lg shadow-sm p-4',
    muted: 'bg-muted/50 rounded-lg shadow-sm p-4',
  };

  const {
    totalRevenue,
    totalVariableCost,
    totalFixedCost,
    grossProfit,
    netProfit,
    margin,
    breakEven,
    breakEvenUnits,
    averageSellingPrice,
    contributionMarginPercentage,
    healthIndicators,
    breakEvenProjection,
  } = financialSummary;

  const isInfinite = !isFinite(breakEvenUnits) || breakEvenUnits === Infinity;

  const getStatusConfig = () => {
    switch (healthIndicators.status) {
      case 'critical':
        return {
          icon: AlertTriangle,
          background: 'bg-bad/40',
          iconColor: 'text-critical',
          title: 'Situação Crítica',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          background: 'bg-warning/40',
          iconColor: 'text-warning',
          title: 'Atenção Necessária',
        };
      case 'healthy':
        return {
          icon: CheckCircle,
          background: 'bg-great/40',
          iconColor: 'text-great',
          title: 'Situação Saudável',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'breakeven', label: 'Ponto de Equilíbrio' },
    { id: 'health', label: 'Saúde Financeira' },
  ];

  // Renderiza no body usando portal
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] mx-auto flex max-w-5xl flex-col overflow-hidden bg-white shadow-2xl sm:inset-4 sm:rounded-xl md:inset-8 lg:top-1/2 lg:left-1/2 lg:h-[85vh] lg:w-[90vw] lg:max-w-5xl lg:-translate-x-1/2 lg:-translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35,
              duration: 0.5,
            }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <motion.div
                className={cn(
                  'relative bg-gradient-to-r px-3 py-3 sm:px-6 sm:py-6',
                  'from-primary to-primary/90'
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Close Button */}
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="absolute top-2 right-2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:top-4 sm:right-4 sm:p-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>

                <motion.h2
                  className="mb-2 pr-10 text-base font-bold text-white sm:mb-3 sm:pr-12 sm:text-xl md:text-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Análise Financeira Detalhada
                </motion.h2>

                <motion.div
                  className="flex flex-wrap gap-1.5 sm:gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white sm:px-3 sm:py-1 sm:text-sm',
                      config.background
                    )}
                  >
                    <StatusIcon className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                    {config.title}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white sm:px-3 sm:py-1 sm:text-sm">
                    <DollarSign className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                    <span className="hidden sm:inline">
                      {formatCurrency(totalRevenue)} em vendas
                    </span>
                    <span className="sm:hidden">{formatCurrency(totalRevenue)}</span>
                  </span>
                </motion.div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                className="border-b border-gray-200 bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <nav className="flex gap-2 overflow-x-auto px-3 sm:gap-4 sm:px-6" aria-label="Tabs">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'border-b-2 px-1 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:py-3 sm:text-sm',
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </motion.div>

              {/* Content */}
              <motion.div
                className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 sm:p-4 md:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Métricas Principais */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
                      <div className={cardStyles.metric}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <DollarSign className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Receita Total
                          </h2>
                        </div>
                        <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                          {formatCurrency(totalRevenue)}
                        </p>
                      </div>

                      <div className={cardStyles.metric}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <TrendingUp className="text-on-great h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Lucro Líquido
                          </h2>
                        </div>
                        <p
                          className={cn(
                            'text-base font-bold sm:text-xl md:text-2xl',
                            netProfit >= 0 ? 'text-on-great' : 'text-critical'
                          )}
                        >
                          {formatCurrency(netProfit)}
                        </p>
                      </div>

                      <div className={cardStyles.metric}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <PieChart className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">Margem</h2>
                        </div>
                        <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                          {formatPercent(margin)}
                        </p>
                      </div>

                      <div className={cardStyles.metric}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <Target className="text-info h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Lucro Bruto
                          </h2>
                        </div>
                        <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                          {formatCurrency(grossProfit)}
                        </p>
                      </div>
                    </div>

                    {/* Custos */}
                    <div>
                      <h3 className="text-foreground mb-2 text-base font-semibold sm:mb-3 sm:text-lg">
                        Estrutura de Custos
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                        <div className={cardStyles.warning}>
                          <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                            <h2 className="text-foreground text-xs font-medium sm:text-sm">
                              Custos Variáveis
                            </h2>
                            <span className="text-on-warning text-xs font-medium">
                              {totalRevenue > 0
                                ? `${((totalVariableCost / totalRevenue) * 100).toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                          <p className="text-primary text-base font-bold sm:text-xl">
                            {formatCurrency(totalVariableCost)}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Custos que variam com as vendas
                          </p>
                        </div>

                        <div className={cardStyles.muted}>
                          <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                            <h2 className="text-foreground text-xs font-medium sm:text-sm">
                              Custos Fixos
                            </h2>
                            <span className="text-muted-foreground text-xs font-medium">
                              {totalRevenue > 0
                                ? `${((totalFixedCost / totalRevenue) * 100).toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                          <p className="text-foreground text-base font-bold sm:text-xl">
                            {formatCurrency(totalFixedCost)}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">Custos fixos mensais</p>
                        </div>
                      </div>
                    </div>

                    {/* Gráfico */}
                    <div>
                      <h3 className="text-foreground mb-2 text-base font-semibold sm:mb-3 sm:text-lg">
                        Distribuição Financeira
                      </h3>
                      <div className={cardStyles.base}>
                        <div className="h-64 sm:h-64">
                          <LazyFinancePieChart financialSummary={financialSummary} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'breakeven' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Métricas de Ponto de Equilíbrio */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                      <div className={cardStyles.withBorder}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <Target className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Ponto de Equilíbrio
                          </h2>
                        </div>
                        <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                          {isInfinite ? '∞' : breakEvenUnits}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {isInfinite ? 'Negócio não é viável' : 'unidades necessárias'}
                        </p>
                      </div>

                      <div className={cardStyles.withBorder}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <Package className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Preço Médio
                          </h2>
                        </div>
                        <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                          {formatCurrency(averageSellingPrice)}
                        </p>
                        <p className="text-muted-foreground text-xs">por unidade vendida</p>
                      </div>

                      <div className={cardStyles.withBorder}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <TrendingUp className="text-on-great h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Margem de Contribuição
                          </h2>
                        </div>
                        <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                          {contributionMarginPercentage.toFixed(1)}%
                        </p>
                        <p className="text-muted-foreground text-xs">
                          lucro antes dos custos fixos
                        </p>
                      </div>

                      <div className={cardStyles.withBorder}>
                        <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                          <Calendar className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                          <h2 className="text-foreground text-xs font-medium sm:text-sm">
                            Projeção
                          </h2>
                        </div>
                        {breakEvenProjection ? (
                          <>
                            <p className="text-foreground text-base font-bold sm:text-xl md:text-2xl">
                              {breakEvenProjection.daysToBreakEven}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              dias para atingir o equilíbrio
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-on-great text-base font-bold sm:text-xl md:text-2xl">
                              ✓
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Ponto de equilíbrio atingido
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Explicação do Ponto de Equilíbrio */}
                    <div className={cardStyles.info}>
                      <h3 className="text-foreground mb-2 flex items-center gap-1.5 text-sm font-semibold sm:mb-3 sm:gap-2 sm:text-base md:text-lg">
                        <Target className="text-primary h-4 w-4 sm:h-5 sm:w-5" />O que é Ponto de
                        Equilíbrio?
                      </h3>
                      <p className="text-muted-foreground mb-3 text-xs sm:mb-4 sm:text-sm">
                        O ponto de equilíbrio é o momento em que sua receita cobre exatamente todos
                        os custos (fixos + variáveis). Abaixo disso, você tem prejuízo; acima,
                        lucro.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="bg-primary/10 rounded-full p-1.5 sm:p-2">
                            <DollarSign className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-foreground text-xs font-medium sm:text-sm">
                              Ponto de Equilíbrio em Receita
                            </h2>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              {formatCurrency(breakEven)} - Receita necessária para cobrir todos os
                              custos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="bg-accent/10 rounded-full p-1.5 sm:p-2">
                            <Package className="text-accent h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-foreground text-xs font-medium sm:text-sm">
                              Ponto de Equilíbrio em Unidades
                            </h2>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              {isInfinite
                                ? 'Negócio não é viável com os custos e preços atuais'
                                : `${breakEvenUnits} unidades - Quantidade necessária para empatar`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progresso até o Ponto de Equilíbrio */}
                    {!isInfinite && isFinite(breakEven) && (
                      <div className={cardStyles.withBorder}>
                        <h3 className="text-foreground mb-2 text-base font-semibold sm:mb-3 sm:text-lg">
                          Progresso até o Equilíbrio
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground">Receita Atual</span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(totalRevenue)}
                            </span>
                          </div>
                          <div className="bg-muted h-2 w-full overflow-hidden rounded-full sm:h-3">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                totalRevenue >= breakEven ? 'bg-great' : 'bg-warning'
                              )}
                              style={{
                                width: `${Math.min((totalRevenue / breakEven) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground">
                              Meta (Ponto de Equilíbrio)
                            </span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(breakEven)}
                            </span>
                          </div>
                          {totalRevenue < breakEven && (
                            <p className="text-warning text-xs font-medium sm:text-sm">
                              Faltam {formatCurrency(breakEven - totalRevenue)} para atingir o ponto
                              de equilíbrio
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'health' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Status Geral - Card Principal */}
                    <div
                      className={cn(
                        'rounded-lg border-2 p-3 shadow-sm transition-all sm:rounded-xl sm:p-6',
                        healthIndicators.status === 'critical' && 'bg-critical/5',
                        healthIndicators.status === 'warning' && 'bg-warning/5',
                        healthIndicators.status === 'healthy' && 'bg-great/5'
                      )}
                    >
                      <div className="flex items-start gap-2 sm:gap-4">
                        <div
                          className={cn(
                            'rounded-lg p-2 shadow-sm sm:rounded-xl sm:p-3.5',
                            healthIndicators.status === 'critical' && 'bg-critical/15',
                            healthIndicators.status === 'warning' && 'bg-warning/15',
                            healthIndicators.status === 'healthy' && 'bg-on-great'
                          )}
                        >
                          <StatusIcon className={cn('h-5 w-5 sm:h-7 sm:w-7', config.iconColor)} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-foreground mb-1 text-base font-bold sm:mb-1.5 sm:text-xl">
                            {config.title}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                            Análise automática baseada em receitas, custos e margem de lucro
                          </p>
                        </div>
                      </div>

                      {/* Métricas Rápidas */}
                      <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 sm:mt-5 sm:gap-4 sm:pt-5">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-wide uppercase sm:mb-1 sm:text-xs">
                            Margem
                          </p>
                          <p
                            className={cn(
                              'text-base font-bold sm:text-2xl',
                              margin >= 20
                                ? 'text-on-great'
                                : margin >= 10
                                  ? 'text-on-warning'
                                  : 'text-on-bad'
                            )}
                          >
                            {formatPercent(margin)}
                          </p>
                        </div>
                        <div className="border-r border-l text-center">
                          <p className="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-wide uppercase sm:mb-1 sm:text-xs">
                            Lucro Líquido
                          </p>
                          <p
                            className={cn(
                              'text-base font-bold sm:text-2xl',
                              netProfit >= 0 ? 'text-on-great' : 'text-on-bad'
                            )}
                          >
                            {formatCurrency(netProfit)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-wide uppercase sm:mb-1 sm:text-xs">
                            Status
                          </p>
                          <p
                            className={cn(
                              'text-sm font-bold tracking-wide uppercase sm:text-lg',
                              healthIndicators.status === 'critical' && 'text-on-bad',
                              healthIndicators.status === 'warning' && 'text-on-warning',
                              healthIndicators.status === 'healthy' && 'text-on-great'
                            )}
                          >
                            {healthIndicators.status === 'critical'
                              ? 'Crítico'
                              : healthIndicators.status === 'warning'
                                ? 'Atenção'
                                : 'Saudável'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Alertas e Indicadores */}
                    {healthIndicators.alerts.length > 0 && (
                      <div className="bg-card rounded-lg border p-3 shadow-sm sm:rounded-xl sm:p-6">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-2.5">
                          <div className="bg-primary/10 rounded-lg p-1.5 sm:p-2">
                            <AlertCircle className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div>
                            <h2 className="text-foreground text-sm font-bold sm:text-base md:text-lg">
                              Indicadores de Atenção
                            </h2>
                            <p className="text-muted-foreground text-[10px] sm:text-xs">
                              {healthIndicators.alerts.length}{' '}
                              {healthIndicators.alerts.length === 1 ? 'ponto' : 'pontos'} que
                              requerem sua atenção
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2 sm:space-y-3">
                          {healthIndicators.alerts.map((alert, index) => (
                            <li
                              key={index}
                              className="bg-muted/30 hover:bg-muted/50 flex items-start gap-2 rounded-lg p-2.5 transition-colors sm:gap-3.5 sm:p-3.5"
                            >
                              <span className="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm sm:h-7 sm:w-7 sm:text-sm">
                                {index + 1}
                              </span>
                              <span className="text-foreground flex-1 pt-0.5 text-xs leading-relaxed font-medium sm:text-sm">
                                {alert}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recomendações */}
                    {healthIndicators.recommendations.length > 0 && (
                      <div className="bg-accent/8 rounded-lg border p-3 shadow-sm sm:rounded-xl sm:p-6">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-2.5">
                          <div className="bg-accent/15 rounded-lg p-1.5 sm:p-2">
                            <Lightbulb className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div>
                            <h2 className="text-foreground text-sm font-bold sm:text-base md:text-lg">
                              Recomendações Estratégicas
                            </h2>
                            <p className="text-muted-foreground text-[10px] sm:text-xs">
                              Ações sugeridas para melhorar a saúde financeira
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2 sm:space-y-3">
                          {healthIndicators.recommendations.map((recommendation, index) => (
                            <li
                              key={index}
                              className="bg-card/50 hover:bg-card/80 flex items-start gap-2 rounded-lg p-2.5 transition-colors sm:gap-3.5 sm:p-3.5"
                            >
                              <div className="bg-accent/15 text-accent mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-7 sm:w-7">
                                <LordIcon
                                  src="https://cdn.lordicon.com/zllgguxq.json"
                                  width={16}
                                  height={16}
                                  isActive={true}
                                  colors={{
                                    primary: '#000000',
                                    secondary: '#000000',
                                  }}
                                />
                              </div>
                              <span className="text-foreground flex-1 pt-0.5 text-xs leading-relaxed font-medium sm:text-sm">
                                {recommendation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mensagem quando não há alertas */}
                    {healthIndicators.alerts.length === 0 &&
                      healthIndicators.recommendations.length === 0 && (
                        <div className="bg-great/5 border-great/30 rounded-lg border p-4 text-center sm:rounded-xl sm:p-8">
                          <div className="bg-great/10 mx-auto mb-3 inline-flex rounded-full p-3 sm:mb-4 sm:p-4">
                            <CheckCircle className="text-great h-6 w-6 sm:h-8 sm:w-8" />
                          </div>
                          <h3 className="text-foreground mb-1.5 text-base font-bold sm:mb-2 sm:text-lg">
                            Tudo está em ordem!
                          </h3>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            Seu negócio está com boa saúde financeira. Continue monitorando as
                            métricas regularmente.
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
