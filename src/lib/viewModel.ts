import { getBuiltPageBySlug } from "@/lib/seo/pageRegistry";
import type { MoneyPageViewModel } from "@/lib/types";

function titleizeOrigin(origin: string) {
  return origin
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function getMoneyPageViewModel(pathname: string): MoneyPageViewModel | null {
  const page = getBuiltPageBySlug(pathname);
  if (!page) {
    return null;
  }
  const headingLabel = page.type === "hs" ? `HS ${page.hs6}` : page.clusterSlug ?? "Product";
  return {
    slug: page.slug,
    canonicalSlug: page.canonicalSlug,
    indexStatus: page.indexStatus,
    template: page.type,
    headingLabel,
    subtitle: `Import duty, VAT, risk and document readiness for ${titleizeOrigin(page.origin)} -> South Africa.`,
    origin: page.origin,
    dest: page.dest,
    clusterSlug: page.clusterSlug,
    hs6: page.hs6,
    docs: page.docs,
    risks: page.risks,
    internalLinks: page.internalLinks,
    presets: page.presets,
    initialOutput: page.initialOutput,
    readinessScore: page.readinessScore,
    blockers: page.blockers,
    tariffVersionLabel: page.tariffVersionLabel,
    tariffEffectiveDate: page.tariffEffectiveDate,
    sourcePointerShort: page.sourcePointerShort,
    lastUpdated: page.lastBuiltAt
  };
}
