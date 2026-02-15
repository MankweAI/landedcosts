export const SEO_BASE_PATH = "/import-duty-vat-landed-cost";

export function buildProductPath(clusterSlug: string, originIso: string, destIso: string) {
  return `${SEO_BASE_PATH}/${clusterSlug}/from/${originIso}/to/${destIso}`;
}

export function buildHsPath(hs6: string, originIso: string, destIso: string) {
  return `${SEO_BASE_PATH}/hs/${hs6}/from/${originIso}/to/${destIso}`;
}

export function buildHsHubPath(hs6: string) {
  return `${SEO_BASE_PATH}/hs/${hs6}`;
}

