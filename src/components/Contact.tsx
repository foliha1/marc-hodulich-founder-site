import { Link } from "react-router-dom";
import { useContactContent } from "@/hooks/useContactContent";
import { toast } from "@/hooks/use-toast";

export const Contact = () => {
  const { data: content } = useContactContent();

  if (!content) return null;

  return (
    <section className="w-full bg-brand-night text-brand-warm section-spacing border-t border-brand-warm/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal max-w-3xl">
          <p className="eyebrow mb-6">Say Hello</p>
          <h2 className="font-display text-brand-warm text-[clamp(2.6rem,6vw,5.5rem)] mb-8">{content.title}</h2>
          <p className="font-editorial text-brand-warm/80 text-[clamp(1.25rem,2vw,1.75rem)] leading-snug mb-12 max-w-xl">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${content.email}`}
              onClick={() => {
                // mailto does nothing when no email app is set up, so also copy the
                // address and confirm on screen — the click always has a visible result.
                void navigator.clipboard?.writeText(content.email).catch(() => undefined);
                toast({ title: "Email address copied", description: `${content.email} — paste it into your email to reach Marc's team.` });
              }}
              className="btn-night bg-brand-red text-brand-warm hover:bg-brand-warm hover:text-brand-night">
              {content.button_text} <span aria-hidden="true">→</span>
            </a>
            <Link to="/unsettled" className="btn-night border border-brand-warm/30 text-brand-warm hover:border-brand-red hover:text-brand-red">
              Unsettled Coaching <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
