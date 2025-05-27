import Button from '@/components/atoms/Button';
import { formatCurrency } from '@/utils/icons/formatCurrency';
import { Product } from '@/types/ProductProps';

export default function ProductTable({
  products,
  onDeleteProduct,
  onEditProduct,
}: {
  products: Product[];
  onDeleteProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}) {
  const handleDelete = (product: Product) => {
    onDeleteProduct(product);
    alert('Produto deletado com sucesso');
  };

  const handleEdit = (product: Product) => {
    onEditProduct(product);
    alert('Produto editado com sucesso');
  };

  return (
    <table className="w-1/2">
      <thead className="text-left text-sm font-bold uppercase">
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="p-2 text-sm font-bold uppercase">Nome</th>
          <th className="p-2 text-sm font-bold uppercase">Quantidade</th>
          <th className="p-2 text-sm font-bold uppercase">Preço de compra</th>
          <th className="p-2 text-sm font-bold uppercase">Preço de venda</th>
          <th className="p-2 text-sm font-bold uppercase">Status</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {products.map(product => (
          <tr key={product.id}>
            <td className="p-2">{product.name}</td>
            <td className="p-2">{product.quantity}</td>
            <td className="p-2">{formatCurrency(product.buyPrice)}</td>
            <td className="p-2">{formatCurrency(product.sellPrice)}</td>
            <td className="p-2">{product.stockStatus}</td>
            <td className="p-2">
              <div className="flex gap-2">
                <Button variant="edit" onClick={() => handleEdit(product)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(product)}>
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
