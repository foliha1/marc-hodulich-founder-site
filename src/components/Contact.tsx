import { useState } from "react";
import { Link } from "react-router-dom";
import { useContactContent } from "@/hooks/useContactContent";

export const Contact = () => {
  const { data: content } = useContactContent();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const copyEmail = () => {
    navigator.clipboard
      ?.writeText(content.email)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

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
                // Email apps often aren't set up (and embedded previews block mailto),
                // so always show the address on the page and copy it as well.
                setRevealed(true);
                copyEmail();
              }}
              className="btn-night bg-brand-red text-brand-warm hover:bg-brand-warm hover:text-brand-night">
              {content.button_text} <span aria-hidden="true">→</span>
            </a>
            <Link to="/unsettled" className="btn-night border border-brand-warm/30 text-brand-warm hover:border-brand-red hover:text-brand-red">
              Unsettled Coaching <span aria-hidden="true">→</span>
            </Link>
          </div>
          {revealed && (
            <p role="status" className="mt-8 font-editorial text-brand-warm/80 text-lg">
              Email Marc's team at{" "}
              <a href={`mailto:${content.email}`} className="text-brand-warm underline underline-offset-4 hover:text-brand-red">
                {content.email}
              </a>
              {copied ? <span className="text-brand-warm/60"> — copied to your clipboard</span> : (
                <button type="button" onClick={copyEmail} className="ml-3 text-sm uppercase tracking-[0.2em] text-brand-warm/60 hover:text-brand-red">
                  Copy
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
