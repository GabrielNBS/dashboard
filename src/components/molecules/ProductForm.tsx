import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useState } from 'react';
import { Product } from '@/types/ProductProps';

export default function ProductForm({
  onAddProduct,
}: {
  onAddProduct: (product: Product) => void;
}) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validando os campos utilizando if statement pois eu preciso de um retorno boolean. Tem ou nao tem todos os campos preenchidos?
    if (!name || !quantity || !buyPrice || !sellPrice) {
      alert('Preencha todos os campos');
      return;
    }
    // se todos os campos estão preenchidos, adiciona o produto seguindo a tipagem do Product
    onAddProduct({
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
      stockStatus: 'Em estoque',
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
    });

    // limpando os campos após o produto ser adicionado
    setName('');
    setQuantity('');
    setBuyPrice('');
    setSellPrice('');
    alert('Produto adicionado com sucesso');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-1/2 gap-4">
      <div>
        <Input
          type="text"
          value={name}
          placeholder="Nome do produto"
          onChange={e => setName(e.target.value)}
          id="name"
        />
      </div>
      <div>
        <Input
          type="number"
          value={quantity}
          step={0.01}
          placeholder="Quantidade"
          onChange={e => setQuantity(e.target.value)}
          id="quantity"
          min={0}
        />
      </div>
      <div>
        <Input
          type="number"
          value={buyPrice}
          step={0.01}
          placeholder="Preço de compra"
          onChange={e => setBuyPrice(e.target.value)}
          id="buyPrice"
          min={0}
        />
      </div>
      <div>
        <Input
          type="number"
          value={sellPrice}
          step={0.01}
          placeholder="Preço de venda"
          onChange={e => setSellPrice(e.target.value)}
          id="sellPrice"
          min={0}
        />
      </div>
      <Button variant="accept" type="submit">
        Adicionar produto
      </Button>
    </form>
  );
}
