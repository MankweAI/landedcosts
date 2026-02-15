import {
  clusterHsMaps,
  countries,
  destinationSlug,
  docsRequirements,
  hsCodes,
  productClusters,
  riskRules,
  tariffRates,
  tariffVersion
} from "@/lib/data/fixtures";
import type {
  ClusterHsMap,
  DocRequirement,
  HsCode,
  ProductCluster,
  RiskRule,
  TariffRate
} from "@/lib/data/types";

export function getCountries() {
  return countries;
}

export function getCountryBySlug(slug: string) {
  return countries.find((item) => item.slug === slug);
}

export function getDestinationSlug() {
  return destinationSlug;
}

export function getProductClusters() {
  return productClusters;
}

export function getClusterBySlug(slug: string): ProductCluster | undefined {
  return productClusters.find((item) => item.slug === slug);
}

export function getClusterById(id: string): ProductCluster | undefined {
  return productClusters.find((item) => item.id === id);
}

export function getHsCodes() {
  return hsCodes;
}

export function getHsCodeBy6(hs6: string): HsCode | undefined {
  return hsCodes.find((item) => item.hs6 === hs6);
}

export function getClusterHsMaps(clusterId: string): ClusterHsMap[] {
  return clusterHsMaps
    .filter((item) => item.clusterId === clusterId)
    .sort((a, b) => b.confidence - a.confidence);
}

export function getClusterHsMapsByHs(hs6: string): ClusterHsMap[] {
  return clusterHsMaps.filter((item) => item.hs6 === hs6).sort((a, b) => b.confidence - a.confidence);
}

export function getAllClusterHsMaps() {
  return clusterHsMaps;
}

export function getTariffVersion() {
  return tariffVersion;
}

export function getTariffRates() {
  return tariffRates;
}

export function getTariffRate(hs6: string, originSlug: string, destSlug: string): TariffRate | undefined {
  return tariffRates.find(
    (item) => item.hs6 === hs6 && item.originSlug === originSlug && item.destSlug === destSlug
  );
}

export function hasAnyTariffRate(hs6List: string[], originSlug: string, destSlug: string): boolean {
  return hs6List.some((hs6) => Boolean(getTariffRate(hs6, originSlug, destSlug)));
}

function originDestFilter<T extends { originSlug: string; destSlug: string }>(
  data: T[],
  originSlug: string,
  destSlug: string
) {
  return data.filter((item) => item.originSlug === originSlug && item.destSlug === destSlug);
}

export function getDocRequirementsForContext(params: {
  originSlug: string;
  destSlug: string;
  clusterId?: string;
  hs6?: string;
}): DocRequirement[] {
  const base = originDestFilter(docsRequirements, params.originSlug, params.destSlug);
  return base.filter((item) => {
    if (item.clusterId && params.clusterId) {
      return item.clusterId === params.clusterId;
    }
    if (item.hs6 && params.hs6) {
      return item.hs6 === params.hs6;
    }
    return !item.clusterId && !item.hs6;
  });
}

export function getRiskRulesForContext(params: {
  originSlug: string;
  destSlug: string;
  clusterId?: string;
  hs6?: string;
}): RiskRule[] {
  const base = originDestFilter(riskRules, params.originSlug, params.destSlug);
  const selected = base.filter((item) => {
    if (item.clusterId && params.clusterId) {
      return item.clusterId === params.clusterId;
    }
    if (item.hs6 && params.hs6) {
      return item.hs6 === params.hs6;
    }
    return !item.clusterId && !item.hs6;
  });
  if (selected.length > 0) {
    return selected;
  }
  return [
    {
      id: "risk-none-known",
      originSlug: params.originSlug,
      destSlug: params.destSlug,
      riskLevel: "low",
      textShort: "No specific additional risks are currently flagged for this route."
    }
  ];
}

export function getDefaultHsCandidateForCluster(clusterId: string): ClusterHsMap | undefined {
  return getClusterHsMaps(clusterId)[0];
}

export function getCanonicalCluster(cluster: ProductCluster): ProductCluster {
  if (!cluster.canonicalClusterId) {
    return cluster;
  }
  return getClusterById(cluster.canonicalClusterId) ?? cluster;
}

export function isKnownOrigin(originSlug: string) {
  return Boolean(getCountryBySlug(originSlug));
}

