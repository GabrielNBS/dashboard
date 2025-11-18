import RegisterSaleForm from '@/components/dashboard/pdv/RegisterSaleForm';
import { Header } from '@/components/ui/Header';
import React from 'react';

function PDV() {
  return (
    <div className="min-h-dvh w-full overflow-hidden p-2 sm:p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-3 sm:mb-4 md:mb-6">
          <Header
            title="PDV Unificado"
            subtitle="Vendas individuais e em lote com desconto dinâmico"
          />
        </header>
        <main role="main" aria-label="Formulário de registro de vendas">
          <RegisterSaleForm />
        </main>
      </div>
    </div>
  );
}

export default PDV;
