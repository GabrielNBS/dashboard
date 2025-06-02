import BestSellingProducts from '@/components/molecules/BestSellingProducts';
import CardFinance from '@/components/molecules/CardFinance';

export default function DashboardTemplate() {
  const bestSellingProducts = [
    { id: '1', name: 'Produto 1', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '2', name: 'Produto 2', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '3', name: 'Produto 3', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '4', name: 'Produto 4', quantity: 10, price: 100, image: 'https://placehold.co/150' },
    { id: '5', name: 'Produto 5', quantity: 10, price: 100, image: 'https://placehold.co/150' },
  ];

  return (
    <>
      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-hero text-2xl font-bold">Olá, seja bem vindo!</h1>
        <CardFinance />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65%_auto]">
        {/* Gráfico */}
        <div className="h-[300px] rounded-lg bg-red-100 p-4 sm:h-[400px] md:h-[500px]">
          <canvas id="myChart" className="h-full w-full"></canvas>
        </div>

        {/* Card de produtos mais vendidos */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-blue-100 p-4">
            <BestSellingProducts products={bestSellingProducts} title="Top Vendas" />
          </div>

          {/* Card de produtos com estoque crítico */}
          <div className="rounded-lg bg-blue-100 p-4">
            <BestSellingProducts
              products={bestSellingProducts}
              title="Produtos com estoque crítico"
            />
          </div>
        </div>
      </div>
    </>
  );
}
