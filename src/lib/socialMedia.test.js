import { describe, test, expect } from "bun:test";
import { getInstagramPostUrl, hasSocialThumbnail } from "./socialMedia";

describe("Instagram gallery rules", () => {
  test("preserves original post links and carousel parameters", () => {
    const url = "https://www.instagram.com/p/DPefcXdjRRO/?img_index=1";
    expect(getInstagramPostUrl(url)).toBe(url);
  });
  test("accepts original reels", () => {
    expect(getInstagramPostUrl("https://www.instagram.com/reel/ABC_123/")).toBe("https://www.instagram.com/reel/ABC_123/");
  });
  test("missing URLs do not get profile fallbacks", () => {
    expect(getInstagramPostUrl(null)).toBeNull();
    expect(getInstagramPostUrl("https://www.instagram.com/marchodulich/")).toBeNull();
  });
  test("rejects unsafe or unrelated destinations", () => {
    expect(getInstagramPostUrl("javascript:alert(1)")).toBeNull();
    expect(getInstagramPostUrl("https://instagram.com.example.com/p/ABC/")).toBeNull();
  });
  test("does not substitute legacy stock thumbnails", () => {
    expect(hasSocialThumbnail("https://images.unsplash.com/photo-1551632811-561732d1e306?w=400")).toBe(false);
    expect(hasSocialThumbnail("https://example.com/storage/v1/object/public/cms-images/social/post.jpg")).toBe(true);
  });
});