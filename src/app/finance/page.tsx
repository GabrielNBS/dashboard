import FinanceTemplate from '@/components/dashboard/finance/Finance';
import { Header } from '@/components/ui/Header';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <header className="flex flex-col gap-1">
        <Header title="Financeiro" subtitle="Acompanhe suas vendas e métricas financeiras" />
      </header>
      <main role="main" aria-label="Dados financeiros">
        <FinanceTemplate />
      </main>
    </div>
  );
}
