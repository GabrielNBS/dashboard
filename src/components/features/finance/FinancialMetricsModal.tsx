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
          borderStatus: 'border-critical',
          iconColor: 'text-critical',
          title: 'Situação Crítica',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          background: 'bg-warning/40',
          borderStatus: 'border-warning',
          iconColor: 'text-warning',
          title: 'Atenção Necessária',
        };
      case 'healthy':
        return {
          icon: CheckCircle,
          background: 'bg-great/40',
          borderStatus: 'border-great',
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
            className="fixed inset-4 z-[9999] mx-auto flex max-w-5xl flex-col overflow-hidden bg-white shadow-2xl sm:inset-6 md:inset-8 lg:top-1/2 lg:left-1/2 lg:h-[85vh] lg:w-[90vw] lg:max-w-5xl lg:-translate-x-1/2 lg:-translate-y-1/2"
            style={{ borderRadius: 12 }}
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
                  'relative border-t-4 bg-gradient-to-r px-4 py-4 sm:px-6 sm:py-6',
                  config.borderStatus,
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
                  className="absolute top-3 right-3 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:top-4 sm:right-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                <motion.h2
                  className="mb-3 pr-12 text-xl font-bold text-white sm:text-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Análise Financeira Detalhada
                </motion.h2>

                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white',
                      config.background
                    )}
                  >
                    <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                    {config.title}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                    <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                    {formatCurrency(totalRevenue)} em vendas
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
                <nav className="flex gap-4 px-4 sm:px-6" aria-label="Tabs">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'border-b-2 px-1 py-3 text-sm font-medium transition-colors',
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
                className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Métricas Principais */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className={cardStyles.metric}>
                        <div className="mb-2 flex items-center gap-2">
                          <DollarSign className="text-primary h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">Receita Total</h2>
                        </div>
                        <p className="text-foreground text-2xl font-bold">
                          {formatCurrency(totalRevenue)}
                        </p>
                      </div>

                      <div className={cardStyles.metric}>
                        <div className="mb-2 flex items-center gap-2">
                          <TrendingUp className="text-on-great h-5 w-5" />
                          <h2 className="text-foreground font-md text-sm">Lucro Líquido</h2>
                        </div>
                        <p
                          className={cn(
                            'text-2xl font-bold',
                            netProfit >= 0 ? 'text-on-great' : 'text-critical'
                          )}
                        >
                          {formatCurrency(netProfit)}
                        </p>
                      </div>

                      <div className={cardStyles.metric}>
                        <div className="mb-2 flex items-center gap-2">
                          <PieChart className="text-accent h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">Margem</h2>
                        </div>
                        <p className="text-foreground text-2xl font-bold">
                          {formatPercent(margin)}
                        </p>
                      </div>

                      <div className={cardStyles.metric}>
                        <div className="mb-2 flex items-center gap-2">
                          <Target className="text-info h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">Lucro Bruto</h2>
                        </div>
                        <p className="text-foreground text-2xl font-bold">
                          {formatCurrency(grossProfit)}
                        </p>
                      </div>
                    </div>

                    {/* Custos */}
                    <div>
                      <h3 className="text-foreground mb-3 text-lg font-semibold">
                        Estrutura de Custos
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className={cardStyles.warning}>
                          <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-foreground text-sm font-medium">
                              Custos Variáveis
                            </h2>
                            <span className="text-on-warning text-xs font-medium">
                              {totalRevenue > 0
                                ? `${((totalVariableCost / totalRevenue) * 100).toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                          <p className="text-primary text-xl font-bold">
                            {formatCurrency(totalVariableCost)}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Custos que variam com as vendas
                          </p>
                        </div>

                        <div className={cardStyles.muted}>
                          <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-foreground text-sm font-medium">Custos Fixos</h2>
                            <span className="text-muted-foreground text-xs font-medium">
                              {totalRevenue > 0
                                ? `${((totalFixedCost / totalRevenue) * 100).toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                          <p className="text-foreground text-xl font-bold">
                            {formatCurrency(totalFixedCost)}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">Custos fixos mensais</p>
                        </div>
                      </div>
                    </div>

                    {/* Gráfico */}
                    <div>
                      <h3 className="text-foreground mb-3 text-lg font-semibold">
                        Distribuição Financeira
                      </h3>
                      <div className={cardStyles.base}>
                        <div className="h-64">
                          <LazyFinancePieChart financialSummary={financialSummary} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'breakeven' && (
                  <div className="space-y-6">
                    {/* Métricas de Ponto de Equilíbrio */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className={cardStyles.withBorder}>
                        <div className="mb-2 flex items-center gap-2">
                          <Target className="text-primary h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">
                            Ponto de Equilíbrio
                          </h2>
                        </div>
                        <p className="text-foreground text-2xl font-bold">
                          {isInfinite ? '∞' : breakEvenUnits}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {isInfinite ? 'Negócio não é viável' : 'unidades necessárias'}
                        </p>
                      </div>

                      <div className={cardStyles.withBorder}>
                        <div className="mb-2 flex items-center gap-2">
                          <Package className="text-accent h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">Preço Médio</h2>
                        </div>
                        <p className="text-foreground text-2xl font-bold">
                          {formatCurrency(averageSellingPrice)}
                        </p>
                        <p className="text-muted-foreground text-xs">por unidade vendida</p>
                      </div>

                      <div className={cardStyles.withBorder}>
                        <div className="mb-2 flex items-center gap-2">
                          <TrendingUp className="text-great h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">
                            Margem de Contribuição
                          </h2>
                        </div>
                        <p className="text-foreground text-2xl font-bold">
                          {contributionMarginPercentage.toFixed(1)}%
                        </p>
                        <p className="text-muted-foreground text-xs">
                          lucro antes dos custos fixos
                        </p>
                      </div>

                      <div className={cardStyles.withBorder}>
                        <div className="mb-2 flex items-center gap-2">
                          <Calendar className="text-info h-5 w-5" />
                          <h2 className="text-foreground text-sm font-medium">Projeção</h2>
                        </div>
                        {breakEvenProjection ? (
                          <>
                            <p className="text-foreground text-2xl font-bold">
                              {breakEvenProjection.daysToBreakEven}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              dias para atingir o equilíbrio
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-great text-2xl font-bold">✓</p>
                            <p className="text-muted-foreground text-xs">
                              Ponto de equilíbrio atingido
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Explicação do Ponto de Equilíbrio */}
                    <div className={cardStyles.info}>
                      <h3 className="text-foreground mb-3 flex items-center gap-2 text-lg font-semibold">
                        <Target className="text-info h-5 w-5" />O que é Ponto de Equilíbrio?
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        O ponto de equilíbrio é o momento em que sua receita cobre exatamente todos
                        os custos (fixos + variáveis). Abaixo disso, você tem prejuízo; acima,
                        lucro.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <DollarSign className="text-primary h-4 w-4" />
                          </div>
                          <div>
                            <h2 className="text-foreground text-sm font-medium">
                              Ponto de Equilíbrio em Receita
                            </h2>
                            <p className="text-muted-foreground text-sm">
                              {formatCurrency(breakEven)} - Receita necessária para cobrir todos os
                              custos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-accent/10 rounded-full p-2">
                            <Package className="text-accent h-4 w-4" />
                          </div>
                          <div>
                            <h2 className="text-foreground text-sm font-medium">
                              Ponto de Equilíbrio em Unidades
                            </h2>
                            <p className="text-muted-foreground text-sm">
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
                        <h3 className="text-foreground mb-3 text-lg font-semibold">
                          Progresso até o Equilíbrio
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Receita Atual</span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(totalRevenue)}
                            </span>
                          </div>
                          <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
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
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Meta (Ponto de Equilíbrio)
                            </span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(breakEven)}
                            </span>
                          </div>
                          {totalRevenue < breakEven && (
                            <p className="text-warning text-sm font-medium">
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
                  <div className="space-y-6">
                    {/* Status Geral */}
                    <div
                      className={cn(
                        'rounded-lg border-2 p-6',
                        healthIndicators.status === 'critical' && 'border-critical bg-critical/10',
                        healthIndicators.status === 'warning' && 'border-warning bg-warning/10',
                        healthIndicators.status === 'healthy' && 'border-great bg-great/10'
                      )}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className={cn(
                            'rounded-full p-3',
                            healthIndicators.status === 'critical' && 'bg-critical/20',
                            healthIndicators.status === 'warning' && 'bg-warning/20',
                            healthIndicators.status === 'healthy' && 'bg-great/20'
                          )}
                        >
                          <StatusIcon className={cn('h-6 w-6', config.iconColor)} />
                        </div>
                        <div>
                          <h3 className="text-foreground text-xl font-semibold">{config.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            Análise automática da saúde do negócio
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Alertas */}
                    {healthIndicators.alerts.length > 0 && (
                      <div className={cardStyles.withBorder}>
                        <div className="mb-3 flex items-center gap-2">
                          <TrendingUp className="text-muted-foreground h-5 w-5" />
                          <h2 className="text-foreground text-lg font-semibold">Indicadores</h2>
                        </div>
                        <ul className="space-y-3">
                          {healthIndicators.alerts.map((alert, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground flex items-start gap-3 text-sm"
                            >
                              <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="flex-1">{alert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recomendações */}
                    {healthIndicators.recommendations.length > 0 && (
                      <div className="bg-accent/10 border-accent/20 rounded-lg border p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Lightbulb className="text-accent h-5 w-5" />
                          <h2 className="text-foreground text-lg font-semibold">Recomendações</h2>
                        </div>
                        <ul className="space-y-3">
                          {healthIndicators.recommendations.map((recommendation, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground flex items-start gap-3 text-sm"
                            >
                              <span className="text-accent mt-0.5 text-lg">→</span>
                              <span className="flex-1">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
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
