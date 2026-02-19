import { GridSkeleton } from "@/components/ui/Skeleton";

export default function AnimeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar skeleton */}
      <div className="mb-8">
        <div className="bg-muted mx-auto h-12 w-full max-w-md animate-pulse rounded-lg" />
      </div>

      {/* Section skeleton */}
      <div className="space-y-8">
        <div>
          <div className="bg-muted mb-4 h-8 w-48 animate-pulse rounded" />
          <GridSkeleton count={6} />
        </div>

        <div>
          <div className="bg-muted mb-4 h-8 w-48 animate-pulse rounded" />
          <GridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
