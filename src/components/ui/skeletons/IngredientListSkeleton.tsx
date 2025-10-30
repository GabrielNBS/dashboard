import { Skeleton } from '@/components/ui/skeleton';

export default function IngredientListSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Mobile Layout - Hierárquico */}
      <div className="space-y-4 lg:hidden">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>

        {/* Status do estoque */}
        <div className="bg-muted rounded-lg p-3">
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-md p-3">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="bg-card rounded-md p-3">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-18 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-4 w-48" />
      </div>

      {/* Ingredient Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
