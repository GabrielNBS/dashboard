import RegisterSaleForm from '@/components/dashboard/pdv/RegisterSaleForm';
import { Header } from '@/components/ui/Header';
import React from 'react';

function PDV() {
  return (
    <div className="min-h-dvh w-full overflow-hidden p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 sm:mb-6">
          <Header
            title="Sistema de vendas"
            subtitle="Selecione os produtos e configure o pagamento"
          />
        </div>
        <RegisterSaleForm />
      </div>
    </div>
  );
}

export default PDV;
