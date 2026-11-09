import { describe, test, expect } from "bun:test";
import { isDuplicativeExcerpt } from "./excerpt";

describe("Letter page excerpt dedupe", () => {
  test("hides the founding letter excerpt that repeats the opening line", () => {
    const excerpt =
      "I am not an influencer, and I do not have it all figured out. This newsletter is 100% me.";
    const html =
      "<p>I am not an influencer, and I do not have it all figured out. I have put up some W&#8217;s.</p>";
    expect(isDuplicativeExcerpt(excerpt, html)).toBe(true);
  });

  test("keeps an excerpt that is its own line", () => {
    const excerpt = "A short summary written for search results.";
    const html = "<p>Something completely different happened first.</p>";
    expect(isDuplicativeExcerpt(excerpt, html)).toBe(false);
  });

  test("keeps a short shared opening that is not a repeat", () => {
    const excerpt = "The Long Game.";
    const html = "<p>The Long Game is one of many titles here.</p>";
    expect(isDuplicativeExcerpt(excerpt, html)).toBe(false);
  });

  test("treats missing content as no repeat", () => {
    expect(isDuplicativeExcerpt("Anything at all here", "")).toBe(false);
    expect(isDuplicativeExcerpt(null, "<p>Body</p>")).toBe(false);
  });
});
