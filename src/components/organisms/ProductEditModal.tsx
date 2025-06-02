import Button from '@/components/atoms/Button';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { Product, ProductEditModalProps } from '@/types/ProductProps';

export default function ProductEditModal({
  isOpen,
  product,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  // Atualiza o state local quando o produto muda
  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  // Atualiza o state local quando o input muda
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]:
        name === 'quantity' || name === 'buyPrice' || name === 'sellPrice' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProduct);
  };

  const inputStyle = 'rounded-md border border-gray-300 p-2 w-full h-full';

  return (
    <div
      className={clsx('fixed inset-0 flex items-center justify-center bg-black opacity-80', {
        hidden: !isOpen,
      })}
    >
      <div className="flex flex-col gap-2 rounded-md bg-white p-4 shadow-md">
        <h2 className="text-hero-lg font-bold">Editar produto</h2>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            className={inputStyle}
            type="text-hero"
            name="name"
            value={editedProduct.name}
            onChange={handleChange}
            placeholder="Nome do produto"
          />
          <input
            className={inputStyle}
            type="number"
            name="quantity"
            value={editedProduct.quantity}
            onChange={handleChange}
            placeholder="Quantidade"
          />
          <input
            className={inputStyle}
            type="number"
            name="buyPrice"
            value={editedProduct.buyPrice}
            onChange={handleChange}
            placeholder="Preço de compra"
          />
          <input
            className={inputStyle}
            type="number"
            name="sellPrice"
            value={editedProduct.sellPrice}
            onChange={handleChange}
            placeholder="Preço de venda"
          />
          <div className="flex gap-2">
            <Button variant="accept" type="submit">
              Salvar
            </Button>
            <Button variant="destructive" type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
