import Button from '@/components/atoms/Button';
import { formatCurrency } from '@/utils/icons/formatCurrency';
import { useProductContext } from '@/hooks/useProductContext';
import { Product } from '@/types/ProductProps';
import { useHydrated } from '@/hooks/useHydrated';

export default function ProductTable() {
  const { state, dispatch } = useProductContext();
  const { products } = state;

  function handleDeleteProduct(productId: number) {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  }

  function handleEditProduct(product: Product) {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: product });
  }

  const hydrated = useHydrated();

  if (!hydrated) {
    return <div>Loading...</div>;
  }

  return (
    <table className="w-1/2">
      <thead className="text-hero-left text-hero-sm font-bold uppercase">
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="p-2">Nome</th>
          <th className="p-2">Quantidade</th>
          <th className="p-2">Preço de compra</th>
          <th className="p-2">Preço de venda</th>
          <th className="p-2">Status</th>
          <th className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody className="text-hero-sm">
        {products.map(product => (
          <tr key={product.id}>
            <td className="p-2">{product.name}</td>
            <td className="p-2">{product.quantity}</td>
            <td className="p-2">{formatCurrency(product.buyPrice)}</td>
            <td className="p-2">{formatCurrency(product.sellPrice)}</td>
            <td className="p-2">{product.stockStatus}</td>
            <td className="p-2">
              <div className="flex gap-2">
                <Button variant="edit" onClick={() => handleEditProduct(product)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                  Deletar
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
