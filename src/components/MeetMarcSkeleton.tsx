import { Skeleton } from "@/components/ui/skeleton";

export const MeetMarcSkeleton = () => {
  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="mb-24">
          <Skeleton className="h-16 w-64 mb-12 bg-brand-stone" />
          <div className="max-w-3xl space-y-3">
            <Skeleton className="h-4 w-full bg-brand-stone" />
            <Skeleton className="h-4 w-full bg-brand-stone" />
            <Skeleton className="h-4 w-3/4 bg-brand-stone" />
          </div>
        </div>

        {/* Staggered Cards Skeleton */}
        <div className="space-y-32">
          {[0, 1, 2, 3].map((index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <Skeleton className="w-full aspect-[16/9] rounded bg-brand-stone" />
                </div>
                <div className="lg:w-1/2 space-y-4">
                  <Skeleton className="h-12 w-3/4 bg-brand-stone" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-brand-stone" />
                    <Skeleton className="h-4 w-full bg-brand-stone" />
                    <Skeleton className="h-4 w-5/6 bg-brand-stone" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
