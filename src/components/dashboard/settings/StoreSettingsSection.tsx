// src/components/dashboard/settings/StoreSettingsSection.tsx
// Seção de configurações dos dados da loja

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings/SettingsContext';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { Store, Upload, Edit3, Save, X, MapPin, Phone, Mail, Building2, Tag } from 'lucide-react';

export default function StoreSettingsSection() {
  const { state, dispatch } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    storeName: state.store.storeName || '',
    segment: state.store.segment || '',
    cnpj: state.store.cnpj || '',
    address: state.store.address || '',
    phone: state.store.phone || '',
    email: state.store.email || '',
    logo: state.store.logo || '',
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Verifica se é a primeira configuração (dados básicos não preenchidos)
  const isFirstSetup = !state.store.storeName || !state.store.segment;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSave = () => {
    // Salva todos os dados de uma vez
    Object.entries(formData).forEach(([key, value]) => {
      dispatch({
        type: 'UPDATE_STORE',
        payload: { [key]: value },
      });
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    // Carrega os dados atuais no formulário
    setFormData({
      storeName: state.store.storeName || '',
      segment: state.store.segment || '',
      cnpj: state.store.cnpj || '',
      address: state.store.address || '',
      phone: state.store.phone || '',
      email: state.store.email || '',
      logo: state.store.logo || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaura os dados originais
    setFormData({
      storeName: state.store.storeName || '',
      segment: state.store.segment || '',
      cnpj: state.store.cnpj || '',
      address: state.store.address || '',
      phone: state.store.phone || '',
      email: state.store.email || '',
      logo: state.store.logo || '',
    });
  };

  const removeLogo = () => {
    handleInputChange('logo', '');
  };

  // Se é primeira configuração ou está editando, mostra o formulário
  if (isFirstSetup || isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="text-primary h-6 w-6" />
            <h2 className="text-xl font-semibold">
              {isFirstSetup ? 'Configure sua loja' : 'Editar dados da loja'}
            </h2>
          </div>
          {!isFirstSetup && (
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>

        {isFirstSetup && (
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-900">👋 Bem-vindo!</h3>
            <p className="text-sm text-blue-800">
              Vamos começar configurando os dados básicos da sua loja. Essas informações serão
              usadas em relatórios e na identificação do seu negócio.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
              <Building2 className="h-5 w-5 text-blue-600" />
              Informações básicas
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nome da loja *
                </label>
                <Input
                  value={formData.storeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('storeName', e.target.value)
                  }
                  placeholder="Digite o nome da sua loja"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Segmento *</label>
                <Input
                  value={formData.segment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('segment', e.target.value)
                  }
                  placeholder="Ex: Alimentação, Moda, Tecnologia"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">CNPJ</label>
                <Input
                  value={formData.cnpj}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('cnpj', e.target.value)
                  }
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
              <Phone className="h-5 w-5 text-green-600" />
              Informações de contato
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Endereço</label>
                <Input
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('address', e.target.value)
                  }
                  placeholder="Endereço completo da loja"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
                <Input
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('phone', e.target.value)
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('email', e.target.value)
                  }
                  placeholder="contato@sualoja.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo da Loja */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <Upload className="h-5 w-5 text-purple-600" />
            Logo da loja
          </h3>

          <div className="flex items-center gap-4">
            {mounted && formData.logo ? (
              <div className="relative">
                <Image
                  src={formData.logo}
                  alt="Logo da loja"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white transition-colors hover:bg-red-600"
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
              <label className="mb-2 block text-sm font-medium text-gray-700">Upload do logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="file:bg-primary hover:file:bg-primary/90 block w-full text-sm text-gray-500 transition-colors file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                aria-label="Selecionar arquivo de logo"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={!formData.storeName || !formData.segment}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isFirstSetup ? 'Salvar configurações' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    );
  }

  // Modo de visualização - mostra resumo com botão de editar
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="text-primary h-6 w-6" />
          <h2 className="text-xl font-semibold">Dados da loja</h2>
        </div>
        <Button onClick={handleEdit} className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Logo Centralizada */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {mounted && state.store.logo ? (
            <div className="group relative">
              <Image
                src={state.store.logo}
                alt="Logo da loja"
                width={128}
                height={128}
                className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-lg"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <Store className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Informações da Loja */}
      <div className="mb-8 text-center">
        <h3 className="mb-2 text-3xl font-bold text-gray-900">{state.store.storeName}</h3>
        <div className="mb-6 flex items-center justify-center gap-2">
          <Tag className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-medium text-blue-700">{state.store.segment}</span>
        </div>
      </div>

      {/* Cards de Informações */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {state.store.cnpj && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CNPJ</p>
                <p className="font-semibold text-gray-900">{state.store.cnpj}</p>
              </div>
            </div>
          </div>
        )}

        {state.store.phone && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-semibold text-gray-900">{state.store.phone}</p>
              </div>
            </div>
          </div>
        )}

        {state.store.email && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{state.store.email}</p>
              </div>
            </div>
          </div>
        )}

        {state.store.address && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p className="font-semibold text-gray-900">{state.store.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status da Configuração */}
      <div className="rounded-lg bg-green-50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-green-800">Loja configurada com sucesso</span>
        </div>
        <p className="mt-1 text-sm text-green-700">
          Todas as informações básicas estão preenchidas. Você pode editar os dados a qualquer
          momento clicando no botão &quot;Editar&quot;.
        </p>
      </div>
    </div>
  );
}
