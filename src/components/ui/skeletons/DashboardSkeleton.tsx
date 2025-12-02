import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <main role="main" aria-label="Dashboard content skeleton">
        <section aria-labelledby="kpi-skeleton-title" className="grid gap-6">
          <h2 id="kpi-skeleton-title" className="sr-only">
            KPIs Skeleton
          </h2>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>

          {/* Chart and Top Items Skeleton */}
          <section className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-3/4">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="w-full lg:w-1/4">
              <Skeleton className="h-96 w-full" />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
