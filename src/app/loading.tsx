import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen flex-col gap-6 bg-gray-50 p-6">
      {/* Header Skeleton */}
      <header className="space-y-2">
        <Skeleton className="h-7 w-64 sm:h-8 sm:w-80" />
        <Skeleton className="h-5 w-48 sm:h-6 sm:w-64" />
      </header>

      <section className="grid gap-6 lg:grid-cols-4">
        {/* Main Content Area - 3 columns */}
        <div className="lg:col-span-3">
          {/* Mobile Layout Skeleton */}
          <div className="space-y-4 lg:hidden">
            {/* Main KPIs */}
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </div>
            </div>

            {/* Secondary KPIs */}
            <div className="rounded-lg bg-gray-100 p-3">
              <Skeleton className="mb-3 h-4 w-24" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-white p-3">
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="rounded-md bg-white p-3">
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout Skeleton */}
          <div className="hidden grid-cols-1 gap-6 md:grid-cols-2 lg:grid lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section Skeleton */}
          <section className="mt-6 flex flex-col gap-6">
            {/* Main Chart */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-64 w-full" />
            </div>

            {/* Metrics Integration */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Skeleton className="mb-4 h-6 w-48" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Top Selling Items */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
