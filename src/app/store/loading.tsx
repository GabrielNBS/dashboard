import { Skeleton } from '@/components/ui/skeleton';

export default function StoreLoading() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Header Section Skeleton */}
      <div className="flex w-full flex-col items-start justify-start">
        <Skeleton className="h-6 w-48 sm:h-7 sm:w-56" />
        <Skeleton className="mt-2 h-4 w-64 sm:h-5 sm:w-80" />
      </div>

      {/* Product Form Skeleton */}
      <div className="bg-card w-full space-y-4 rounded-lg p-4 shadow-sm sm:p-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Product Table Skeleton */}
      <div className="w-full space-y-4">
        {/* Table Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-card rounded-md shadow-sm">
          {/* Table Header */}
          <div className="bg-muted grid grid-cols-4 gap-4 p-4 sm:grid-cols-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="hidden h-4 w-16 sm:block" />
            <Skeleton className="hidden h-4 w-12 sm:block" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 sm:grid-cols-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="hidden h-4 w-full sm:block" />
              <div className="hidden sm:flex sm:gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
