import FinanceTemplate from '@/components/dashboard/finance/Finance';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold sm:text-xl">Financeiro</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Acompanhe suas vendas e métricas financeiras
        </p>
      </div>
      <FinanceTemplate />
    </div>
  );
}
