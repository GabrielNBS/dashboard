import Button from '@/components/atoms/Button';
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
        <label htmlFor="name">Nome do produto</label>
        <input
          type="text"
          value={name}
          placeholder="Nome do produto"
          onChange={e => setName(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
          id="name"
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantidade</label>
        <input
          type="number"
          value={quantity}
          step={0.01}
          placeholder="Quantidade"
          onChange={e => setQuantity(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
          id="quantity"
          min={0}
        />
      </div>
      <div>
        <label htmlFor="buyPrice">Preço de compra</label>
        <input
          type="number"
          value={buyPrice}
          step={0.01}
          placeholder="Preço de compra"
          onChange={e => setBuyPrice(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
          id="buyPrice"
          min={0}
        />
      </div>
      <div>
        <label htmlFor="sellPrice">Preço de venda</label>
        <input
          type="number"
          value={sellPrice}
          step={0.01}
          placeholder="Preço de venda"
          onChange={e => setSellPrice(e.target.value)}
          className="rounded-md border border-gray-300 p-2"
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
