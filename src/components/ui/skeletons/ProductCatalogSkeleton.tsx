import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCatalogSkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-lg bg-gray-50 p-3 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-sm"
            >
              {/* Mobile Layout Skeleton */}
              <div className="flex items-center gap-3 sm:hidden">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="mb-1 h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>

              {/* Desktop Layout Skeleton */}
              <div className="hidden sm:block">
                <div className="mb-3">
                  <Skeleton className="mb-1 h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div className="mb-3 flex justify-center">
                  <Skeleton className="h-32 w-32 rounded-xl lg:h-40 lg:w-40" />
                </div>

                <div className="mb-3">
                  <Skeleton className="h-6 w-20" />
                </div>

                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
