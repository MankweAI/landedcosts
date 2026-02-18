import { getBuiltPageBySlug } from "@/lib/seo/pageRegistry";
import type { MoneyPageViewModel } from "@/lib/types";
import { evaluateCompliance } from "@/lib/compliance/engine";

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

  // ImportOS: Evaluate compliance for this route
  const complianceResult = page.hs6
    ? evaluateCompliance(page.hs6, page.dest, page.clusterSlug)
    : null;

  // ImportOS: If compliance is unknown, enforce NOINDEX per spec
  let indexStatus = page.indexStatus;
  if (complianceResult && complianceResult.legality.status === "unknown") {
    indexStatus = "NOINDEX";
  }

  return {
    slug: page.slug,
    canonicalSlug: page.canonicalSlug,
    indexStatus,
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
    lastUpdated: page.lastBuiltAt,
    complianceResult,
    context: page.context,
    faqs: page.faqs
  };
}
