import React from 'react';
import CardFinance from '../molecules/CardFinance';

function FinanceTemplate() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Finance</h1>
      <CardFinance />
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-2">Data</th>
            <th className="p-2">Descrição</th>
            <th className="p-2">Valor</th>
            <th className="p-2">Tipo</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr className="border-b border-gray-200">
            <td className="p-2">2021-01-01</td>
            <td className="p-2">Compra de produtos</td>
            <td className="p-2">100</td>
            <td className="p-2">Entrada</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FinanceTemplate;
