import { describe, expect, it } from "vitest";
import { slugifyClusterName } from "@/lib/seo/slug";

describe("slugifyClusterName", () => {
  it("is deterministic for same input", () => {
    const input = "Solar Panels & Kits";
    expect(slugifyClusterName(input)).toBe(slugifyClusterName(input));
  });

  it("avoids reserved words", () => {
    expect(slugifyClusterName("hs")).not.toBe("hs");
  });

  it("caps length to <= 60", () => {
    const slug = slugifyClusterName("x".repeat(140));
    expect(slug.length).toBeLessThanOrEqual(60);
  });
});

