'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-foreground block text-sm font-medium">{label}</label>

      <div className="flex flex-col items-center gap-4">
        {preview ? (
          <div className="border-border relative h-32 w-32 overflow-hidden rounded-lg border-2">
            <Image src={preview} alt="Preview do produto" fill className="object-cover" />
          </div>
        ) : (
          <div className="border-border bg-muted flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed">
            <svg
              className="text-muted-foreground h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="product-image-upload"
          />

          <label
            htmlFor="product-image-upload"
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-md px-4 py-2 text-center text-sm font-medium"
          >
            {preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="bg-destructive text-primary-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium"
            >
              Remover Imagem
            </button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
      </p>
    </div>
  );
};
