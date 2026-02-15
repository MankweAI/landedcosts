import { calculateLandedCost, computeScenarioPresets, createBaseInput } from "@/lib/calc/engine";
import type { CalcOutput, ScenarioPreset } from "@/lib/calc/types";
import {
  defaultOrigins,
  destinationSlug
} from "@/lib/data/fixtures";
import {
  getClusterBySlug,
  getClusterHsMaps,
  getDocRequirementsForContext,
  getHsCodes,
  getProductClusters,
  getRiskRulesForContext,
  getTariffRate,
  getTariffVersion,
  hasAnyTariffRate
} from "@/lib/data/repository";
import type { DocRequirement, PageRecord, ProductCluster, RiskRule } from "@/lib/data/types";
import { resolveHsCanonical, resolveProductCanonical } from "@/lib/seo/canonical";
import { evaluateIndexPolicy } from "@/lib/seo/indexPolicy";
import { generateInternalLinksForHs, generateInternalLinksForProduct, type InternalLink } from "@/lib/seo/internalLinks";
import { buildHsPath, buildProductPath } from "@/lib/seo/paths";

export type PageBuildKind = "product" | "hs";

export type RawPage = {
  slug: string;
  type: PageBuildKind;
  origin: string;
  dest: string;
  clusterSlug?: string;
  hs6?: string;
};

export type BuiltPage = PageRecord & {
  type: PageBuildKind;
  clusterSlug?: string;
  hs6?: string;
  title: string;
  description: string;
  docs: DocRequirement[];
  risks: RiskRule[];
  internalLinks: InternalLink[];
  presets: ScenarioPreset[];
  initialOutput: CalcOutput | null;
  tariffVersionLabel: string;
  tariffEffectiveDate: string;
  sourcePointerShort: string;
};

function generateRawPages(): RawPage[] {
  const pages: RawPage[] = [];
  const clusters = getProductClusters();
  const hsCodes = getHsCodes();
  for (const origin of defaultOrigins) {
    for (const cluster of clusters) {
      pages.push({
        slug: buildProductPath(cluster.slug, origin, destinationSlug),
        type: "product",
        origin,
        dest: destinationSlug,
        clusterSlug: cluster.slug
      });
    }
    for (const hs of hsCodes) {
      pages.push({
        slug: buildHsPath(hs.hs6, origin, destinationSlug),
        type: "hs",
        origin,
        dest: destinationSlug,
        hs6: hs.hs6
      });
    }
  }
  return pages;
}

function fingerprintForNearDuplicate(page: BuiltPage): string {
  const docs = page.docs.map((doc) => doc.id).sort().join(",");
  const risks = page.risks.map((risk) => risk.id).sort().join(",");
  const presets = page.presets
    .map((preset) => `${preset.id}:${preset.output.totalTaxesZar}:${preset.output.landedCostPerUnitZar}`)
    .join("|");
  return `${docs}|${risks}|${presets}`;
}

function buildProductPage(raw: RawPage, nowIso: string): BuiltPage {
  const cluster = getClusterBySlug(raw.clusterSlug ?? "");
  if (!cluster) {
    throw new Error(`Unknown cluster slug: ${raw.clusterSlug}`);
  }

  const hsCandidates = getClusterHsMaps(cluster.id);
  const topCandidate = hsCandidates[0];
  const topHs6 = topCandidate?.hs6;
  const docs = getDocRequirementsForContext({
    originSlug: raw.origin,
    destSlug: raw.dest,
    clusterId: cluster.id,
    hs6: topHs6
  });
  const risks = getRiskRulesForContext({
    originSlug: raw.origin,
    destSlug: raw.dest,
    clusterId: cluster.id,
    hs6: topHs6
  });
  const internalLinks = generateInternalLinksForProduct({
    cluster,
    origin: raw.origin,
    dest: raw.dest
  });

  const baseInput = createBaseInput({
    hs6: topHs6 ?? "000000",
    origin: raw.origin,
    dest: raw.dest,
    hsConfidence: topCandidate?.confidence ?? 0
  });
  const initialOutput = topHs6 ? calculateLandedCost(baseInput) : null;
  const presets = initialOutput ? computeScenarioPresets(baseInput) : [];
  const canonical = resolveProductCanonical({
    cluster,
    origin: raw.origin,
    dest: raw.dest
  });
  const version = getTariffVersion();

  const evaluation = evaluateIndexPolicy({
    hasHsCandidates: hsCandidates.length > 0,
    hasAnyTariffRate: hasAnyTariffRate(
      hsCandidates.map((candidate) => candidate.hs6),
      raw.origin,
      raw.dest
    ),
    vatModuleSucceeded: initialOutput !== null,
    docsBlockPresent: docs.length > 0,
    riskBlockPresent: risks.length > 0,
    uniqueBlocksCount: Number(docs.length > 0) + Number(risks.length > 0) + Number(presets.length === 3),
    internalLinksCount: internalLinks.length,
    freshnessMetadataPresent: Boolean(version.label && version.effectiveDate),
    hasComputedExampleOutputs: presets.length === 3,
    hasValidPrefill: hsCandidates.length > 0,
    hasBreakdownDutyAndVat: Boolean(
      initialOutput &&
        initialOutput.breakdown.some((line) => line.id === "duty") &&
        initialOutput.breakdown.some((line) => line.id === "vat")
    ),
    isDuplicateCanonicalized: Boolean(canonical.duplicateOfSlug),
    wouldOutputContactBrokerWithoutNumbers: !initialOutput
  });

  return {
    slug: raw.slug,
    type: raw.type,
    origin: raw.origin,
    dest: raw.dest,
    clusterSlug: cluster.slug,
    indexStatus: evaluation.indexStatus,
    canonicalSlug: canonical.canonicalSlug,
    duplicateOfSlug: canonical.duplicateOfSlug,
    readinessScore: evaluation.readinessScore,
    hasComputedExampleOutputs: presets.length === 3,
    blockers: [...evaluation.blockers],
    lastBuiltAt: nowIso,
    lastIndexStatusChangeAt: nowIso,
    title: `Import duty & landed cost for ${cluster.name} from ${raw.origin} to South Africa`,
    description:
      "Decision-grade landed cost with duty, VAT, risk callouts, docs checklist, and scenario presets.",
    docs,
    risks,
    internalLinks,
    presets,
    initialOutput,
    hs6: topHs6,
    tariffVersionLabel: version.label,
    tariffEffectiveDate: version.effectiveDate,
    sourcePointerShort: version.sourcePointerShort
  };
}

function buildHsPage(raw: RawPage, nowIso: string): BuiltPage {
  const hs6 = raw.hs6 ?? "";
  const docs = getDocRequirementsForContext({
    originSlug: raw.origin,
    destSlug: raw.dest,
    hs6
  });
  const risks = getRiskRulesForContext({
    originSlug: raw.origin,
    destSlug: raw.dest,
    hs6
  });
  const internalLinks = generateInternalLinksForHs({
    hs6,
    origin: raw.origin,
    dest: raw.dest
  });
  const rate = getTariffRate(hs6, raw.origin, raw.dest);
  const baseInput = createBaseInput({
    hs6,
    origin: raw.origin,
    dest: raw.dest,
    hsConfidence: 1
  });
  const initialOutput = calculateLandedCost(baseInput);
  const presets = initialOutput ? computeScenarioPresets(baseInput) : [];
  const canonical = resolveHsCanonical({
    hs6,
    origin: raw.origin,
    dest: raw.dest
  });
  const version = getTariffVersion();
  const evaluation = evaluateIndexPolicy({
    hasHsCandidates: true,
    hasAnyTariffRate: Boolean(rate),
    vatModuleSucceeded: initialOutput !== null,
    docsBlockPresent: docs.length > 0,
    riskBlockPresent: risks.length > 0,
    uniqueBlocksCount: Number(docs.length > 0) + Number(risks.length > 0) + Number(presets.length === 3),
    internalLinksCount: internalLinks.length,
    freshnessMetadataPresent: Boolean(version.label && version.effectiveDate),
    hasComputedExampleOutputs: presets.length === 3,
    hasValidPrefill: true,
    hasBreakdownDutyAndVat: Boolean(initialOutput),
    isDuplicateCanonicalized: false,
    wouldOutputContactBrokerWithoutNumbers: !initialOutput
  });

  return {
    slug: raw.slug,
    type: raw.type,
    origin: raw.origin,
    dest: raw.dest,
    hs6,
    indexStatus: evaluation.indexStatus,
    canonicalSlug: canonical.canonicalSlug,
    readinessScore: evaluation.readinessScore,
    hasComputedExampleOutputs: presets.length === 3,
    blockers: [...evaluation.blockers],
    lastBuiltAt: nowIso,
    lastIndexStatusChangeAt: nowIso,
    title: `Import duty & landed cost for HS ${hs6} from ${raw.origin} to South Africa`,
    description: "HS-specific duty and VAT with landed cost scenarios and explainability.",
    docs,
    risks,
    internalLinks,
    presets,
    initialOutput,
    tariffVersionLabel: version.label,
    tariffEffectiveDate: version.effectiveDate,
    sourcePointerShort: version.sourcePointerShort
  };
}

function applyNearDuplicateCollapse(pages: BuiltPage[]) {
  const fingerprintToCanonical = new Map<string, string>();
  for (const page of pages) {
    if (page.type !== "product" || page.duplicateOfSlug) {
      continue;
    }
    const fingerprint = fingerprintForNearDuplicate(page);
    const existingCanonical = fingerprintToCanonical.get(fingerprint);
    if (!existingCanonical) {
      fingerprintToCanonical.set(fingerprint, page.slug);
      continue;
    }
    if (existingCanonical !== page.slug) {
      page.duplicateOfSlug = existingCanonical;
      page.canonicalSlug = existingCanonical;
      if (!page.blockers.includes("DUPLICATE_CANONICALIZED")) {
        page.blockers.push("DUPLICATE_CANONICALIZED");
      }
      page.indexStatus = "NOINDEX";
    }
  }
}

export function runBuildPass(): BuiltPage[] {
  const nowIso = new Date().toISOString();
  const rawPages = generateRawPages();
  const builtPages = rawPages.map((raw) => {
    if (raw.type === "product") {
      return buildProductPage(raw, nowIso);
    }
    return buildHsPage(raw, nowIso);
  });
  applyNearDuplicateCollapse(builtPages);

  builtPages.sort((a, b) => a.slug.localeCompare(b.slug));
  return builtPages;
}

export function findBuiltPageBySlug(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return runBuildPass().find((page) => page.slug === normalized);
}

export function resolveClusterForPage(page: BuiltPage): ProductCluster | undefined {
  if (!page.clusterSlug) {
    return undefined;
  }
  return getClusterBySlug(page.clusterSlug);
}
