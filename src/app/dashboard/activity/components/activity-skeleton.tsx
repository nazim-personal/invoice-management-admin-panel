import { Skeleton } from "@/components/ui/skeleton";

export function ActivitySkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="min-w-0 flex-1 py-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-1 h-3 w-3/4" />
          </div>
          <div className="flex-shrink-0 self-center">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}