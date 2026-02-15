import {
  getClusterById,
  getClusterHsMaps,
  getClusterHsMapsByHs,
  getCountries,
  getHsCodeBy6,
  getProductClusters,
  getTariffRate
} from "@/lib/data/repository";
import type { ProductCluster } from "@/lib/data/types";
import { buildHsHubPath, buildHsPath, buildProductPath } from "@/lib/seo/paths";

export type InternalLink = {
  href: string;
  title: string;
  why: string;
  pageType: "product" | "hs" | "tool";
};

function dedupeLinks(links: InternalLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }
    seen.add(link.href);
    return true;
  });
}

function toolLinks(): InternalLink[] {
  return [
    {
      href: "/calculator",
      title: "Universal Landed Cost Calculator",
      why: "Run custom values beyond the preset scenarios.",
      pageType: "tool"
    },
    {
      href: "/hs-classifier",
      title: "HS Code Finder",
      why: "Improve classification certainty before final costing.",
      pageType: "tool"
    },
    {
      href: "/compare",
      title: "Compare Scenarios",
      why: "Compare incoterm and value assumptions side-by-side.",
      pageType: "tool"
    }
  ];
}

export function generateInternalLinksForProduct(params: {
  cluster: ProductCluster;
  origin: string;
  dest: string;
}): InternalLink[] {
  const links: InternalLink[] = [];
  const candidates = getClusterHsMaps(params.cluster.id);

  for (const candidate of candidates) {
    const hasRate = Boolean(getTariffRate(candidate.hs6, params.origin, params.dest));
    if (!hasRate) {
      continue;
    }
    links.push({
      href: buildHsPath(candidate.hs6, params.origin, params.dest),
      title: `HS ${candidate.hs6} duty and VAT page`,
      why: "Same route with explicit HS classification.",
      pageType: "hs"
    });
  }

  const relatedClusters = getProductClusters().filter(
    (cluster) =>
      cluster.id !== params.cluster.id &&
      cluster.category &&
      cluster.category === params.cluster.category &&
      !cluster.canonicalClusterId
  );
  for (const related of relatedClusters) {
    links.push({
      href: buildProductPath(related.slug, params.origin, params.dest),
      title: `${related.name} import costs`,
      why: "Similar products often share procurement and compliance patterns.",
      pageType: "product"
    });
  }

  if (candidates[0]) {
    links.push({
      href: buildHsHubPath(candidates[0].hs6),
      title: `HS ${candidates[0].hs6} directory page`,
      why: "Explore nearby headings and classification guidance.",
      pageType: "hs"
    });
  }

  links.push(...toolLinks());
  links.push({
    href: "/import-duty-vat-landed-cost",
    title: "Import duty directory",
    why: "Navigate to other high-intent import routes.",
    pageType: "tool"
  });

  return dedupeLinks(links);
}

export function generateInternalLinksForHs(params: { hs6: string; origin: string; dest: string }): InternalLink[] {
  const links: InternalLink[] = [];

  for (const country of getCountries()) {
    if (country.slug === params.origin || country.slug === params.dest) {
      continue;
    }
    links.push({
      href: buildHsPath(params.hs6, country.slug, params.dest),
      title: `HS ${params.hs6} from ${country.name}`,
      why: "Compare origin impact for the same HS code.",
      pageType: "hs"
    });
  }

  const currentHs = getHsCodeBy6(params.hs6);
  if (currentHs?.chapter) {
    const siblings = getClusterHsMapsByHs(params.hs6)
      .map((mapping) => getClusterById(mapping.clusterId))
      .filter((cluster): cluster is ProductCluster => Boolean(cluster));
    for (const sibling of siblings) {
      links.push({
        href: buildProductPath(sibling.slug, params.origin, params.dest),
        title: `${sibling.name} import page`,
        why: "Related product pages in similar tariff space.",
        pageType: "product"
      });
    }
  }

  links.push(...toolLinks());
  links.push({
    href: buildHsHubPath(params.hs6),
    title: `HS ${params.hs6} hub`,
    why: "Review classification details and related routes.",
    pageType: "hs"
  });

  return dedupeLinks(links);
}

