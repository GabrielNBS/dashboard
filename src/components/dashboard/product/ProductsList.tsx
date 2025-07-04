import Button from '@/components/ui/Button';
import { useFinalProductContext } from '@/contexts/products/useFinalProductContext';
import React from 'react';

function ProductsList() {
  const { state, dispatch } = useFinalProductContext();

  return (
    <ul className="space-y-4">
      {state.products.map(prod => {
        const total = prod.ingredients.reduce((acc, ing) => acc + ing.totalValue, 0);
        const lucro = total - total * 0.2;

        return (
          <li key={prod.uid} className="rounded border bg-white p-4 text-sm shadow-sm">
            <Button
              type="button"
              onClick={() => dispatch({ type: 'REMOVE_FINAL_PRODUCT', payload: prod.uid })}
              variant="ghost"
            >
              remover
            </Button>
            <h3 className="text-lg font-semibold">{prod.name}</h3>
            <p className="text-gray-600">Categoria: {prod.category}</p>
            <p className="text-gray-600">Receita: {prod.productionMode}</p>
            {prod.productionMode === 'lote' && (
              <p className="text-gray-600">Rendimento: {prod.yieldQuantity} unidades</p>
            )}
            <ul className="mt-2">
              {prod.ingredients.map(ingredient => (
                <li key={ingredient.id} className="flex justify-between">
                  - {ingredient.name} ({ingredient.quantity} {ingredient.unit} x R$
                  {(ingredient.buyPrice ?? 0).toFixed(2)}) = R$
                  {ingredient.totalValue.toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between font-medium">
              <span>Total: R${total.toFixed(2)}</span>
              <span>Lucro: R${lucro.toFixed(2)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ProductsList;
