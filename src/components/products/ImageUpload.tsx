'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Imagem do Produto',
}) => {
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-200">
            <Image src={preview} alt="Preview do produto" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <svg
              className="h-12 w-12 text-gray-400"
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
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            {preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Remover Imagem
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB</p>
    </div>
  );
};
