import type { MetadataRoute } from "next";
import { getBuiltPages } from "@/lib/seo/pageRegistry";
import { buildSitemapEntries } from "@/lib/seo/sitemapWriter";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getBuiltPages().filter((page) => page.indexStatus === "INDEX");
  return buildSitemapEntries(BASE_URL, pages);
}

