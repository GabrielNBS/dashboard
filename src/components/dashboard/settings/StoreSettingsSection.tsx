'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings/SettingsContext';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import {
  Store,
  Upload,
  Edit3,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Building2,
  Tag,
  Camera,
  ChevronRight,
} from 'lucide-react';
import { PhoneInput, EmailInput } from '@/components/ui/forms';
import { cnpjMask } from '@/utils/masks';
import { motion } from 'framer-motion';

export default function StoreSettingsSection() {
  const { state, dispatch } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Verifica se é a primeira configuração
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
    Object.entries(formData).forEach(([key, value]) => {
      dispatch({
        type: 'UPDATE_STORE',
        payload: { [key]: value },
      });
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isFirstSetup || isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-border overflow-hidden rounded-xl border shadow-sm"
      >
        <div className="border-border bg-muted/30 flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 hidden rounded-lg p-2 sm:block">
              <Store className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-semibold">
                {isFirstSetup ? 'Configuração Inicial' : 'Editar Dados da Loja'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isFirstSetup
                  ? 'Preencha os dados essenciais'
                  : 'Atualize as informações do negócio'}
              </p>
            </div>
          </div>
          {!isFirstSetup && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground self-start sm:self-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>

        <div className="space-y-8 p-4 sm:p-6">
          {/* Logo Upload Section */}
          <div className="flex flex-col items-center justify-center gap-4 py-2">
            <div className="group relative cursor-pointer" onClick={triggerFileInput}>
              <div className="border-muted bg-muted/50 relative h-24 w-24 overflow-hidden rounded-full border-4 sm:h-32 sm:w-32">
                {mounted && formData.logo ? (
                  <Image
                    src={formData.logo}
                    alt="Logo preview"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                    <Store className="h-10 w-10 opacity-50 sm:h-12 sm:w-12" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                </div>
              </div>
              <div className="bg-primary text-primary-foreground border-card absolute right-0 bottom-0 rounded-full border-2 p-1.5 shadow-lg sm:p-2">
                <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-foreground text-sm font-medium">Logo da Loja</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Building2 className="h-3.5 w-3.5" />
                Informações Básicas
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Nome da Loja
                  </label>
                  <Input
                    value={formData.storeName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('storeName', e.target.value)
                    }
                    placeholder="Ex: Minha Loja Incrível"
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Segmento
                  </label>
                  <Input
                    value={formData.segment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('segment', e.target.value)
                    }
                    placeholder="Ex: Varejo, Alimentação..."
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">CNPJ</label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('cnpj', cnpjMask(e.target.value))
                    }
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Phone className="h-3.5 w-3.5" />
                Contato
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">Email</label>
                  <EmailInput
                    value={formData.email}
                    onChange={(value: string) => handleInputChange('email', value)}
                    placeholder="contato@loja.com"
                  />
                </div>

                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Telefone
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value: string) => handleInputChange('phone', value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Endereço
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder="Rua, Número, Bairro..."
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border bg-muted/30 flex flex-col-reverse justify-end gap-3 border-t p-4 sm:flex-row sm:p-6">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.storeName || !formData.segment}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Card - Optimized for Mobile */}
      <div className="from-primary/90 to-primary text-primary-foreground relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg">
        {/* Background Effects - Reduced on mobile */}
        <div className="absolute top-0 right-0 hidden translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 p-32 blur-3xl sm:block"></div>
        <div className="absolute bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 p-24 blur-2xl sm:block"></div>

        <div className="relative flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8">
          <div className="relative shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 shadow-xl backdrop-blur-sm sm:h-32 sm:w-32">
              {mounted && state.store.logo ? (
                <Image
                  src={state.store.logo}
                  alt={state.store.storeName}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Store className="h-10 w-10 text-white/80 sm:h-12 sm:w-12" />
                </div>
              )}
            </div>
            <div
              className="border-primary absolute right-1 bottom-1 h-5 w-5 rounded-full border-4 bg-green-500 shadow-sm sm:h-6 sm:w-6"
              title="Loja Ativa"
            ></div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:space-y-3 sm:text-left">
            <div>
              <h2 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                {state.store.storeName}
              </h2>
              <p className="text-primary-foreground/80 mt-1 text-sm sm:text-base">
                Gerencie as informações principais do seu estabelecimento
              </p>
            </div>

            <div className="text-primary-foreground/90 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md sm:text-sm">
                <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {state.store.segment}
              </span>
              {state.store.cnpj && (
                <span className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1 text-xs opacity-90 sm:text-sm">
                  <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {state.store.cnpj}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={handleEdit}
            className="text-primary mt-2 w-full shrink-0 border-0 bg-white shadow-lg hover:bg-white/90 sm:mt-0 sm:w-auto"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Details Section - Grouped for better hierarchy */}
      <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border bg-muted/30 border-b p-4">
          <h3 className="text-foreground flex items-center gap-2 font-semibold">
            <Phone className="text-primary h-4 w-4" />
            Informações de Contato
          </h3>
        </div>

        <div className="divide-border divide-y">
          <div className="hover:bg-muted/5 flex items-center gap-4 p-4 transition-colors">
            <div className="shrink-0 rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground mb-0.5 text-sm font-medium">Email</p>
              <p className="text-foreground truncate font-medium">
                {state.store.email || (
                  <span className="text-muted-foreground text-sm italic">Não informado</span>
                )}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground/50 h-4 w-4" />
          </div>

          <div className="hover:bg-muted/5 flex items-center gap-4 p-4 transition-colors">
            <div className="shrink-0 rounded-lg bg-green-500/10 p-2 text-green-600">
              <Phone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground mb-0.5 text-sm font-medium">Telefone</p>
              <p className="text-foreground truncate font-medium">
                {state.store.phone || (
                  <span className="text-muted-foreground text-sm italic">Não informado</span>
                )}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground/50 h-4 w-4" />
          </div>

          <div className="hover:bg-muted/5 flex items-center gap-4 p-4 transition-colors">
            <div className="shrink-0 rounded-lg bg-orange-500/10 p-2 text-orange-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground mb-0.5 text-sm font-medium">Endereço</p>
              <p className="text-foreground truncate font-medium">
                {state.store.address || (
                  <span className="text-muted-foreground text-sm italic">Não informado</span>
                )}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground/50 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
