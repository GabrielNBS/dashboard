import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { CheckIcon } from 'lucide-react';

export default function ProductForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <>
      <h2 className="p-default text-hero-2xl font-bold">Adicionar produto</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <Input type="text-hero" placeholder="Nome do ingrediente" />
        <Input type="number" placeholder="Quantidade" />
        <Input type="number" placeholder="Valor do ingrediente" />
        <div className="absolute right-32 bottom-10 flex items-center gap-8">
          <div className="flex flex-col">
            <span>Valor Total</span>
            <span>R$ 0,00</span>
          </div>
          <div className="flex flex-col">
            <span>Margem de lucro</span>
            <span>R$ 0,00</span>
          </div>
        </div>
        <Button type="submit" className="absolute right-6 bottom-10 h-16 w-16 rounded-full">
          <CheckIcon className="h-10 w-10" strokeWidth={2} />
        </Button>
      </form>
    </>
  );
}
