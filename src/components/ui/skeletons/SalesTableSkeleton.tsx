import { Skeleton } from '@/components/ui/skeleton';

export default function SalesTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">
              <Skeleton className="h-4 w-12" />
            </th>
            <th className="p-3">
              <Skeleton className="h-4 w-24" />
            </th>
            <th className="p-3 text-center">
              <Skeleton className="h-4 w-8" />
            </th>
            <th className="p-3">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="p-3">
              <Skeleton className="h-4 w-12" />
            </th>
            <th className="p-3">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="p-3">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="p-3 text-center">
              <Skeleton className="h-4 w-12" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="p-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="p-3">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="p-3 text-center">
                <Skeleton className="h-4 w-8" />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </td>
              <td className="p-3">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="p-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="p-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-3 text-center">
                <Skeleton className="h-8 w-16 rounded-md" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
