import RegisterSaleForm from '@/components/dashboard/pdv/RegisterSaleForm';
import React from 'react';

function PDV() {
  return (
    <div className="min-h-dvh w-full overflow-hidden p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-primary text-lg font-bold sm:text-xl">Sistema de Vendas</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Selecione os produtos e configure o pagamento
          </p>
        </div>
        <RegisterSaleForm />
      </div>
    </div>
  );
}

export default PDV;
