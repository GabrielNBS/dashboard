'use client';

import ProductForm from '@/components/dashboard/store/ProductForm';
import ProductEditModal from '@/components/dashboard/store/ProductEditModal';
import ProductTable from '@/components/dashboard/store/ProductTable';

export default function DashboardPage() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-6">
      <ProductForm />
      <ProductTable />
      <ProductEditModal />
    </div>
  );
}
