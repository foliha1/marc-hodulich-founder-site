import { useState } from "react";
import { Plus } from "lucide-react";
import { useMilestones } from "@/hooks/useMilestones";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";

// Text-only entrepreneurial milestones, managed in Admin → Failures & Firsts.
// Each row is an accordion: closed shows the teaser, open shows the full paragraph.
export const FailuresFirsts = () => {
  const { data, isLoading } = useMilestones();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  if (isLoading) return <FailuresFirstsSkeleton />;
  if (!data) return null;

  const { milestones, section } = data;

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="w-full bg-brand-night text-brand-warm pt-16 md:pt-24 pb-20 md:pb-32">
      <div className="container-wide">
        <div className="reveal mb-14 lg:mb-20">
          <p className="eyebrow eyebrow-readable mb-6">What Matters</p>
          <h2 className="font-display text-brand-warm text-[clamp(1.6rem,3.6vw,3.25rem)] tracking-normal leading-[1.05] text-balance">
            {section?.title || "Fulfillment Over Achievement"}
          </h2>
          {section?.paragraph && (
            <p className="font-editorial text-brand-warm/80 text-xl md:text-2xl leading-[1.5] max-w-[60rem] mt-8">
              {section.paragraph}
            </p>
          )}
        </div>

        <ol className="border-t border-brand-warm/10">
          {milestones.map((milestone, i) => {
            const isOpen = openIds.has(milestone.id);
            const panelId = `milestone-panel-${milestone.id}`;
            return (
              <li key={milestone.id} className="border-b border-brand-warm/10 reveal" style={{ animationDelay: `${i * 0.06}s` }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(milestone.id)}
                  className="grid w-full text-left grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-x-5 lg:gap-x-10 gap-y-3 items-start py-8 lg:py-12"
                >
                  <div className="col-span-2 lg:col-span-1 flex items-start justify-between gap-5">
                    <div>
                      <h3 className="font-display text-brand-warm text-2xl xl:text-3xl tracking-normal break-words">{milestone.title}</h3>
                      <p className="text-brand-red text-xs xl:text-sm font-semibold uppercase tracking-normal leading-relaxed mt-3">{milestone.contextual_label}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-red/60"
                    >
                      <Plus
                        className={`h-5 w-5 text-brand-red transition-transform duration-200 ease-out ${isOpen ? "rotate-45" : ""}`}
                      />
                    </span>
                  </div>
                  <div className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
                    {!isOpen && (
                      <p className="text-base xl:text-lg text-brand-warm/80 leading-[1.65] lg:pt-1">{milestone.teaser}</p>
                    )}
                  </div>
                </button>
                <div
                  id={panelId}
                  className="grid transition-[grid-template-rows] duration-[250ms] ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-x-5 lg:gap-x-10">
                      <p className="lg:col-start-2 text-base xl:text-lg text-brand-warm/80 leading-[1.65] pb-8 lg:pb-12 pr-14">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="reveal font-editorial text-brand-warm/85 text-xl md:text-2xl leading-[1.5] max-w-[60rem] mt-14 lg:mt-20">
          His test for all of it is simple. If it leads to fulfillment, do more of it. If it doesn't, find a way to do less.
        </p>
      </div>
    </section>
  );
};
