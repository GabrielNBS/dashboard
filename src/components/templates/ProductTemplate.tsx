import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { PlusIcon } from 'lucide-react';

export default function ProductTemplate() {
  const spanStyle = 'bg-primary cursor-pointer rounded-lg p-2';

  return (
    <div className="p-default flex h-full min-h-screen flex-col items-center justify-center gap-24">
      <h1 className="self-start text-4xl font-bold">Cadastro de produto</h1>
      <div className="aspect-square w-full max-w-[256px] rounded-lg shadow-md">
        <img
          src="https://placehold.co/600x600"
          alt="Product"
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
      <div className="w-full max-w-7xl rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
          <div className="p-default relative max-h-[512px] min-h-[400px] w-full rounded-lg shadow-md">
            <form className="flex flex-wrap gap-4">
              <Input type="text" placeholder="Ingrediente" />
              <Input type="number" placeholder="Quantidade" />
              <Input type="number" placeholder="Preço" />
              <Input type="number" placeholder="Preço sugerido" />
              <Input type="number" placeholder="Margem de lucro" />
              <Button type="submit" className="absolute right-6 bottom-10 h-16 w-16 rounded-full">
                <PlusIcon className="h-10 w-10" strokeWidth={2} />
              </Button>
            </form>
          </div>
          <div className="inline-flex max-h-[512px] min-h-[400px] w-full flex-col items-center gap-4 rounded-lg shadow-md">
            <div className="p-default flex gap-4 text-white">
              <span className={spanStyle}>Tradicionais</span>
              <span className={spanStyle}>Especiais</span>
              <span className={spanStyle}>Gourmet</span>
              <span className={spanStyle}>Bebidas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
