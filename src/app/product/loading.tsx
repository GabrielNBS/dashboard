import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="w-full rounded-lg p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
            {/* Product Image */}
            <Skeleton className="mb-4 h-32 w-full rounded" />

            {/* Product Info */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Price and Stock */}
            <div className="mt-3 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Alternative (for when no products) */}
      <div className="hidden">
        <div className="bg-muted rounded-lg py-12 text-center">
          <div className="mb-4 flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-16 w-16 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="mx-auto h-10 w-40" />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Floating Action Button */}
      <Skeleton className="fixed right-15 bottom-4 z-10 h-12 w-32 rounded-full" />
    </div>
  );
}
