import RegisterSaleForm from '@/components/dashboard/pdv/RegisterSaleForm';
import { Header } from '@/components/ui/Header';
import React from 'react';

function PDV() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <Header title="PDV Unificado" subtitle="Vendas individuais e em lote com desconto dinâmico" />
      <main role="main" aria-label="Formulário de registro de vendas">
        <RegisterSaleForm />
      </main>
    </div>
  );
}

export default PDV;
