import type { MetadataRoute } from "next";
import { getBuiltPages } from "@/lib/seo/pageRegistry";
import { buildSitemapEntries } from "@/lib/seo/sitemapWriter";

import { destinations } from "@/lib/data/fixtures";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.landedcostintelligence.com";

export async function generateSitemaps() {
  return destinations.map((id) => ({ id }));
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  const pages = getBuiltPages().filter((page) => page.indexStatus === "INDEX");
  const filteredPages = id ? pages.filter((page) => page.dest === id) : pages;
  return buildSitemapEntries(BASE_URL, filteredPages);
}

