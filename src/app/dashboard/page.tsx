import BestSellingProducts from '@/components/molecules/BestSelligProducts';
import CardFinance from '@/components/molecules/CardFinance';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function DashboardPage() {
  type ChartData = {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };

  const bestSellingProducts = [
    {
      id: '1',
      name: 'Produto 1',
      quantity: 10,
      price: 100,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Produto 2',
      quantity: 10,
      price: 100,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      name: 'Produto 3',
      quantity: 10,
      price: 100,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      name: 'Produto 4',
      quantity: 10,
      price: 100,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '5',
      name: 'Produto 5',
      quantity: 10,
      price: 100,
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div>
      <div className="mt-4 grid grid-cols-[40%_60%] gap-4">
        <h1 className="text-hero font-bold">Ola, seja bem vindo!</h1>
        <div className="grid grid-cols-3 gap-4">
          <CardFinance
            title="Saídas"
            icon={<ArrowUpRight height={32} width={32} />}
            value="Descrição do cartão 1"
          />
          <CardFinance
            title="Entradas"
            icon={<ArrowDownRight height={32} width={32} />}
            value="Descrição do cartão 2"
          />
          <CardFinance
            title="Total"
            icon={<Wallet height={32} width={32} />}
            value="Descrição do cartão 3"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[70%_30%] gap-4">
        <div className="mt-4 h-[40rem] rounded-lg bg-red-100">
          <canvas id="myChart"></canvas>
        </div>
        <div className="grid grid-rows-[60%_40%] gap-2">
          <div className="p-default mt-4 grid items-center rounded-lg bg-blue-100">
            <BestSellingProducts products={bestSellingProducts} title="Produtos mais vendidos" />
          </div>
          <div className="p-default mt-4 grid items-center rounded-lg bg-blue-100"></div>
        </div>
      </div>
    </div>
  );
}
