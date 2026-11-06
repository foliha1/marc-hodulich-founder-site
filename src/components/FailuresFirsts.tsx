import { useMilestones } from "@/hooks/useMilestones";
import { FailuresFirstsSkeleton } from "@/components/FailuresFirstsSkeleton";

// Text-only entrepreneurial milestones, managed in Admin → Failures & Firsts.
export const FailuresFirsts = () => {
  const { data, isLoading } = useMilestones();

  if (isLoading) return <FailuresFirstsSkeleton />;
  if (!data) return null;

  const { milestones, section } = data;

  return (
    <section className="w-full bg-brand-night text-brand-warm pt-16 md:pt-24 pb-20 md:pb-32">
      <div className="container-wide">
        <div className="reveal mb-14 lg:mb-20">
          <p className="eyebrow eyebrow-readable mb-6">Fulfillment Over Achievement</p>
          <h2 className="font-display text-brand-warm text-[clamp(1.6rem,3.6vw,3.25rem)] tracking-normal leading-[1.05] text-balance">
            {section?.title || "Failures, Firsts, and Foundations"}
          </h2>
          {section?.paragraph && (
            <p className="font-editorial text-brand-warm/80 text-xl md:text-2xl leading-[1.5] max-w-[60rem] mt-8">
              {section.paragraph}
            </p>
          )}
        </div>

        <ol className="border-t border-brand-warm/10">
          {milestones.map((milestone, i) => (
            <li
              key={milestone.id}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,0.5fr)_minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,2fr)] gap-x-5 lg:gap-x-8 gap-y-4 items-start py-8 lg:py-12 border-b border-brand-warm/10 reveal"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="font-display text-brand-red text-2xl md:text-3xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-brand-warm text-2xl xl:text-3xl tracking-normal break-words">{milestone.title}</h3>
              <p className="col-start-2 lg:col-start-auto text-brand-red text-[10px] xl:text-xs font-semibold uppercase tracking-normal leading-relaxed lg:pt-1">{milestone.contextual_label}</p>
              <p className="col-start-2 lg:col-start-auto text-sm text-brand-warm/75 leading-[1.65]">{milestone.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
