import { describe, expect, it } from "vitest";
import { buildSeoMetadata, getRobotsValue } from "@/lib/seo/meta";

describe("seo meta builder", () => {
  it("returns index robots for INDEX pages", () => {
    expect(getRobotsValue("INDEX")).toBe("index,follow");
  });

  it("returns noindex robots for NOINDEX pages", () => {
    expect(getRobotsValue("NOINDEX")).toBe("noindex,follow");
  });

  it("sets canonical path", () => {
    const meta = buildSeoMetadata({
      title: "t",
      description: "d",
      canonicalPath: "/x",
      indexStatus: "INDEX"
    });
    expect(meta.alternates?.canonical).toBe("/x");
  });
});

