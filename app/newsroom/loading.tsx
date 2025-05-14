import { Skeleton } from "@/components/ui/skeleton"

export default function NewsroomLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/3" />
              <Skeleton className="mb-4 h-16 w-full" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}
