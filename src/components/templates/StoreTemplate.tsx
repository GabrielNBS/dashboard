'use client';

import { useState } from 'react';
import { Product } from '@/types/ProductProps';
import ProductTable from '../organisms/ProductTable';
import ProductForm from '../molecules/ProductForm';

export default function StoreTemplate() {
  const [products, setProducts] = useState<Product[]>([]);

  function handleAddProduct(product: Product) {
    setProducts([...products, product]);
  }

  function handleDeleteProduct(product: Product) {
    setProducts(products.filter(p => p.id !== product.id));
  }

  function handleEditProduct(product: Product) {
    setProducts(products.map(p => (p.id === product.id ? product : p)));
  }

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <ProductForm onAddProduct={handleAddProduct} />
      <ProductTable
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={handleEditProduct}
        products={products}
      />
    </main>
  );
}
