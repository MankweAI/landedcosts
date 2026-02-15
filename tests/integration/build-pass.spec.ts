import { describe, expect, it } from "vitest";
import { runBuildPass } from "@/lib/seo/buildPass";

describe("build-pass readiness and index policy", () => {
  it("keeps pages without rates as NOINDEX with blocker", () => {
    const pages = runBuildPass();
    const target = pages.find(
      (page) =>
        page.slug === "/import-duty-vat-landed-cost/lithium-batteries/from/india/to/south-africa"
    );
    if (!target) throw new Error("target page missing");
    expect(target.indexStatus).toBe("NOINDEX");
    expect(target.blockers).toContain("MISSING_TARIFF_RATE");
  });

  it("indexes pages that satisfy readiness and computed presets", () => {
    const pages = runBuildPass();
    const target = pages.find((page) => page.slug === "/import-duty-vat-landed-cost/hs/854140/from/china/to/south-africa");
    if (!target) throw new Error("target page missing");
    expect(target.presets).toHaveLength(3);
    expect(target.readinessScore).toBeGreaterThanOrEqual(70);
    expect(target.indexStatus).toBe("INDEX");
  });
});

