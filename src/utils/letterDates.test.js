import { describe, test, expect } from "bun:test";
import { displayDateOverride } from "./letterDates";

describe("Letter display dates", () => {
  test("founding letter is shown as Nov. 12", () => {
    expect(displayDateOverride("the-founding-letter")).toBe("Nov. 12");
  });

  test("letters without an override fall back to the CMS date", () => {
    expect(displayDateOverride("some-future-letter")).toBeNull();
    expect(displayDateOverride(undefined)).toBeNull();
    expect(displayDateOverride(null)).toBeNull();
  });
});
