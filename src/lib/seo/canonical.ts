import {
  getCanonicalCluster,
  getClusterHsMaps,
  getTariffRate
} from "@/lib/data/repository";
import type { ProductCluster } from "@/lib/data/types";
import { buildHsPath, buildProductPath } from "@/lib/seo/paths";

const PRODUCT_TO_HS_THRESHOLD = 0.85;

export type CanonicalDecision = {
  canonicalSlug: string;
  duplicateOfSlug?: string;
  reason: "self" | "synonym_collapse" | "product_to_hs";
};

export function resolveProductCanonical(params: {
  cluster: ProductCluster;
  origin: string;
  dest: string;
}): CanonicalDecision {
  const canonicalCluster = getCanonicalCluster(params.cluster);
  const selfPath = buildProductPath(params.cluster.slug, params.origin, params.dest);
  const canonicalClusterPath = buildProductPath(canonicalCluster.slug, params.origin, params.dest);

  if (params.cluster.isHero) {
    return {
      canonicalSlug: selfPath,
      reason: "self"
    };
  }

  if (canonicalCluster.id !== params.cluster.id) {
    return {
      canonicalSlug: canonicalClusterPath,
      duplicateOfSlug: canonicalClusterPath,
      reason: "synonym_collapse"
    };
  }

  const hsCandidates = getClusterHsMaps(params.cluster.id);
  const highConfidence = hsCandidates.filter((candidate) => candidate.confidence >= PRODUCT_TO_HS_THRESHOLD);
  if (highConfidence.length === 1) {
    const candidate = highConfidence[0];
    const hasRate = Boolean(getTariffRate(candidate.hs6, params.origin, params.dest));
    if (hasRate) {
      const hsPath = buildHsPath(candidate.hs6, params.origin, params.dest);
      return {
        canonicalSlug: hsPath,
        duplicateOfSlug: hsPath,
        reason: "product_to_hs"
      };
    }
  }

  return {
    canonicalSlug: selfPath,
    reason: "self"
  };
}

export function resolveHsCanonical(params: { hs6: string; origin: string; dest: string }): CanonicalDecision {
  const selfPath = buildHsPath(params.hs6, params.origin, params.dest);
  return {
    canonicalSlug: selfPath,
    reason: "self"
  };
}

