import { TSGhostContentAPI } from "@ts-ghost/content-api";

// Ghost Content API keys are publishable (read-only, browser-safe)
export const GHOST_URL = "https://blog.marchodulich.com";
export const GHOST_CONTENT_KEY = "97b5a2e97b468db6ce5da67916";

export const ghost = new TSGhostContentAPI(GHOST_URL, GHOST_CONTENT_KEY, "v5.0");

export const formatPostDate = (date?: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
