import type { MetadataRoute } from "next";
import { getBuiltPages } from "@/lib/seo/pageRegistry";
import { buildSitemapEntries } from "@/lib/seo/sitemapWriter";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.landedcostintelligence.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getBuiltPages().filter((page) => page.indexStatus === "INDEX");
  return buildSitemapEntries(BASE_URL, pages);
}

