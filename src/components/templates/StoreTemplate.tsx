'use client';

import ProductTable from '../organisms/ProductTable';
import ProductForm from '../molecules/ProductForm';
import ProductEditModal from '../organisms/ProductEditModal';

export default function StoreTemplate() {
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <ProductForm />
      <ProductTable />
      <ProductEditModal />
    </main>
  );
}
