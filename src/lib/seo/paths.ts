// Base path now includes destination
export const SEO_KEYWORD_SLUG = "import-duty-vat-landed-cost";

export function buildProductPath(clusterSlug: string, originIso: string, destIso: string) {
  return `/${destIso}/${SEO_KEYWORD_SLUG}/${clusterSlug}/from/${originIso}`;
}

export function buildHsPath(hs6: string, originIso: string, destIso: string) {
  return `/${destIso}/${SEO_KEYWORD_SLUG}/hs/${hs6}/from/${originIso}`;
}

export function buildHsHubPath(hs6: string, destIso: string = "south-africa") {
  return `/${destIso}/${SEO_KEYWORD_SLUG}/hs/${hs6}`;
}
