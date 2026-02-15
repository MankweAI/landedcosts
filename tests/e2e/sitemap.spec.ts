import { describe, expect, it } from "vitest";
import { runBuildPass } from "@/lib/seo/buildPass";
import { buildSitemapEntries } from "@/lib/seo/sitemapWriter";

describe("sitemap safety rails", () => {
  it("includes INDEX pages and excludes NOINDEX pages", () => {
    const pages = runBuildPass();
    const entries = buildSitemapEntries("https://example.com", pages);
    const urls = new Set(entries.map((entry) => entry.url.replace("https://example.com", "")));
    for (const page of pages) {
      if (page.indexStatus === "INDEX") {
        expect(urls.has(page.slug)).toBe(true);
      } else {
        expect(urls.has(page.slug)).toBe(false);
      }
    }
  });
});

