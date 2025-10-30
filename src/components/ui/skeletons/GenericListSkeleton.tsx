import { Skeleton } from '@/components/ui/skeleton';

interface GenericListSkeletonProps {
  gridCols?: string;
  itemCount?: number;
}

export default function GenericListSkeleton({
  gridCols = 'grid-cols-1 sm:grid-cols-2',
  itemCount = 6,
}: GenericListSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-18 rounded-md" />
        </div>
      </div>

      <Skeleton className="h-4 w-48" />

      {/* Items Grid */}
      <div className={`grid gap-4 ${gridCols}`}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
