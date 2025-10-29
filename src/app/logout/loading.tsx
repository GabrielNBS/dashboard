import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-100 p-8 shadow-xl">
        {/* Tab Navigation */}
        <div className="mb-8 flex border-b border-gray-300">
          <div className="flex-1 py-3 text-center">
            <Skeleton className="mx-auto h-5 w-16" />
          </div>
          <div className="flex-1 py-3 text-center">
            <Skeleton className="mx-auto h-5 w-20" />
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <Skeleton className="absolute top-3 left-3 h-5 w-5" />
            <Skeleton className="h-10 w-full rounded" />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Skeleton className="absolute top-3 left-3 h-5 w-5" />
            <Skeleton className="h-10 w-full rounded" />
          </div>

          {/* Checkbox */}
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-full rounded" />

          {/* Footer Text */}
          <div className="text-center">
            <Skeleton className="mx-auto h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
