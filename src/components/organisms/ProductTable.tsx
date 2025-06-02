import Button from '@/components/atoms/Button';
import { formatCurrency } from '@/utils/icons/formatCurrency';
import { Product, ProductTableProps } from '@/types/ProductProps';

export default function ProductTable({
  products,
  onDeleteProduct,
  onEditProduct,
}: ProductTableProps) {
  const handleDelete = (product: Product) => {
    onDeleteProduct(product);
    alert('Produto deletado com sucesso');
  };

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
                <Button variant="edit" onClick={() => onEditProduct(product)}>
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
