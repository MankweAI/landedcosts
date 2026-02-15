import type { MetadataRoute } from "next";
import type { BuiltPage } from "@/lib/seo/buildPass";

export function buildSitemapEntries(baseUrl: string, pages: BuiltPage[]): MetadataRoute.Sitemap {
  return pages
    .filter((page) => page.indexStatus === "INDEX")
    .map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: page.lastBuiltAt,
      changeFrequency: "weekly",
      priority: page.type === "hs" ? 0.8 : 0.7
    }));
}

