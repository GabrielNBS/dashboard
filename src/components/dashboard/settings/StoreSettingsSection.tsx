// src/components/dashboard/settings/StoreSettingsSection.tsx
// Seção de configurações dos dados da loja

'use client';

import React from 'react';
import { useSettings } from '@/contexts/settings/SettingsContext';
import Input from '@/components/ui/Input';
import { Store, Upload } from 'lucide-react';

export default function StoreSettingsSection() {
  const { state, dispatch } = useSettings();

  const handleInputChange = (field: keyof typeof state.store, value: string) => {
    dispatch({
      type: 'UPDATE_STORE',
      payload: { [field]: value },
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        handleInputChange('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Store className="text-primary h-6 w-6" />
        <h2 className="text-xl font-semibold">Dados da Loja</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nome da Loja *</label>
              <Input
                value={state.store.storeName}
                onChange={e => handleInputChange('storeName', e.target.value)}
                placeholder="Digite o nome da sua loja"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Segmento *</label>
              <Input
                value={state.store.segment}
                onChange={e => handleInputChange('segment', e.target.value)}
                placeholder="Ex: Alimentação, Moda, Tecnologia"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">CNPJ</label>
              <Input
                value={state.store.cnpj}
                onChange={e => handleInputChange('cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informações de Contato</h3>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Endereço</label>
              <Input
                value={state.store.address}
                onChange={e => handleInputChange('address', e.target.value)}
                placeholder="Endereço completo da loja"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
              <Input
                value={state.store.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={state.store.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="contato@sualoja.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo da Loja */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Logo da Loja</h3>

        <div className="flex items-center gap-4">
          {state.store.logo ? (
            <div className="relative">
              <img
                src={state.store.logo}
                alt="Logo da loja"
                className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
              />
              <button
                onClick={() => handleInputChange('logo', '')}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">Upload do Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="file:bg-primary hover:file:bg-primary/90 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              aria-label="Selecionar arquivo de logo"
            />
            <p className="mt-1 text-xs text-gray-500">
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Resumo das Configurações */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-900">Resumo das Configurações</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nome:</span>
            <span className="ml-2 font-medium">{state.store.storeName}</span>
          </div>
          <div>
            <span className="text-gray-500">Segmento:</span>
            <span className="ml-2 font-medium">{state.store.segment}</span>
          </div>
          {state.store.cnpj && (
            <div>
              <span className="text-gray-500">CNPJ:</span>
              <span className="ml-2 font-medium">{state.store.cnpj}</span>
            </div>
          )}
          {state.store.phone && (
            <div>
              <span className="text-gray-500">Telefone:</span>
              <span className="ml-2 font-medium">{state.store.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
