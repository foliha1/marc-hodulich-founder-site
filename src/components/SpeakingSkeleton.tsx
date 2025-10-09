import { Skeleton } from "@/components/ui/skeleton";

export const SpeakingSkeleton = () => {
  return (
    <section className="w-full bg-white section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-16 w-96 mb-6 bg-brand-stone" />
          <div className="max-w-3xl">
            <Skeleton className="h-4 w-full bg-brand-stone" />
          </div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="rounded overflow-hidden">
              <Skeleton className="aspect-video w-full bg-brand-stone skeleton-shimmer" />
              <div className="p-6">
                <Skeleton className="h-5 w-3/4 bg-brand-stone" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
