import type { BuiltPage } from "@/lib/seo/buildPass";
import { runBuildPass } from "@/lib/seo/buildPass";

let cache: { builtAt: number; pages: BuiltPage[] } | null = null;
const CACHE_TTL_MS = 30_000;

export function getBuiltPages(forceRefresh = false): BuiltPage[] {
  const now = Date.now();
  if (!forceRefresh && cache && now - cache.builtAt < CACHE_TTL_MS) {
    return cache.pages;
  }
  const pages = runBuildPass();
  cache = { builtAt: now, pages };
  return pages;
}

export function getBuiltPageBySlug(pathname: string): BuiltPage | undefined {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return getBuiltPages().find((page) => page.slug === normalized);
}

export function getIndexablePages() {
  return getBuiltPages().filter((page) => page.indexStatus === "INDEX");
}

