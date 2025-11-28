'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings/SettingsContext';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { Store, Upload, MapPin, Phone, Building2, Camera, ImageIcon, Edit } from 'lucide-react';
import { PhoneInput, EmailInput } from '@/components/ui/forms';
import { cnpjMask } from '@/utils/masks';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/feedback';

export default function StoreSettingsSection() {
  const { state, dispatch } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState(state.store);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
    setFormData(state.store);
  }, [state.store]);

  const handleInputChange = (field: keyof typeof state.store, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Object.entries(formData).forEach(([key, value]) => {
      dispatch({
        type: 'UPDATE_STORE',
        payload: { [key]: value },
      });
    });
    setIsSheetOpen(false);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOpenSheet = () => {
    setFormData(state.store);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-10 flex items-center justify-center gap-3">
        <Store className="text-primary h-6 w-6" />
        <h2 className="text-lg font-bold lg:text-xl">Dados da Loja</h2>
      </div>

      {!state.store.storeName ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Store className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Sua loja ainda não está configurada
          </h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            Adicione as informações da sua loja, como nome, logo e contato para personalizar sua
            experiência.
          </p>
          <Button onClick={handleOpenSheet} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Configurar Agora
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <Button onClick={handleOpenSheet} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar Informações
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Identidade Visual - Read Only */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-primary h-5 w-5" />
                <h3 className="text-lg font-medium text-gray-900">Identidade Visual</h3>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="border-muted bg-muted/50 relative h-32 w-32 overflow-hidden rounded-full border-4">
                    {mounted && state.store.logo ? (
                      <Image
                        src={state.store.logo}
                        alt="Logo preview"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <Store className="h-12 w-12 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-foreground text-sm font-medium">Logo da Loja</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Básicas - Read Only */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="text-primary h-5 w-5" />
                <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="mb-1 block text-sm font-medium text-gray-700">Nome da Loja</p>
                  <p className="text-foreground text-sm">{state.store.storeName || '-'}</p>
                </div>

                <div>
                  <p className="mb-1 block text-sm font-medium text-gray-700">Segmento</p>
                  <p className="text-foreground text-sm">{state.store.segment || '-'}</p>
                </div>

                <div>
                  <p className="mb-1 block text-sm font-medium text-gray-700">CNPJ</p>
                  <p className="text-foreground text-sm">{state.store.cnpj || '-'}</p>
                </div>
              </div>
            </div>

            {/* Contato - Read Only */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="text-primary h-5 w-5" />
                <h3 className="text-lg font-medium text-gray-900">Contato</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="mb-1 block text-sm font-medium text-gray-700">Email</p>
                  <p className="text-foreground text-sm">{state.store.email || '-'}</p>
                </div>

                <div>
                  <p className="mb-1 block text-sm font-medium text-gray-700">Telefone</p>
                  <p className="text-foreground text-sm">{state.store.phone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Endereço - Read Only */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary h-5 w-5" />
                <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="mb-1 block text-sm font-medium text-gray-700">Endereço Completo</p>
                  <p className="text-foreground text-sm">{state.store.address || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Resumo */}
      <div className="hidden rounded-lg bg-blue-50 p-4 lg:flex">
        <h4 className="mb-2 text-sm font-medium text-blue-900">💡 Dica</h4>
        <p className="text-sm text-blue-800">
          Mantenha os dados da sua loja sempre atualizados para garantir que seus clientes consigam
          entrar em contato facilmente.
        </p>
      </div>

      {/* Sheet de Configuração */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configurar Loja</SheetTitle>
            <SheetDescription>Atualize as informações da sua loja abaixo.</SheetDescription>
          </SheetHeader>

          <div className="max-h-[80vh] space-y-6 overflow-y-auto p-4">
            {/* Logo Upload */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="group relative cursor-pointer" onClick={triggerFileInput}>
                <div className="border-muted bg-muted/50 relative h-24 w-24 overflow-hidden rounded-full border-4">
                  {mounted && formData.logo ? (
                    <Image
                      src={formData.logo}
                      alt="Logo preview"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                      <Store className="h-10 w-10 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="bg-primary text-primary-foreground border-card absolute right-0 bottom-0 rounded-full border-2 p-1.5 shadow-lg">
                  <Upload className="h-3.5 w-3.5" />
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

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-gray-900">
                <Building2 className="h-4 w-4" /> Informações Básicas
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome da Loja
                  </label>
                  <Input
                    value={formData.storeName || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('storeName', e.target.value)
                    }
                    placeholder="Ex: Minha Loja Incrível"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Segmento</label>
                  <Input
                    value={formData.segment || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('segment', e.target.value)
                    }
                    placeholder="Ex: Varejo, Alimentação..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">CNPJ</label>
                  <Input
                    value={formData.cnpj || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('cnpj', cnpjMask(e.target.value))
                    }
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-gray-900">
                <Phone className="h-4 w-4" /> Contato
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <EmailInput
                    value={formData.email || ''}
                    onChange={(value: string) => handleInputChange('email', value)}
                    placeholder="contato@loja.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
                  <PhoneInput
                    value={formData.phone || ''}
                    onChange={(value: string) => handleInputChange('phone', value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-gray-900">
                <MapPin className="h-4 w-4" /> Endereço
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Endereço Completo
                  </label>
                  <Input
                    value={formData.address || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder="Rua, Número, Bairro..."
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Alterações</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
