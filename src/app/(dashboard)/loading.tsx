export default function DashboardLoading() {
  return (
    <main className="bg-surface flex min-h-screen flex-col gap-6 p-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <section className="grid gap-6 lresg:grid-cols-4">
        <div className="lg:col-span-3">
          {/* Cards Skeleton */}
          <div className="hidden grid-cols-4 gap-6 lg:grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="mt-6 h-96 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Sidebar Skeleton */}
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      </section>
    </main>
  );
}
