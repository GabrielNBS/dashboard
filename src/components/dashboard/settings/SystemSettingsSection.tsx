// src/components/dashboard/settings/SystemSettingsSection.tsx
// Seção de configurações do sistema

'use client';

import React from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import { Cog, Globe, Bell, Cloud, Moon, Sun, Monitor } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Label } from '@/components/ui/base/label';

export default function SystemSettingsSection() {
  const { state, dispatch } = useSettings();

  const handleSystemChange = (
    field: keyof typeof state.system,
    value: string | boolean | { [key: string]: boolean | string }
  ) => {
    dispatch({
      type: 'UPDATE_SYSTEM',
      payload: { [field]: value },
    });
  };

  const handleNotificationChange = (
    key: keyof typeof state.system.notifications,
    value: boolean
  ) => {
    dispatch({
      type: 'UPDATE_SYSTEM',
      payload: {
        notifications: {
          ...state.system.notifications,
          [key]: value,
        },
      },
    });
  };

  const handleBackupChange = (key: keyof typeof state.system.backup, value: string | boolean) => {
    dispatch({
      type: 'UPDATE_SYSTEM',
      payload: {
        backup: {
          ...state.system.backup,
          [key]: value,
        },
      },
    });
  };

  const languages = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' },
  ];

  const themes = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'auto', label: 'Automático', icon: Monitor },
  ];

  const backupFrequencies = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Cog className="text-primary h-6 w-6" />
        <h2 className="text-xl font-semibold">Configurações do sistema</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Idioma */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Idioma</h3>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Idioma do sistema
              </Label>
              <Select
                value={state.system.language}
                onValueChange={(value: string) => handleSystemChange('language', value)}
              >
                <SelectTrigger className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
                  <SelectValue placeholder="Selecionar idioma do sistema" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tema */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-gray-900">Tema</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tema do sistema
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map(theme => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.value}
                      onClick={() => handleSystemChange('theme', theme.value)}
                      className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                        state.system.theme === theme.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Estoque baixo</label>
                <p className="text-xs text-gray-500">
                  Alertas quando produtos estiverem com estoque baixo
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={state.system.notifications.lowStock}
                  onChange={e => handleNotificationChange('lowStock', e.target.checked)}
                  className="peer sr-only"
                  aria-label="Ativar notificações de estoque baixo"
                />
                <div className="peer-focus:ring-primary/20 peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Meta de vendas</label>
                <p className="text-xs text-gray-500">
                  Notificações sobre o progresso da meta mensal
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={state.system.notifications.salesGoal}
                  onChange={e => handleNotificationChange('salesGoal', e.target.checked)}
                  className="peer sr-only"
                  aria-label="Ativar notificações de meta de vendas"
                />
                <div className="peer-focus:ring-primary/20 peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Alertas de custos</label>
                <p className="text-xs text-gray-500">Avisos sobre custos elevados ou inesperados</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={state.system.notifications.costAlerts}
                  onChange={e => handleNotificationChange('costAlerts', e.target.checked)}
                  className="peer sr-only"
                  aria-label="Ativar alertas de custos"
                />
                <div className="peer-focus:ring-primary/20 peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Lembretes de backup</label>
                <p className="text-xs text-gray-500">Lembretes para fazer backup dos dados</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={state.system.notifications.backupReminder}
                  onChange={e => handleNotificationChange('backupReminder', e.target.checked)}
                  className="peer sr-only"
                  aria-label="Ativar lembretes de backup"
                />
                <div className="peer-focus:ring-primary/20 peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">Backup e segurança</h3>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Backup automático</label>
                <p className="text-xs text-gray-500">Fazer backup automático dos dados</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={state.system.backup.autoBackup}
                  onChange={e => handleBackupChange('autoBackup', e.target.checked)}
                  className="peer sr-only"
                  aria-label="Ativar backup automático"
                />
                <div className="peer-focus:ring-primary/20 peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Frequência do backup
              </Label>
              <Select
                value={state.system.backup.backupFrequency}
                onValueChange={(value: string) => handleBackupChange('backupFrequency', value)}
                disabled={!state.system.backup.autoBackup}
              >
                <SelectTrigger className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none">
                  <SelectValue placeholder="Selecionar frequência do backup" />
                </SelectTrigger>
                <SelectContent>
                  {backupFrequencies.map(frequency => (
                    <SelectItem key={frequency.value} value={frequency.value}>
                      {frequency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Backup na nuvem</label>
                <p className="text-xs text-gray-500">Sincronizar backup com serviços na nuvem</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={state.system.backup.cloudBackup}
                  onChange={e => handleBackupChange('cloudBackup', e.target.checked)}
                  className="peer sr-only"
                  aria-label="Ativar backup na nuvem"
                />
                <div className="peer-focus:ring-primary/20 peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo das Configurações */}
      <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Resumo das configurações do sistema
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">Idioma</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {languages.find(l => l.value === state.system.language)?.label}
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-gray-700">Tema</span>
            </div>
            <span className="text-lg font-bold text-yellow-600 capitalize">
              {state.system.theme}
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-gray-700">Notificações ativas</span>
            </div>
            <span className="text-lg font-bold text-orange-600">
              {Object.values(state.system.notifications).filter(Boolean).length}/4
            </span>
          </div>

          <div className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Cloud className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-gray-700">Backup</span>
            </div>
            <span className="text-lg font-bold text-purple-600">
              {state.system.backup.autoBackup ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Informações de Segurança */}
      <div className="rounded-lg bg-green-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-green-900">🔒 Dicas de segurança</h4>
        <ul className="space-y-1 text-sm text-green-800">
          <li>
            • <strong>Backup automático:</strong> Recomendamos ativar para proteger seus dados
          </li>
          <li>
            • <strong>Backup na nuvem:</strong> Mantenha uma cópia extra na nuvem
          </li>
          <li>
            • <strong>Notificações:</strong> Mantenha alertas ativos para monitorar a loja
          </li>
          <li>
            • <strong>Idioma:</strong> Escolha o idioma que você se sente mais confortável
          </li>
        </ul>
      </div>
    </div>
  );
}
