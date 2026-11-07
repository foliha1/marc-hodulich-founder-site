import { Skeleton } from "@/components/ui/skeleton";

export const FailuresFirstsSkeleton = () => {
  return (
    <section className="w-full bg-brand-night pt-16 md:pt-24 pb-20 md:pb-32">
      <div className="container-wide">
        <div className="mb-14 lg:mb-20">
          <Skeleton className="h-4 w-32 mb-6 bg-brand-warm/10" />
          <Skeleton className="h-12 w-2/3 mb-8 bg-brand-warm/10" />
          <div className="max-w-[60rem] space-y-3">
            <Skeleton className="h-5 w-full bg-brand-warm/10" />
            <Skeleton className="h-5 w-3/4 bg-brand-warm/10" />
          </div>
        </div>
        <div className="border-t border-brand-warm/10">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="py-8 lg:py-12 border-b border-brand-warm/10">
              <Skeleton className="h-7 w-1/3 bg-brand-warm/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
