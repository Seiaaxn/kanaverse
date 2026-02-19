import { Skeleton } from "@/components/ui/Skeleton";

export default function AnimeDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Cover skeleton */}
        <Skeleton className="aspect-[2/3] w-full rounded-lg" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full" />

          {/* Episode list skeleton */}
          <div className="mt-8">
            <Skeleton className="mb-4 h-8 w-32" />
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
