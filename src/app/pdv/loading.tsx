import { Skeleton } from '@/components/ui/skeleton';

export default function PDVLoading() {
  return (
    <div className="min-h-dvh w-full overflow-hidden p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Skeleton className="mb-2 h-6 w-48 sm:h-7 sm:w-56" />
          <Skeleton className="h-4 w-64 sm:h-5 sm:w-80" />
        </div>

        {/* PDV Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Product Selection Area - Left Side */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-white p-4 shadow-sm">
                  <Skeleton className="mb-3 h-24 w-full rounded" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-2 h-3 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Cart and Payment Area - Right Side */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            {/* Cart Header */}
            <div className="mb-4 flex items-center justify-between pb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Cart Items */}
            <div className="mb-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 pb-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mb-6 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between border-t pt-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6 space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
