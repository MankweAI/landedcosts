import { describe, expect, it } from "vitest";
import { getClusterBySlug } from "@/lib/data/repository";
import { resolveProductCanonical } from "@/lib/seo/canonical";

describe("canonical decision tree", () => {
  it("collapses synonym cluster to canonical cluster url", () => {
    const cluster = getClusterBySlug("photovoltaic-modules");
    if (!cluster) throw new Error("fixture not found");
    const decision = resolveProductCanonical({
      cluster,
      origin: "china",
      dest: "south-africa"
    });
    expect(decision.reason).toBe("synonym_collapse");
    expect(decision.canonicalSlug).toContain("/solar-panels/");
  });

  it("product can canonicalize to hs page when confidently unique", () => {
    const cluster = getClusterBySlug("solar-panels");
    if (!cluster) throw new Error("fixture not found");
    const decision = resolveProductCanonical({
      cluster,
      origin: "china",
      dest: "south-africa"
    });
    expect(decision.reason).toBe("product_to_hs");
    expect(decision.canonicalSlug).toContain("/hs/854140/");
  });

  it("falls back to self canonical when rate is missing", () => {
    const cluster = getClusterBySlug("lithium-batteries");
    if (!cluster) throw new Error("fixture not found");
    const decision = resolveProductCanonical({
      cluster,
      origin: "india",
      dest: "south-africa"
    });
    expect(decision.reason).toBe("self");
  });
});

