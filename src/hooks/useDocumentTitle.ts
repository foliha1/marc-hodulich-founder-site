import { useEffect } from "react";

const SUFFIX = " | Marc Hodulich";

const setMeta = (selector: string, attr: "name" | "property", key: string, value: string): string | null => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  const previous = el ? el.getAttribute("content") : null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
  return previous;
};

const restoreMeta = (selector: string, previous: string | null) => {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) return;
  if (previous === null) el.remove();
  else el.setAttribute("content", previous);
};

/** Sets the page title (and optional description) and restores previous values on unmount. */
export const useDocumentTitle = (title?: string | null, description?: string | null) => {
  useEffect(() => {
    if (!title) return;
    const full = `${title}${SUFFIX}`;
    const prevTitle = document.title;
    document.title = full;

    const entries: Array<[string, "name" | "property", string, string]> = [
      ['meta[property="og:title"]', "property", "og:title", full],
      ['meta[name="twitter:title"]', "name", "twitter:title", full],
    ];
    if (description) {
      entries.push(
        ['meta[name="description"]', "name", "description", description],
        ['meta[property="og:description"]', "property", "og:description", description],
        ['meta[name="twitter:description"]', "name", "twitter:description", description],
      );
    }
    const previous = entries.map(([sel, attr, key, val]) => [sel, setMeta(sel, attr, key, val)] as const);

    return () => {
      document.title = prevTitle;
      previous.forEach(([sel, prev]) => restoreMeta(sel, prev));
    };
  }, [title, description]);
};
