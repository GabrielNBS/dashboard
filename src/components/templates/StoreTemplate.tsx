'use client';

import { useState } from 'react';
import { Product } from '@/types/ProductProps';
import ProductTable from '../organisms/ProductTable';
import ProductForm from '../molecules/ProductForm';
import ProductEditModal from '../organisms/ProductEditModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
export default function StoreTemplate() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  function handleAddProduct(product: Product) {
    setProducts([...products, product]);
  }

  function handleDeleteProduct(product: Product) {
    setProducts(products.filter(p => p.id !== product.id));
  }

  function handleEditProduct(product: Product) {
    setProductToEdit(product);
    setModalIsOpen(true);
  }

  function handleSaveProduct(updatedProduct: Product) {
    setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    setProductToEdit(null);
    setModalIsOpen(false);
  }

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <ProductForm onAddProduct={handleAddProduct} />
      <ProductTable
        products={products}
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={handleEditProduct}
      />
      <ProductEditModal
        isOpen={modalIsOpen}
        product={productToEdit || ({} as Product)}
        onClose={() => setModalIsOpen(false)}
        onSave={handleSaveProduct}
      />
    </main>
  );
}
