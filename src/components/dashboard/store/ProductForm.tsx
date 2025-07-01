import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { Ingredient, UnitType } from '@/types/ingredients';
import { useIngredientContext } from '@/hooks/useIngredientContext';

export default function IngredientForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [unit, setUnit] = useState<'kg' | 'g' | 'l' | 'ml' | 'unidade'>('kg'); // Default unit
  const { dispatch } = useIngredientContext();

  function handleAddIngredient(ingredient: Ingredient) {
    dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validando os campos utilizando if statement pois eu preciso de um retorno boolean. Tem ou nao tem todos os campos preenchidos?
    if (!name || !quantity || !buyPrice || !unit) {
      alert('Preencha todos os campos');
      return;
    }
    // se todos os campos estão preenchidos, adiciona o ingrediente seguindo a tipagem do Product
    handleAddIngredient({
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
      unit,
      stockStatus:
        parseInt(quantity) === 0
          ? 'Sem estoque'
          : parseInt(quantity) < 3
            ? 'Estoque baixo'
            : 'Em estoque',
      buyPrice: parseFloat(buyPrice),
      totalValue: parseInt(quantity) * parseFloat(buyPrice),
    });

    // limpando os campos após o ingrediente ser adicionado
    setName('');
    setUnit('kg');
    setQuantity('');
    setBuyPrice('');
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
        <select
          title="Campo de escolha de medida do produto"
          value={unit}
          onChange={e => setUnit(e.target.value as UnitType)}
        >
          <option value="g">Grama (g)</option>
          <option value="kg">Quilo (kg)</option>
          <option value="ml">Mililitro (ml)</option>
          <option value="l">Litro (l)</option>
          <option value="unidade">Unidade</option>
        </select>
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

      <Button variant="accept" type="submit">
        Adicionar
      </Button>
    </form>
  );
}
