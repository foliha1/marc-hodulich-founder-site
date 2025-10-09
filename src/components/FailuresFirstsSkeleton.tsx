import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export const FailuresFirstsSkeleton = () => {
  return (
    <section className="w-full bg-brand-warm section-spacing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-16 w-96 mb-6 bg-brand-stone" />
          <div className="max-w-3xl space-y-3 mb-8">
            <Skeleton className="h-4 w-full bg-brand-stone" />
            <Skeleton className="h-4 w-full bg-brand-stone" />
            <Skeleton className="h-4 w-3/4 bg-brand-stone" />
          </div>
          <div className="flex justify-start">
            <div className="animate-bounce-horizontal">
              <ChevronRight className="w-6 h-6 text-brand-ink" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Carousel Skeleton */}
      <div className="-mx-6 lg:-mx-8">
        <div className="flex gap-3 md:gap-6 ml-6 lg:ml-8 overflow-hidden">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex-shrink-0 w-[356px] sm:w-[427px] md:w-[640px] lg:w-[854px]">
              <Skeleton className="w-full aspect-video rounded bg-brand-stone skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
