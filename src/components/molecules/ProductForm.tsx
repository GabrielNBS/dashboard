import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useState } from 'react';
import { Ingredient } from '@/types/ingredients';
import { useIngredientContext } from '@/hooks/useIngredientContext';

export default function IngredientForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const { dispatch } = useIngredientContext();

  function handleAddIngredient(ingredient: Ingredient) {
    dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validando os campos utilizando if statement pois eu preciso de um retorno boolean. Tem ou nao tem todos os campos preenchidos?
    if (!name || !quantity || !buyPrice || !sellPrice) {
      alert('Preencha todos os campos');
      return;
    }
    // se todos os campos estão preenchidos, adiciona o ingrediente seguindo a tipagem do Product
    handleAddIngredient({
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
      stockStatus: 'Em estoque',
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
      totalValue: parseInt(quantity) * parseFloat(buyPrice),
    });

    // limpando os campos após o ingrediente ser adicionado
    setName('');
    setQuantity('');
    setBuyPrice('');
    setSellPrice('');
    alert('Ingrediente adicionado com sucesso');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-1/2 gap-4">
      <div>
        <Input
          type="text-hero"
          value={name}
          placeholder="Nome do ingrediente"
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
        Adicionar
      </Button>
    </form>
  );
}
