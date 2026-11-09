import { useState } from "react";
import { Plus } from "lucide-react";
import { useMilestones } from "@/hooks/useMilestones";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";

// Text-only entrepreneurial milestones, managed in Admin → Failures & Firsts.
// Two columns on desktop, three rows deep; each cell is an accordion:
// closed shows the teaser, open shows the full paragraph.
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
        <div className="reveal mb-10 lg:mb-14">
          <p className="eyebrow eyebrow-readable mb-6">What Matters</p>
          <h2 className="font-display text-brand-warm text-[clamp(1.6rem,3.6vw,3.25rem)] tracking-normal leading-[1.05] text-balance">
            {section?.title || "Fulfillment Over Achievement"}
          </h2>
          {section?.paragraph && (
            <p className="font-editorial text-brand-warm/80 text-base md:text-lg leading-[1.55] max-w-[60rem] mt-6">
              {section.paragraph}
            </p>
          )}
        </div>

        <ol className="grid border-t border-brand-warm/10 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
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
                  className="w-full text-left py-5 lg:py-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-brand-warm text-2xl xl:text-3xl tracking-normal break-words">{milestone.title}</h3>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-red/60"
                    >
                      <Plus
                        className={`h-5 w-5 text-brand-red transition-transform duration-200 ease-out ${isOpen ? "rotate-45" : ""}`}
                      />
                    </span>
                  </div>
                  <p className="text-brand-red text-xs xl:text-sm font-semibold uppercase tracking-normal leading-relaxed mt-2">{milestone.contextual_label}</p>
                  {!isOpen && (
                    <p className="text-base xl:text-lg text-brand-warm/80 leading-[1.6] mt-2">{milestone.teaser}</p>
                  )}
                </button>
                <div
                  id={panelId}
                  className="grid transition-[grid-template-rows] duration-[250ms] ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-base xl:text-lg text-brand-warm/80 leading-[1.65] pb-5 lg:pb-6 pr-2">{milestone.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="reveal font-editorial text-brand-warm/85 text-xl md:text-2xl leading-[1.5] max-w-[60rem] mt-10 lg:mt-14">
          His test for all of it is simple. If it leads to fulfillment, do more of it. If it doesn't, find a way to do less.
        </p>
      </div>
    </section>
  );
};
