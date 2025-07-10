import FinanceTemplate from '@/components/dashboard/finance/Finance';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-hero font-bold">Bem-vindo ao Financeiro!</h1>
      <FinanceTemplate />
    </div>
  );
}
