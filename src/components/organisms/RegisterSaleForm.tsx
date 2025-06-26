'use client';

import { useState } from 'react';
import { useFinalProductListContext } from '@/hooks/useFinalProductListContext';
import { useSalesContext } from '@/hooks/useSalesContext';
import { useIngredientContext } from '@/hooks/useIngredientContext';
import { Sale } from '@/types/sale';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterSaleForm() {
  const { state: finalProducts } = useFinalProductListContext();
  const { dispatch: salesDispatch } = useSalesContext();
  const { state: estoque, dispatch: estoqueDispatch } = useIngredientContext();

  const [selectedProductName, setSelectedProductName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = finalProducts.products.find(p => p.name === selectedProductName);

  const handleRegisterSale = () => {
    if (!selectedProduct || quantity <= 0) return;

    // Subtrair ingredientes do estoque
    selectedProduct.ingredients.forEach(ingredient => {
      const totalToRemove = ingredient.quantity * quantity;
      const estoqueItem = estoque.ingredients.find(p => p.id === ingredient.id);

      if (!estoqueItem || estoqueItem.quantity < totalToRemove) {
        alert(`Estoque insuficiente para ${ingredient.name}`);
        return;
      }

      estoqueDispatch({
        type: 'EDIT_INGREDIENT',
        payload: {
          ...estoqueItem,
          quantity: estoqueItem.quantity - totalToRemove,
        },
      });
    });

    const costPrice = selectedProduct.ingredients.reduce((acc, i) => acc + i.totalValue, 0);

    const sale: Sale = {
      id: uuidv4(),
      productName: selectedProduct.name,
      quantity,
      unitPrice: costPrice + costPrice * 0.2, // 20% lucro
      costPrice: costPrice,
      date: new Date().toISOString(),
    };

    salesDispatch({ type: 'ADD_SALE', payload: sale });

    // Resetar
    setQuantity(1);
    setSelectedProductName('');
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 shadow-md">
      <h2 className="text-lg font-bold">Registrar Venda</h2>

      <label htmlFor="product-select" className="mb-1 block font-medium">
        Produto
      </label>
      <select
        id="product-select"
        value={selectedProductName}
        onChange={e => setSelectedProductName(e.target.value)}
        className="w-full rounded border p-2"
      >
        <option value="">Selecione um produto</option>
        {finalProducts.products.map(prod => (
          <option key={prod.name} value={prod.name}>
            {prod.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        placeholder="Quantidade"
        className="w-full rounded border p-2"
      />

      <button
        onClick={handleRegisterSale}
        className="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700"
      >
        Confirmar venda
      </button>
    </div>
  );
}
