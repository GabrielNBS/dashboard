import FinanceTemplate from '@/components/dashboard/finance/Finance';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-xl font-bold">Bem-vindo ao Financeiro!</h2>
      <FinanceTemplate />
    </div>
  );
}
